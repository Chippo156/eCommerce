package org.ecommerce.ecommerce.services.impl;

import org.ecommerce.ecommerce.dtos.OrderDTO;
import org.ecommerce.ecommerce.exceptions.DataNotFoundException;
import org.ecommerce.ecommerce.models.Order;
import org.ecommerce.ecommerce.models.OrderStatus;
import org.ecommerce.ecommerce.models.User;
import org.ecommerce.ecommerce.repository.OrderRepository;
import org.ecommerce.ecommerce.repository.UserRepository;
import org.ecommerce.ecommerce.services.iOrderService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Service
public class OrderService implements iOrderService {
    @Autowired
    private OrderRepository orderRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    @Override
    public Order createOrder(OrderDTO orderDTO) throws DataNotFoundException {

            User existingUser = userRepository.findById(orderDTO.getUserId()).orElseThrow(() -> new DataNotFoundException("User not found"));
            modelMapper.typeMap(OrderDTO.class, Order.class).addMappings(
                    mapper -> mapper.skip(Order::setId)
            );
            Order order = new Order();
            modelMapper.map(orderDTO, order);
            order.setUser(existingUser);
            order.setActive(true);
            order.setOrderDate(new Date());
            order.setStatus(OrderStatus.PENDING);
            LocalDate shippingDate = orderDTO.getShippingDate() == null ? LocalDate.now() : orderDTO.getShippingDate();
            if (shippingDate.isBefore(LocalDate.now())) {
                throw new DataNotFoundException("Data must be at least today");
            }
            order.setShippingDate(shippingDate);
            orderRepository.save(order);
            return order;

    }

    @Override
    public Order updateOrder(Long orderId, OrderDTO orderDTO) throws DataNotFoundException {

            Order existingOrder = orderRepository.findById(orderId).orElseThrow(() -> new DataNotFoundException("Cannot find order with id: " + orderId));
            User existingUser = userRepository.findById(orderDTO.getUserId()).orElseThrow(() -> new DataNotFoundException("User not found"));
        modelMapper.typeMap(OrderDTO.class, Order.class).addMappings(mapper -> {
            mapper.skip(Order::setId);
        });
            modelMapper.map(orderDTO, existingOrder);
            existingOrder.setUser(existingUser);
            return orderRepository.save(existingOrder);

    }

    @Override
    public Order getOrderById(Long orderId) {
        return orderRepository.findById(orderId).orElse(null);
    }

    @Override
    public void deleteOrder(Long orderId) {
        Order existingOrder = orderRepository.findById(orderId).orElse(null);
        if (existingOrder != null) {
            existingOrder.setActive(false);
            orderRepository.save(existingOrder);
        }
    }
    @Override
    public List<Order> getOrdersByUserId(Long userId) {
        return orderRepository.findOrderByUserId(userId);
    }
}
