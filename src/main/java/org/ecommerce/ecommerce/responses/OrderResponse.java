package org.ecommerce.ecommerce.responses;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;
import org.ecommerce.ecommerce.models.Order;

import java.time.LocalDateTime;
import java.util.Date;

@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Builder
public class OrderResponse {
    @JsonProperty("user_id")
    private Long userId;
    @JsonProperty("full_name")
    private String fullName;
    private String email;
    @JsonProperty("phone_number")
    private String phoneNumber;
    private String address;
    private String note;
    private String status;
    private Date orderDate;
    @JsonProperty("total_money")
    private double totalMoney;
    @JsonProperty("shipping_method")

    private String shippingMethod;
    @JsonProperty("payment_method")
    private String paymentMethod;
    @JsonProperty("shipping_address")
    private String shippingAddress;
    @JsonProperty("shipping_date")
    private String trackingNumber;
    private boolean active;

    public static OrderResponse fromOrder(Order order)
    {
        return OrderResponse.builder()
                .userId(order.getUser().getId())
                .fullName(order.getFullName())
                .email(order.getEmail())
                .phoneNumber(order.getPhoneNumber())
                .address(order.getAddress())
                .note(order.getNote())
                .status(order.getStatus())
                .orderDate(order.getOrderDate())
                .totalMoney(order.getTotalMoney())
                .shippingMethod(order.getShippingMethod())
                .paymentMethod(order.getPaymentMethod())
                .shippingAddress(order.getShippingAddress())
                .trackingNumber(order.getTrackingNumber())
                .active(order.isActive())
                .build();
    }


}
