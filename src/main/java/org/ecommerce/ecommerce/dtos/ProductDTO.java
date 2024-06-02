package org.ecommerce.ecommerce.dtos;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.Column;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class ProductDTO {


    @JsonProperty("product_name")
    @NotBlank
    @Size(min = 3, max = 300,message = "Product name must be between 3 and 300 characters")
    private String productName;
    private double price;
    private String thumbnail;
    private String description;
    private String size;
    private String color;
    @JsonProperty("category_id")
    private Long categoryId;
}
