package com.agritrade.service;

import com.agritrade.entity.Crop;
import com.agritrade.entity.Order;
import com.agritrade.entity.OrderStatus;
import com.agritrade.entity.User;
import com.agritrade.exception.BusinessException;
import com.agritrade.exception.ResourceNotFoundException;
import com.agritrade.repository.CropRepository;
import com.agritrade.repository.OrderRepository;
import com.agritrade.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private CropRepository cropRepository;

    @Mock
    private UserRepository userRepository;

    private OrderService orderService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        orderService = new OrderService(
                orderRepository,
                cropRepository,
                userRepository
        );
    }

    @Test
    void getOrderById_shouldThrowExceptionWhenOrderDoesNotExist() {

        User user = new User();
        user.setId(1L);
        user.setEmail("sakthi@example.com");

        when(userRepository.findByEmail("sakthi@example.com"))
                .thenReturn(Optional.of(user));

        when(orderRepository.findById(999L))
                .thenReturn(Optional.empty());

        assertThrows(
                ResourceNotFoundException.class,
                () -> orderService.getOrderById(
                        999L,
                        "sakthi@example.com"
                )
        );

        verify(orderRepository).findById(999L);
    }

    @Test
    void getOrderById_shouldRejectAnotherUsersOrder() {

        User customer = new User();
        customer.setId(1L);
        customer.setEmail("sakthi@example.com");

        User anotherUser = new User();
        anotherUser.setId(2L);
        anotherUser.setEmail("other@example.com");

        Order order = new Order();
        order.setCustomer(anotherUser);

        when(userRepository.findByEmail("sakthi@example.com"))
                .thenReturn(Optional.of(customer));

        when(orderRepository.findById(1L))
                .thenReturn(Optional.of(order));

        assertThrows(
                BusinessException.class,
                () -> orderService.getOrderById(
                        1L,
                        "sakthi@example.com"
                )
        );
    }

    @Test
    void updateOrderStatus_shouldChangeStatus() {

        Order order = new Order();
        order.setStatus(OrderStatus.PENDING);

        when(orderRepository.findById(1L))
                .thenReturn(Optional.of(order));

        when(orderRepository.save(order))
                .thenReturn(order);

        var result = orderService.updateOrderStatus(
                1L,
                OrderStatus.CONFIRMED
        );

        assertEquals(
                OrderStatus.CONFIRMED,
                result.status()
        );

        verify(orderRepository).save(order);
    }

    @Test
    void updateOrderStatus_shouldRejectCancelledOrder() {

        Order order = new Order();
        order.setStatus(OrderStatus.CANCELLED);

        when(orderRepository.findById(1L))
                .thenReturn(Optional.of(order));

        assertThrows(
                BusinessException.class,
                () -> orderService.updateOrderStatus(
                        1L,
                        OrderStatus.CONFIRMED
                )
        );

        verify(orderRepository, never()).save(any());
    }
}