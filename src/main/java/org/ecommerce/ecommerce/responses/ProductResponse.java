package org.ecommerce.ecommerce.responses;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.ecommerce.ecommerce.models.BaseEntity;
import org.ecommerce.ecommerce.models.Product;
import org.ecommerce.ecommerce.models.ProductImage;

import java.util.ArrayList;
import java.util.List;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class ProductResponse extends  BaseResponse   {
    @JsonProperty("product_name")
    private String name;
    private String description;
    private double price;
    private String thumbnail;
    @JsonProperty("category_id")
    private Long categoryId;
    @JsonProperty("product_images")
    private String size;
    private String color;
    private List<ProductImage> productImages = new ArrayList<>();

    public static ProductResponse fromProduct(Product product) {
        ProductResponse productResponse = ProductResponse.builder()
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .thumbnail(product.getThumbnail())
                .size(product.getSize())
                .color(product.getColor())
                .categoryId(product.getCategory().getId())
                .productImages(product.getProductImages())
                .build();
        productResponse.setCreatedAt(product.getCreatedAt());
        productResponse.setUpdatedAt(product.getUpdatedAt());
        return productResponse;
    }
}
