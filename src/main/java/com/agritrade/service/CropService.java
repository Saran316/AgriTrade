package com.agritrade.service;

import com.agritrade.dto.CropRequest;
import com.agritrade.dto.CropResponse;
import com.agritrade.entity.Crop;
import com.agritrade.entity.User;
import com.agritrade.repository.CropRepository;
import com.agritrade.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@Transactional
public class CropService {

    private final CropRepository cropRepository;
    private final UserRepository userRepository;

    public CropService(
            CropRepository cropRepository,
            UserRepository userRepository) {
        this.cropRepository = cropRepository;
        this.userRepository = userRepository;
    }

    private User getCurrentUser(Authentication auth) {
        return userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED, "User not found"));
    }

    private CropResponse toResponse(Crop crop) {
        return new CropResponse(
                crop.getId(),
                crop.getName(),
                crop.getDescription(),
                crop.getPrice(),
                crop.getQuantity(),
                crop.getFarmer().getId(),
                crop.getCreatedAt()
        );
    }

    public CropResponse create(
            CropRequest request, Authentication auth) {
        User farmer = getCurrentUser(auth);

        Crop crop = new Crop();
        crop.setName(request.name());
        crop.setDescription(request.description());
        crop.setPrice(request.price());
        crop.setQuantity(request.quantity());
        crop.setFarmer(farmer);

        return toResponse(cropRepository.save(crop));
    }

    @Transactional(readOnly = true)
    public List<CropResponse> getAll() {
        return cropRepository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CropResponse getById(Long id) {
        return toResponse(findCrop(id));
    }

    public CropResponse update(
            Long id, CropRequest request, Authentication auth) {
        Crop crop = findCrop(id);
        User farmer = getCurrentUser(auth);

        if (!crop.getFarmer().getId().equals(farmer.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot update another farmer's crop");
        }

        crop.setName(request.name());
        crop.setDescription(request.description());
        crop.setPrice(request.price());
        crop.setQuantity(request.quantity());

        return toResponse(cropRepository.save(crop));
    }

    public void delete(Long id, Authentication auth) {
        Crop crop = findCrop(id);
        User farmer = getCurrentUser(auth);

        if (!crop.getFarmer().getId().equals(farmer.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "You cannot delete another farmer's crop");
        }

        cropRepository.delete(crop);
    }

    private Crop findCrop(Long id) {
        return cropRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Crop not found"));
    }
}