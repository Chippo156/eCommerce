package org.ecommerce.ecommerce.services;

import org.ecommerce.ecommerce.dtos.OrderDTO;
import org.ecommerce.ecommerce.exceptions.DataNotFoundException;
import org.ecommerce.ecommerce.models.Order;
import org.ecommerce.ecommerce.responses.OrderResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface iOrderService {
    Order createOrder(OrderDTO orderDTO) throws DataNotFoundException;
    Order updateOrder(Long orderId, OrderDTO orderDTO) throws DataNotFoundException;
    Order getOrderById(Long orderId);
    void deleteOrder(Long orderId);

    List<Order> getOrdersByUserId(Long userId);

    Page<OrderResponse> getAllOrders(String keyword, Pageable pageable);


}
