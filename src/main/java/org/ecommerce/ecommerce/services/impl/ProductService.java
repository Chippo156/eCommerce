package org.ecommerce.ecommerce.services.impl;

import org.ecommerce.ecommerce.dtos.ProductDTO;
import org.ecommerce.ecommerce.dtos.ProductImageDTO;
import org.ecommerce.ecommerce.exceptions.DataNotFoundException;
import org.ecommerce.ecommerce.exceptions.InvalidParamException;
import org.ecommerce.ecommerce.models.Category;
import org.ecommerce.ecommerce.models.Product;
import org.ecommerce.ecommerce.models.ProductImage;
import org.ecommerce.ecommerce.repository.CategoryRepository;
import org.ecommerce.ecommerce.repository.ProductImageRepository;
import org.ecommerce.ecommerce.repository.ProductRepository;
import org.ecommerce.ecommerce.responses.ProductResponse;
import org.ecommerce.ecommerce.services.iProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
public class ProductService implements iProductService {

    @Autowired
    private ProductRepository productRepository;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ProductImageRepository productImageRepository;
    @Override
    public Product createProduct(ProductDTO productDTO) throws DataNotFoundException {
        Category category = categoryRepository.findById(productDTO.getCategoryId()).orElseThrow(() -> new DataNotFoundException("Cannot find category with id: " + productDTO.getCategoryId())
        );
        Product product = Product.builder()
                .name(productDTO.getProductName())
                .price(productDTO.getPrice())
                .description(productDTO.getDescription())
                .thumbnail(productDTO.getThumbnail())
                .color(productDTO.getColor())
                .size(productDTO.getSize())
                .category(category)
                .build();
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Long productId, ProductDTO productDTO) throws DataNotFoundException {
        try {
            Product product = productRepository.findById(productId).orElseThrow(() -> new Exception("Cannot find product with id: " + productId));
            product.setName(productDTO.getProductName());
            product.setPrice(productDTO.getPrice());
            product.setDescription(productDTO.getDescription());
            product.setThumbnail(productDTO.getThumbnail());
            product.setColor(productDTO.getColor());
            product.setSize(productDTO.getSize());
            Category category = categoryRepository.findById(productDTO.getCategoryId()).orElseThrow(() -> new DataNotFoundException("Cannot find category with id: " + productDTO.getCategoryId()));
            product.setCategory(category);
            return productRepository.save(product);
        } catch (Exception e) {
            throw new DataNotFoundException("Cannot find product with id: " + productId);
        }
    }

    @Override
    public Product getProductById(Long productId) {
        return productRepository.findById(productId).orElse(null);
    }

    @Override
    public void deleteProduct(Long productId) throws DataNotFoundException {
        Product product = productRepository.findById(productId).orElseThrow(() -> new DataNotFoundException("Product not found"));
        productRepository.delete(product);
    }

    @Override
    public Page<ProductResponse> getAllProducts(String keyword, Long categoryId, PageRequest pageRequest) {
        return productRepository.searchProducts(categoryId, keyword, pageRequest).map(ProductResponse::fromProduct);
    }

    @Override
    public boolean existsByProductName(String productName) {
        return productRepository.existsByName(productName);
    }

    @Override
    public ProductImage createProductImage(Long productId, ProductImageDTO productImageDTO) throws DataNotFoundException, InvalidParamException {
        Product product = productRepository.findById(productId).orElseThrow(() -> new DataNotFoundException("Cannot find product with id: " + productId));
        ProductImage productImage = ProductImage.builder()
                .product(product)
                .image_url(productImageDTO.getImage_url())
                .build();

        int size =productImageRepository.findAllByProductId(productId).size();
        if(size >= 7){
            throw new InvalidParamException("Cannot add more than 7 images");
        }
        return productImageRepository.save(productImage);
    }
}
