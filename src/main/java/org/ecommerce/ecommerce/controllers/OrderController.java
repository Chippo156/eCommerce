package org.ecommerce.ecommerce.controllers;

import jakarta.validation.Valid;
import org.ecommerce.ecommerce.dtos.OrderDTO;
import org.ecommerce.ecommerce.responses.OrderResponse;
import org.ecommerce.ecommerce.services.impl.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getOrderByUserId(@PathVariable Long userId) {
       try {
              return ResponseEntity.ok(orderService.getOrdersByUserId(userId));
       }catch (Exception e) {
           return ResponseEntity.badRequest().body(e.getMessage());
       }
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> getOrderById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(OrderResponse.fromOrder(orderService.getOrderById(id)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PostMapping("")
    public ResponseEntity<?> createOrder(@Valid @RequestBody OrderDTO orderDTO , BindingResult result)
    {
        try {
            if(result.hasErrors())
            {
                List<String> errors = result.getFieldErrors().stream().map(FieldError::getField).toList();
                return ResponseEntity.badRequest().body(errors);
            }
            return ResponseEntity.ok(OrderResponse.fromOrder(orderService.createOrder(orderDTO)));
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable Long id, @Valid @RequestBody OrderDTO orderDTO, BindingResult result) {
        try {
            if (result.hasErrors()) {
                List<String> errors = result.getFieldErrors().stream().map(FieldError::getField).toList();
                return ResponseEntity.badRequest().body(errors);
            }
            return ResponseEntity.ok(OrderResponse.fromOrder(orderService.updateOrder(id, orderDTO)));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        try {
            orderService.deleteOrder(id);
            return ResponseEntity.ok("Order deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}
