package org.ecommerce.ecommerce.controllers;

import jakarta.validation.Valid;
import org.ecommerce.ecommerce.dtos.CategoryDTO;
import org.ecommerce.ecommerce.exceptions.DataNotFoundException;
import org.ecommerce.ecommerce.models.Category;
import org.ecommerce.ecommerce.responses.CategoryListResponse;
import org.ecommerce.ecommerce.responses.DeleteResponse;
import org.ecommerce.ecommerce.responses.UpdateResponse;
import org.ecommerce.ecommerce.responses.create.CreateCategoryRepsonse;
import org.ecommerce.ecommerce.services.impl.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/categories")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @PostMapping("")
    public ResponseEntity<?> createCategory(@Valid @RequestBody CategoryDTO categoryDTO, BindingResult result) {

        if (result.hasErrors()) {
            List<String> errors = result.getFieldErrors().stream().map(FieldError::getField).toList();
            return ResponseEntity.badRequest().body(errors);
        }
        Category category = categoryService.createCategory(categoryDTO);
        return ResponseEntity.ok(CreateCategoryRepsonse.builder()
                .category(category)
                .message("Category created successfully").build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @GetMapping("")
    public ResponseEntity<?> getAllCategories(
            @RequestParam String keyword,
            @RequestParam int page, @RequestParam int limit) {
        try {
            PageRequest pageable = PageRequest.of(page, limit);
            Page<Category> categories = categoryService.getAllCategories(keyword, pageable);
            int totalPage = categories.getTotalPages();
            List<Category> categoryList = categories.getContent();
            return ResponseEntity.ok(CategoryListResponse.builder()
                    .categories(categoryList)
                    .totalPage(totalPage)
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error");
        }

    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryDTO categoryDTO, BindingResult result) throws DataNotFoundException {
        if (result.hasErrors()) {
            List<String> errors = result.getFieldErrors().stream().map(FieldError::getField).toList();
            return ResponseEntity.badRequest().body(errors);
        }
        categoryService.updateCategory(id, categoryDTO);
        return ResponseEntity.ok(UpdateResponse.builder().message("Category updated successfully").build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<DeleteResponse> deleteCategory(@PathVariable Long id) throws DataNotFoundException {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(DeleteResponse.builder()
                .message("Category deleted successfully")
                .build());
    }
}
