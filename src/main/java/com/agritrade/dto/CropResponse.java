package com.agritrade.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CropResponse(
        Long id,
        String name,
        String description,
        BigDecimal price,
        Integer quantity,
        Long farmerId,
        LocalDateTime createdAt
) {}