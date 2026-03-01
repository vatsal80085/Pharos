package com.pharos.server.service;

import com.pharos.server.entity.FileMetadata;
import com.pharos.server.entity.User;
import com.pharos.server.repository.FileMetadataRepository;
import com.pharos.server.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    private final Path fileStorageLocation;
    private final FileMetadataRepository fileRepository;
    private final UserRepository userRepository;

    // Constructor: Injects our database repos and creates the 'uploads' folder if it doesn't exist
    public FileStorageService(@Value("${app.storage.upload-dir}") String uploadDir, FileMetadataRepository fileRepository, UserRepository userRepository){
        this.fileRepository=fileRepository;
        this.userRepository=userRepository;
        this.fileStorageLocation=Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        }
        catch (Exception ex) {
            throw new RuntimeException("Could not create the directory where the uploaded files will be stored.", ex);
        }
    }

    public FileMetadata storeFile(MultipartFile file, UUID uploaderId){
        //1. Fetch the user who is uploading (Foreign key requirement
        User uploader = userRepository.findById(uploaderId).orElseThrow(()-> new RuntimeException("User not found with ID: "+uploaderId));
        //2. Secure the filename (Rename to UUID to prevent Physical overwrites)
        String originalFilename=file.getOriginalFilename();
        String fileExtension= originalFilename.substring(originalFilename.lastIndexOf("."));
        String uniqueFilename=UUID.randomUUID().toString()+fileExtension;

        try{
            //3. Save physical file to disk
            Path targetLocation=this.fileStorageLocation.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            //4. Save metadata to NeonDB PostgreSQL
            FileMetadata fileMetadata=FileMetadata.builder().originalFilename(originalFilename).storagePath(targetLocation.toString()).fileSize(file.getSize()).contentType(file.getContentType()).uploader(uploader).build();
            return fileRepository.save(fileMetadata);
        } catch (IOException ex) {
            throw new RuntimeException("Could not store file "+originalFilename+ ". Please try Again");
        }

    }

}
