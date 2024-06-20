package org.ecommerce.ecommerce.controllers;

import lombok.RequiredArgsConstructor;
import org.ecommerce.ecommerce.services.impl.ColorService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/colors")
@RequiredArgsConstructor
public class ColorController {
    private final ColorService colorService;
    @GetMapping("/codes")
    public List<String> getCodeColors(){
        return colorService.getCodeColors();
    }
}
