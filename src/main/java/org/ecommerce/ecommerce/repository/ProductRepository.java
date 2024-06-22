package org.ecommerce.ecommerce.repository;

import org.ecommerce.ecommerce.models.Color;
import org.ecommerce.ecommerce.models.Product;
import org.ecommerce.ecommerce.models.ProductSize;
import org.ecommerce.ecommerce.responses.ProductRatingResponse;
import org.ecommerce.ecommerce.responses.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Map;

public interface ProductRepository extends JpaRepository<Product, Long> {

    boolean existsByName(String name);
    List<Product> findByCategoryId(Long categoryId);
    @Query("SELECT p FROM Product p WHERE " +
            "(:categoryId IS NULL OR :categoryId = 0 OR p.category.id = :categoryId) " +
            "AND (:keyword IS NULL OR :keyword = '' OR p.name LIKE %:keyword% OR p.description LIKE %:keyword%)")
    Page<Product> searchProducts(@Param("categoryId") Long categoryId, @Param("keyword") String keyword, Pageable pageable);


    @Query("SELECT p from Product p where p.id IN :productIds")
    List<Product> getProductByIds(@Param("productIds") List<Long> productIds);

    List<Product> findAllByCategoryId(Long category_id);
    @Query("SELECT c FROM Product c WHERE LOWER(c.name) LIKE CONCAT('%', LOWER(:category_name), '%')")
    List<Product> findAllByCategoryName(@Param("category_name") String category_name);

    @Query("SELECT new org.ecommerce.ecommerce.responses.ProductRatingResponse(c.product.id, avg(c.rating),COUNT(*)) from Comment c group by c.product.id order by c.product.id desc")
    List<ProductRatingResponse> getRatingProducts();

    @Query("select c.productSizes from Product c where c.id = :id")
    List<ProductSize> getProductSizesByProductId(Long id);


}
