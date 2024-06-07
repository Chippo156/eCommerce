package org.ecommerce.ecommerce.responses;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.ecommerce.ecommerce.models.OrderDetail;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class OrderDetaiResponse {

    @JsonProperty("product_id")
    private Long productId;

    private double price;
    @JsonProperty("number_of_products")
    private int numberOfProducts;
    @JsonProperty("total_money")
    private double totalMoney;

    @JsonProperty("sub_total")
    private double subTotal;

    public static OrderDetaiResponse fromOrderDetail(OrderDetail orderDetail)
    {
        return OrderDetaiResponse.builder()

                .productId(orderDetail.getProduct().getId())
                .price(orderDetail.getPrice())
                .numberOfProducts(orderDetail.getNumberOfProducts())
                .totalMoney(orderDetail.getTotalMoney())
                .subTotal(orderDetail.getSubtotal())
                .build();
    }
}