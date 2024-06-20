package org.ecommerce.ecommerce.repository;

import org.ecommerce.ecommerce.models.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
    List<OrderDetail> findByOrderId(Long orderId);

    @Query("SELECT od.product.id, SUM(od.numberOfProducts) as numberOfProduct FROM OrderDetail od WHERE od.product.id IS NOT NULL GROUP BY od.product.id")
    List<Object[]> countNumberOfProduct();
}
