package com.agritrade.service;

import com.agritrade.dto.OrderItemRequest;
import com.agritrade.dto.OrderItemResponse;
import com.agritrade.dto.OrderRequest;
import com.agritrade.dto.OrderResponse;
import com.agritrade.entity.Crop;
import com.agritrade.entity.Order;
import com.agritrade.entity.OrderItem;
import com.agritrade.entity.OrderStatus;
import com.agritrade.entity.User;
import com.agritrade.exception.BusinessException;
import com.agritrade.exception.ResourceNotFoundException;
import com.agritrade.repository.CropRepository;
import com.agritrade.repository.OrderRepository;
import com.agritrade.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CropRepository cropRepository;
    private final UserRepository userRepository;

    public OrderService(
            OrderRepository orderRepository,
            CropRepository cropRepository,
            UserRepository userRepository) {

        this.orderRepository = orderRepository;
        this.cropRepository = cropRepository;
        this.userRepository = userRepository;
    }

    // ==========================================
    // CREATE ORDER
    // ==========================================

    @Transactional
    public OrderResponse createOrder(
            OrderRequest request,
            String email) {

        User customer = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );

        Order order = new Order();

        order.setCustomer(customer);
        order.setTotalAmount(BigDecimal.ZERO);

        List<OrderItem> orderItems = new ArrayList<>();

        BigDecimal totalAmount = BigDecimal.ZERO;

        for (OrderItemRequest itemRequest : request.items()) {

            // Find crop
            Crop crop = cropRepository
                    .findById(itemRequest.cropId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Crop not found with ID: "
                                            + itemRequest.cropId()
                            )
                    );

            // Check quantity
            if (crop.getQuantity() < itemRequest.quantity()) {

                throw new BusinessException(
                        "Insufficient stock for crop: "
                                + crop.getName()
                );
            }

            // Get current crop price
            BigDecimal price = crop.getPrice();

            // Calculate subtotal
            BigDecimal subtotal = price.multiply(
                    BigDecimal.valueOf(
                            itemRequest.quantity()
                    )
            );

            // Create order item
            OrderItem orderItem = new OrderItem();

            orderItem.setOrder(order);
            orderItem.setCrop(crop);
            orderItem.setQuantity(
                    itemRequest.quantity()
            );
            orderItem.setPrice(price);
            orderItem.setSubtotal(subtotal);

            orderItems.add(orderItem);

            // Add subtotal
            totalAmount = totalAmount.add(subtotal);

            // Reduce crop stock
            crop.setQuantity(
                    crop.getQuantity()
                            - itemRequest.quantity()
            );

            cropRepository.save(crop);
        }

        // Set order information
        order.setTotalAmount(totalAmount);
        order.setItems(orderItems);

        // Save order
        Order savedOrder = orderRepository.save(order);

        return convertToResponse(savedOrder);
    }

    // ==========================================
    // GET MY ORDERS
    // ==========================================

    public List<OrderResponse> getMyOrders(
            String email) {

        User customer = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );

        return orderRepository
                .findByCustomerId(customer.getId())
                .stream()
                .map(this::convertToResponse)
                .toList();
    }

    // ==========================================
    // GET ORDER BY ID
    // ==========================================

    public OrderResponse getOrderById(
            Long orderId,
            String email) {

        User customer = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );

        Order order = orderRepository
                .findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with ID: "
                                        + orderId
                        )
                );

        // Check ownership
        if (!order.getCustomer()
                .getId()
                .equals(customer.getId())) {

            throw new BusinessException(
                    "You are not allowed to access this order"
            );
        }

        return convertToResponse(order);
    }

    // ==========================================
    // UPDATE ORDER STATUS
    // ==========================================

    public OrderResponse updateOrderStatus(
            Long orderId,
            OrderStatus newStatus) {

        Order order = orderRepository
                .findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with ID: "
                                        + orderId
                        )
                );

        if (order.getStatus() == OrderStatus.CANCELLED) {

            throw new BusinessException(
                    "Cancelled order cannot be updated"
            );
        }

        if (order.getStatus() == OrderStatus.DELIVERED) {

            throw new BusinessException(
                    "Delivered order cannot be updated"
            );
        }

        order.setStatus(newStatus);

        Order updatedOrder =
                orderRepository.save(order);

        return convertToResponse(updatedOrder);
    }

    // ==========================================
    // CANCEL ORDER
    // ==========================================

    @Transactional
    public OrderResponse cancelOrder(
            Long orderId,
            String email) {

        User customer = userRepository
                .findByEmail(email)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found"
                        )
                );

        Order order = orderRepository
                .findById(orderId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Order not found with ID: "
                                        + orderId
                        )
                );

        // Check ownership
        if (!order.getCustomer()
                .getId()
                .equals(customer.getId())) {

            throw new BusinessException(
                    "You are not allowed to cancel this order"
            );
        }

        // Only pending orders can be cancelled
        if (order.getStatus()
                != OrderStatus.PENDING) {

            throw new BusinessException(
                    "Only pending orders can be cancelled"
            );
        }

        order.setStatus(OrderStatus.CANCELLED);

        // Restore crop stock
        for (OrderItem item : order.getItems()) {

            Crop crop = item.getCrop();

            crop.setQuantity(
                    crop.getQuantity()
                            + item.getQuantity()
            );

            cropRepository.save(crop);
        }

        Order cancelledOrder =
                orderRepository.save(order);

        return convertToResponse(cancelledOrder);
    }

    // ==========================================
    // CONVERT ENTITY → RESPONSE DTO
    // ==========================================

    private OrderResponse convertToResponse(
            Order order) {

        List<OrderItemResponse> items =
                order.getItems()
                        .stream()
                        .map(item ->
                                new OrderItemResponse(
                                        item.getCrop().getId(),
                                        item.getCrop().getName(),
                                        item.getQuantity(),
                                        item.getPrice(),
                                        item.getSubtotal()
                                )
                        )
                        .toList();

        return new OrderResponse(
                order.getId(),
                order.getTotalAmount(),
                order.getStatus(),
                order.getCreatedAt(),
                items
        );
    }
}