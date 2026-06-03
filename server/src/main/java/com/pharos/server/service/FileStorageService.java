package com.pharos.server.service;

import com.pharos.server.entity.FileMetadata;
import com.pharos.server.entity.User;
import com.pharos.server.repository.FileMetadataRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;
    private final FileMetadataRepository fileRepository;

    // Constructor: Injects our database repos and creates the 'uploads' folder if it doesn't exist
    public FileStorageService(@Value("${app.storage.upload-dir}") String uploadDir, FileMetadataRepository fileRepository){
        this.fileRepository=fileRepository;
        this.fileStorageLocation=Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        }
        catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public FileMetadata storeFile(MultipartFile file, User uploader){
        if (file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cannot upload an empty file");
        }

        String originalFilename = StringUtils.cleanPath(
                file.getOriginalFilename() == null ? "uploaded-file" : file.getOriginalFilename()
        );
        if (originalFilename.contains("..")) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid file name");
        }

        String fileExtension = "";
        int extensionIndex = originalFilename.lastIndexOf(".");
        if (extensionIndex >= 0) {
            fileExtension = originalFilename.substring(extensionIndex);
        }
        String uniqueFilename=UUID.randomUUID().toString()+fileExtension;

        try{
            //3. Save physical file to disk
            Path targetLocation=this.fileStorageLocation.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            //4. Save metadata to NeonDB PostgreSQL
            FileMetadata fileMetadata=FileMetadata.builder().originalFilename(originalFilename).storagePath(targetLocation.toString()).fileSize(file.getSize()).contentType(file.getContentType()).uploader(uploader).build();
            return fileRepository.save(fileMetadata);
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not store file. Please try again.", ex);
        }

    }

    public List<FileMetadata> listFiles(User uploader) {
        return fileRepository.findByUploaderIdOrderByCreatedAtDesc(uploader.getId());
    }

    public StoredFile getFileForDownload(UUID fileId, User uploader) {
        FileMetadata metadata = getOwnedFile(fileId, uploader);
        Path filePath = Paths.get(metadata.getStoragePath()).toAbsolutePath().normalize();

        if (!Files.exists(filePath)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Stored file is missing");
        }

        return new StoredFile(metadata, filePath);
    }

    public void deleteFile(UUID fileId, User uploader) {
        FileMetadata metadata = getOwnedFile(fileId, uploader);
        Path filePath = Paths.get(metadata.getStoragePath()).toAbsolutePath().normalize();

        try {
            Files.deleteIfExists(filePath);
            fileRepository.delete(metadata);
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not delete file", ex);
        }
    }

    private FileMetadata getOwnedFile(UUID fileId, User uploader) {
        return fileRepository.findByIdAndUploaderId(fileId, uploader.getId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "File not found"));
    }

    public record StoredFile(FileMetadata metadata, Path path) {}
}
