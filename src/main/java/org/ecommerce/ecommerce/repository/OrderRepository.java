package org.ecommerce.ecommerce.repository;

import org.ecommerce.ecommerce.models.Order;
import org.ecommerce.ecommerce.responses.OrderResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface OrderRepository  extends JpaRepository<Order, Long> {
    List<Order> findOrderByUserId(Long userId);


//    @Query("SELECT o from Order o WHERE :keyword is NULL OR :keyword = '' " +
//            "OR o.fullName LIKE %:keyword% " +
//            "OR o.status LIKE %:keyword%" +
//            "OR o.phoneNumber LIKE %:keyword%" +
//            "OR o.address LIKE %:keyword% " )
    @Query("SELECT o FROM Order o WHERE :keyword IS NULL OR :keyword = '' OR " +
            "o.fullName LIKE %:keyword% OR o.address " +
            "LIKE %:keyword% OR o.note LIKE %:keyword%  OR o.email LIKE %:keyword%")
    Page<Order> getAllOrders(@Param("keyword") String keyword,
                             Pageable pageable);
}
