package org.ecommerce.ecommerce.services;

import org.ecommerce.ecommerce.dtos.ColorDTO;
import org.ecommerce.ecommerce.models.Color;

import java.util.List;

public interface iColorService {
    Color saveColor(ColorDTO colorDTO);
    List<String> getCodeColors();
}
