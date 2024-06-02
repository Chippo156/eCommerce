package org.ecommerce.ecommerce.controllers;

import jakarta.validation.Valid;
import org.ecommerce.ecommerce.dtos.CategoryDTO;
import org.ecommerce.ecommerce.exceptions.DataNotFoundException;
import org.ecommerce.ecommerce.models.Category;
import org.ecommerce.ecommerce.services.impl.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
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

        if(result.hasErrors())
        {
            List<String> errors = result.getFieldErrors().stream().map(FieldError::getField).toList();
            return ResponseEntity.badRequest().body(errors);
        }
        categoryService.createCategory(categoryDTO);
        return ResponseEntity.ok("Category created successfully");
    }
    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }
    @GetMapping("")
    public ResponseEntity<List<Category>> getAllCategories() {
        return ResponseEntity.ok(categoryService.getAllCategories());
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryDTO categoryDTO, BindingResult result) throws DataNotFoundException {
        if(result.hasErrors())
        {
            List<String> errors = result.getFieldErrors().stream().map(FieldError::getField).toList();
            return ResponseEntity.badRequest().body(errors);
        }
        categoryService.updateCategory(id, categoryDTO);
        return ResponseEntity.ok("Category updated successfully");
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) throws DataNotFoundException {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok("Category deleted successfully");
    }
}
