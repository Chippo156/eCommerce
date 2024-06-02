package org.ecommerce.ecommerce.services;

import org.ecommerce.ecommerce.dtos.CategoryDTO;
import org.ecommerce.ecommerce.exceptions.DataNotFoundException;
import org.ecommerce.ecommerce.models.Category;

import java.util.List;

public interface iCategoryService {

    Category createCategory(CategoryDTO categoryDTO);
    Category updateCategory(Long categoryId,CategoryDTO categoryDTO) throws DataNotFoundException;
    void deleteCategory(Long categoryId) throws DataNotFoundException;
    Category getCategoryById(Long categoryId);
    List<Category> getAllCategories();


}
