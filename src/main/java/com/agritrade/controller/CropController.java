package com.agritrade.controller;

import com.agritrade.dto.CropRequest;
import com.agritrade.dto.CropResponse;
import com.agritrade.service.CropService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

import java.util.List;

@RestController
@RequestMapping("/api/crops")
@SecurityRequirement(name = "bearerAuth")
public class CropController {

    private final CropService cropService;

    public CropController(CropService cropService) {
        this.cropService = cropService;
    }

    @PostMapping
    public CropResponse create(
            @Valid @RequestBody CropRequest request,
            Authentication authentication) {
        return cropService.create(request, authentication);
    }

    @GetMapping
    public List<CropResponse> getAll() {
        return cropService.getAll();
    }

    @GetMapping("/{id}")
    public CropResponse getById(@PathVariable Long id) {
        return cropService.getById(id);
    }

    @PutMapping("/{id}")
    public CropResponse update(
            @PathVariable Long id,
            @Valid @RequestBody CropRequest request,
            Authentication authentication) {
        return cropService.update(id, request, authentication);
    }

    @DeleteMapping("/{id}")
    public void delete(
            @PathVariable Long id,
            Authentication authentication) {
        cropService.delete(id, authentication);
    }
}