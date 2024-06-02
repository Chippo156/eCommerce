package org.ecommerce.ecommerce.controllers;

import jakarta.validation.Valid;
import org.ecommerce.ecommerce.dtos.OrderDetailDTO;
import org.ecommerce.ecommerce.responses.OrderDetaiResponse;
import org.ecommerce.ecommerce.services.impl.OrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/order-details")
public class OrderDetailController {
    @Autowired
    private OrderDetailService orderDetailService;

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
            return ResponseEntity.ok("Order detail deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
