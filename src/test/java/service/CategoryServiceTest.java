package com.agritrade.service;

import com.agritrade.entity.Category;
import com.agritrade.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    private CategoryService categoryService;

    @BeforeEach
    void setUp() {

        MockitoAnnotations.openMocks(this);

        categoryService =
                new CategoryService(categoryRepository);
    }

    @Test
    void getCategoryById_shouldThrowExceptionWhenNotFound() {

        when(categoryRepository.findById(999L))
                .thenReturn(Optional.empty());

        assertThrows(
                RuntimeException.class,
                () -> categoryService.getById(999L)
        );
    }

    @Test
    void deleteCategory_shouldThrowExceptionWhenNotFound() {

        when(categoryRepository.existsById(999L))
                .thenReturn(false);

        assertThrows(
                RuntimeException.class,
                () -> categoryService.delete(999L)
        );
    }
}