package com.agritrade.dto;

import java.math.BigDecimal;

public record OrderItemResponse(
        Long cropId,
        String cropName,
        Integer quantity,
        BigDecimal price,
        BigDecimal subtotal
) {
}