package org.ecommerce.ecommerce.services;

import org.ecommerce.ecommerce.models.Coupon;

public interface iCouponService {
    Coupon getCouponByCode(String code);


}
