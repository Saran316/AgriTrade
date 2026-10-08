package com.agritrade.service;

import com.agritrade.dto.CategoryRequest;
import com.agritrade.dto.CategoryResponse;
import com.agritrade.entity.Category;
import com.agritrade.repository.CategoryRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class CategoryService {

    private final CategoryRepository repository;

    public CategoryService(CategoryRepository repository) {
        this.repository = repository;
    }

    public CategoryResponse create(CategoryRequest request) {
        if (repository.existsByNameIgnoreCase(request.getName().trim())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Category already exists"
            );
        }

        Category category = new Category();
        category.setName(request.getName().trim());
        category.setDescription(request.getDescription());
        category.setActive(request.isActive());

        return toResponse(repository.save(category));
    }

    public List<CategoryResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public CategoryResponse getById(Long id) {
        return toResponse(findCategory(id));
    }

    public CategoryResponse update(Long id, CategoryRequest request) {
        Category existing = findCategory(id);
        String name = request.getName().trim();

        if (!existing.getName().equalsIgnoreCase(name)
                && repository.existsByNameIgnoreCase(name)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Category name already exists"
            );
        }

        existing.setName(name);
        existing.setDescription(request.getDescription());
        existing.setActive(request.isActive());

        return toResponse(repository.save(existing));
    }

    public void delete(Long id) {
        repository.delete(findCategory(id));
    }

    private Category findCategory(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Category not found"
                ));
    }

    private CategoryResponse toResponse(Category category) {
        return new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getDescription(),
                category.isActive(),
                category.getCreatedAt()
        );
    }
}