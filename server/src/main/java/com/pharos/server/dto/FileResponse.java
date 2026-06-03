package com.pharos.server.dto;

import java.time.LocalDateTime;
import java.util.UUID;

public record FileResponse(
        UUID id,
        String originalFilename,
        Long fileSize,
        String contentType,
        LocalDateTime createdAt
) {}
