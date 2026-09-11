package com.storechain.order.repository;

import com.storechain.order.entities.OrderDetail;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderInventoryRepository extends JpaRepository<OrderDetail, Long> {

    List<OrderDetail> findByOrderId(Long orderId);

    void deleteByOrderId(Long orderId);
}