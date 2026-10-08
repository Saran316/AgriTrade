package com.agritrade.controller;

import com.agritrade.dto.OrderRequest;
import com.agritrade.dto.OrderResponse;
import com.agritrade.entity.OrderStatus;
import com.agritrade.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@SecurityRequirement(name = "bearerAuth")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    // =========================
    // CREATE ORDER
    // POST /api/orders
    // =========================
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody OrderRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        OrderResponse response =
                orderService.createOrder(request, email);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    // =========================
    // GET MY ORDERS
    // GET /api/orders
    // =========================
    @GetMapping
    public ResponseEntity<List<OrderResponse>> getMyOrders(
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                orderService.getMyOrders(email)
        );
    }

    // =========================
    // GET ORDER BY ID
    // GET /api/orders/{id}
    // =========================
    @GetMapping("/{id}")
    public ResponseEntity<OrderResponse> getOrderById(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                orderService.getOrderById(id, email)
        );
    }

    // =========================
    // UPDATE ORDER STATUS
    // PUT /api/orders/{id}/status
    // =========================
    @PutMapping("/{id}/status")
    public ResponseEntity<OrderResponse> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam OrderStatus status) {

        OrderResponse response =
                orderService.updateOrderStatus(id, status);

        return ResponseEntity.ok(response);
    }
    // =========================
// CANCEL ORDER
// PUT /api/orders/{id}/cancel
// =========================
    @PutMapping("/{id}/cancel")
    public ResponseEntity<OrderResponse> cancelOrder(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        OrderResponse response =
                orderService.cancelOrder(id, email);

        return ResponseEntity.ok(response);
    }
}