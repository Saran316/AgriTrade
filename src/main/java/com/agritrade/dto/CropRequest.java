package com.agritrade.dto;

import jakarta.validation.constraints.*;
import java.math.BigDecimal;

public record CropRequest(
        @NotBlank
        @Size(max = 100)
        String name,

        @Size(max = 1000)
        String description,

        @NotNull
        @DecimalMin(value = "0.01")
        @Digits(integer = 8, fraction = 2)
        BigDecimal price,

        @NotNull
        @Min(1)
        Integer quantity
) {}