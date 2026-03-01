package com.pharos.server.controller;

import com.pharos.server.entity.FileMetadata;
import com.pharos.server.service.FileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor // Lombok creates the constructor for our service automatically
public class FileController {
    // Spring will automatically inject your FileStorageService here
    private final FileStorageService fileStorageService;

    @PostMapping("/upload")
    public ResponseEntity<FileMetadata> uploadFile(
            @RequestParam("file")MultipartFile file,
            @RequestParam("uploaderId") UUID uploaderId){

        // 1. Hand the file and the ID to the Service I just built
        FileMetadata savedFile= fileStorageService.storeFile(file, uploaderId);
        // 2. Return a 200 OK status code along with the saved database record
        return ResponseEntity.ok(savedFile);
    }

}
