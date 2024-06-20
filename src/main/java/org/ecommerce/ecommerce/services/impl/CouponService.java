package org.ecommerce.ecommerce.services.impl;

import lombok.RequiredArgsConstructor;
import org.ecommerce.ecommerce.models.Coupon;
import org.ecommerce.ecommerce.repository.CouponRepository;
import org.ecommerce.ecommerce.services.iCouponService;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CouponService implements iCouponService
{
    private final CouponRepository couponRepository;


    @Override
    public Coupon getCouponByCode(String code) {
        return couponRepository.findByCode(code);
    }
}
