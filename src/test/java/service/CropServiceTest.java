package com.agritrade.service;

import com.agritrade.dto.CropRequest;
import com.agritrade.dto.CropResponse;
import com.agritrade.entity.Crop;
import com.agritrade.entity.User;
import com.agritrade.repository.CropRepository;
import com.agritrade.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class CropServiceTest {

    @Mock
    private CropRepository cropRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private Authentication authentication;

    private CropService cropService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        cropService = new CropService(
                cropRepository,
                userRepository
        );
    }

    @Test
    void getById_shouldThrowExceptionWhenCropDoesNotExist() {

        when(cropRepository.findById(999L))
                .thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> cropService.getById(999L)
        );

        assertEquals(404, exception.getStatusCode().value());
    }

    @Test
    void create_shouldCreateCropSuccessfully() {

        User farmer = new User();
        farmer.setId(1L);

        when(authentication.getName())
                .thenReturn("farmer@example.com");

        when(userRepository.findByEmail("farmer@example.com"))
                .thenReturn(Optional.of(farmer));

        CropRequest request = new CropRequest(
                "Rice",
                "Good quality rice",
                new BigDecimal("50.00"),
                100
        );

        Crop savedCrop = new Crop();
        savedCrop.setId(1L);
        savedCrop.setName("Rice");
        savedCrop.setDescription("Good quality rice");
        savedCrop.setPrice(new BigDecimal("50.00"));
        savedCrop.setQuantity(100);
        savedCrop.setFarmer(farmer);

        when(cropRepository.save(any(Crop.class)))
                .thenReturn(savedCrop);

        CropResponse response =
                cropService.create(request, authentication);

        assertNotNull(response);
        assertEquals(1L, response.id());
        assertEquals("Rice", response.name());
        assertEquals(new BigDecimal("50.00"), response.price());
        assertEquals(100, response.quantity());

        verify(cropRepository).save(any(Crop.class));
    }

    @Test
    void getAll_shouldReturnAllCrops() {

        User farmer = new User();
        farmer.setId(1L);

        Crop crop1 = new Crop();
        crop1.setId(1L);
        crop1.setName("Rice");
        crop1.setDescription("Rice crop");
        crop1.setPrice(new BigDecimal("50.00"));
        crop1.setQuantity(100);
        crop1.setFarmer(farmer);

        Crop crop2 = new Crop();
        crop2.setId(2L);
        crop2.setName("Wheat");
        crop2.setDescription("Wheat crop");
        crop2.setPrice(new BigDecimal("40.00"));
        crop2.setQuantity(200);
        crop2.setFarmer(farmer);

        when(cropRepository.findAll())
                .thenReturn(List.of(crop1, crop2));

        List<CropResponse> response = cropService.getAll();

        assertEquals(2, response.size());
        assertEquals("Rice", response.get(0).name());
        assertEquals("Wheat", response.get(1).name());

        verify(cropRepository).findAll();
    }

    @Test
    void update_shouldRejectAnotherFarmersCrop() {

        User owner = new User();
        owner.setId(1L);

        User anotherFarmer = new User();
        anotherFarmer.setId(2L);

        Crop crop = new Crop();
        crop.setId(1L);
        crop.setName("Rice");
        crop.setPrice(new BigDecimal("50.00"));
        crop.setQuantity(100);
        crop.setFarmer(owner);

        when(cropRepository.findById(1L))
                .thenReturn(Optional.of(crop));

        when(authentication.getName())
                .thenReturn("another@example.com");

        when(userRepository.findByEmail("another@example.com"))
                .thenReturn(Optional.of(anotherFarmer));

        CropRequest request = new CropRequest(
                "Updated Rice",
                "Updated description",
                new BigDecimal("60.00"),
                150
        );

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> cropService.update(
                        1L,
                        request,
                        authentication
                )
        );

        assertEquals(403, exception.getStatusCode().value());

        verify(cropRepository, never())
                .save(any(Crop.class));
    }

    @Test
    void delete_shouldRejectAnotherFarmersCrop() {

        User owner = new User();
        owner.setId(1L);

        User anotherFarmer = new User();
        anotherFarmer.setId(2L);

        Crop crop = new Crop();
        crop.setId(1L);
        crop.setName("Rice");
        crop.setFarmer(owner);

        when(cropRepository.findById(1L))
                .thenReturn(Optional.of(crop));

        when(authentication.getName())
                .thenReturn("another@example.com");

        when(userRepository.findByEmail("another@example.com"))
                .thenReturn(Optional.of(anotherFarmer));

        ResponseStatusException exception = assertThrows(
                ResponseStatusException.class,
                () -> cropService.delete(
                        1L,
                        authentication
                )
        );

        assertEquals(403, exception.getStatusCode().value());

        verify(cropRepository, never())
                .delete(any(Crop.class));
    }
}