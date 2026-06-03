package com.pharos.server.controller;

import com.pharos.server.dto.FileResponse;
import com.pharos.server.entity.FileMetadata;
import com.pharos.server.entity.User;
import com.pharos.server.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.net.MalformedURLException;
import java.nio.file.Path;
import java.util.List;
import java.util.UUID;

import static org.springframework.http.HttpStatus.INTERNAL_SERVER_ERROR;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor // Lombok creates the constructor for our service automatically
public class FileController {
    // Spring will automatically inject your FileStorageService here
    private final FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<FileResponse> uploadFile(
            @RequestParam("file")MultipartFile file,
            @AuthenticationPrincipal User uploader){

        // The authenticated JWT user owns the file; the client never supplies a user id.
        FileMetadata savedFile= fileStorageService.storeFile(file, uploader);
        // 2. Return a 200 OK status code along with the saved database record
        return ResponseEntity.ok(toResponse(savedFile));
    }

    @GetMapping
    public ResponseEntity<List<FileResponse>> listFiles(@AuthenticationPrincipal User uploader) {
        return ResponseEntity.ok(
                fileStorageService.listFiles(uploader).stream()
                        .map(this::toResponse)
                        .toList()
        );
    }

    @GetMapping("/{fileId}/download")
    public ResponseEntity<Resource> downloadFile(
            @PathVariable UUID fileId,
            @AuthenticationPrincipal User uploader
    ) {
        FileStorageService.StoredFile storedFile = fileStorageService.getFileForDownload(fileId, uploader);
        Path path = storedFile.path();

        try {
            Resource resource = new UrlResource(path.toUri());
            String contentType = storedFile.metadata().getContentType();

            return ResponseEntity.ok()
                    .contentType(contentType == null ? MediaType.APPLICATION_OCTET_STREAM : MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + storedFile.metadata().getOriginalFilename() + "\"")
                    .body(resource);
        } catch (MalformedURLException ex) {
            throw new ResponseStatusException(INTERNAL_SERVER_ERROR, "Could not read file", ex);
        }
    }

    @DeleteMapping("/{fileId}")
    public ResponseEntity<Void> deleteFile(
            @PathVariable UUID fileId,
            @AuthenticationPrincipal User uploader
    ) {
        fileStorageService.deleteFile(fileId, uploader);
        return ResponseEntity.noContent().build();
    }

    private FileResponse toResponse(FileMetadata file) {
        return new FileResponse(
                file.getId(),
                file.getOriginalFilename(),
                file.getFileSize(),
                file.getContentType(),
                file.getCreatedAt()
        );
    }
}
