package org.ecommerce.ecommerce.repository;

import org.ecommerce.ecommerce.models.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository  extends JpaRepository<Order, Long> {
    List<Order> findOrderByUserId(Long userId);
}
