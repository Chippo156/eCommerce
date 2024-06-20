package org.ecommerce.ecommerce.services.impl;


import lombok.RequiredArgsConstructor;
import org.ecommerce.ecommerce.dtos.ColorDTO;
import org.ecommerce.ecommerce.models.Color;
import org.ecommerce.ecommerce.models.Product;
import org.ecommerce.ecommerce.repository.ColorRepository;
import org.ecommerce.ecommerce.repository.ProductRepository;
import org.ecommerce.ecommerce.services.iColorService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ColorService implements iColorService {
    private final ColorRepository colorRepository;
    private final ProductRepository productService;
    @Override
    public Color saveColor(ColorDTO colorDTO) {
        Color color = new Color();
        color.setColor(colorDTO.getColor());
        color.setCode(colorDTO.getCode());
        Product product = productService.findById(colorDTO.getProductId()).orElseThrow(()->new RuntimeException("Product not found"));
        color.setProduct(product);
        return colorRepository.save(color);
    }

    @Override
    public List<String> getCodeColors() {
        return colorRepository.getCodeColors();
    }
}
