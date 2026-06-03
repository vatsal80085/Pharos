package com.pharos.server.repository;

import com.pharos.server.entity.FileMetadata;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface FileMetadataRepository extends JpaRepository<FileMetadata, UUID> {
    List<FileMetadata> findByUploaderIdOrderByCreatedAtDesc(UUID uploaderId);

    java.util.Optional<FileMetadata> findByIdAndUploaderId(UUID id, UUID uploaderId);
}
