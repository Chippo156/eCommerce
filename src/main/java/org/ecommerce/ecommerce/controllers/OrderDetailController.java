package org.ecommerce.ecommerce.controllers;

import com.github.javafaker.Faker;
import jakarta.validation.Valid;
import org.ecommerce.ecommerce.dtos.OrderDetailDTO;
import org.ecommerce.ecommerce.exceptions.DataNotFoundException;
import org.ecommerce.ecommerce.models.Product;
import org.ecommerce.ecommerce.repository.ProductRepository;
import org.ecommerce.ecommerce.responses.DeleteResponse;
import org.ecommerce.ecommerce.responses.OrderDetaiResponse;
import org.ecommerce.ecommerce.responses.ProductResponse;
import org.ecommerce.ecommerce.responses.create.SoldProductResponse;
import org.ecommerce.ecommerce.services.impl.OrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/order-details")
public class OrderDetailController {
    @Autowired
    private OrderDetailService orderDetailService;
    @Autowired
    private ProductRepository productRepository;

    @GetMapping("/order/{orderId}")
    public ResponseEntity<?> getOrderDetailByOrderId(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok(orderDetailService.findByOrderId(orderId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderDetailById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(OrderDetaiResponse.fromOrderDetail(orderDetailService.getOrderDetailById(id)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("")
    public ResponseEntity<?> createOrderDetail(@Valid @RequestBody OrderDetailDTO orderDetailDTO, BindingResult result) {
        try {
            if(result.hasErrors())
            {
                List<String> errors = result.getFieldErrors().stream().map(FieldError::getField).toList();
                return ResponseEntity.badRequest().body(errors);
            }
            return ResponseEntity.ok(OrderDetaiResponse.fromOrderDetail(orderDetailService.createOrderDetail(orderDetailDTO)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrderDetail(@PathVariable Long id, @Valid @RequestBody OrderDetailDTO orderDetailDTO, BindingResult result) {
        try {
            if (result.hasErrors()) {
                List<String> errors = result.getFieldErrors().stream().map(FieldError::getField).toList();
                return ResponseEntity.badRequest().body(errors);
            }
            return ResponseEntity.ok(OrderDetaiResponse.fromOrderDetail(orderDetailService.updateOrderDetail(id, orderDetailDTO)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrderDetail(@PathVariable Long id) {
        try {
            orderDetailService.deleteOrderDetail(id);
            return ResponseEntity.ok(DeleteResponse.builder()
                            .message("Order detail deleted successfully")
                    .build());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @GetMapping("/countQuantity")
    public ResponseEntity<?> countNumberOfProduct() {
        try {

            Map<Product,Integer> map = new HashMap<>();
            Map<Long, Integer> count = orderDetailService.countNumberOfProduct();
            count.forEach((key, value) -> {
                Product product = productRepository.findById(key).orElse(null);
                map.put(product,value);
            });
            List<SoldProductResponse> soldProductResponses = map.entrySet().stream().map(e -> SoldProductResponse.builder()
                    .productResponse(ProductResponse.fromProduct(e.getKey()))
                    .quantity(e.getValue())
                    .build()).toList();
            return ResponseEntity.ok(soldProductResponses);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("/fakeOrderDetail")
    @PreAuthorize("hasRole('ROLE_USER') or hasRole('ROLE_ADMIN')")
    public ResponseEntity<?> fakeOrderDetail() throws DataNotFoundException {
        Faker faker = new Faker();
        for(int i = 0 ;i < 2000; i++)
        {
            OrderDetailDTO orderDetailDTO = OrderDetailDTO.builder()
                    .orderId((long)faker.number().numberBetween(1,20))
                    .productId((long) faker.number().numberBetween(1,20))
                    .numberOfProducts(1000)
                    .price(2000000)
                    .subtotal(2000000)
                    .totalPrice(2000000)
                    .build();
            orderDetailService.createOrderDetail(orderDetailDTO);
        }
        return ResponseEntity.ok("Success");
    }
}