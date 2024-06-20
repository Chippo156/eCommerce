package org.ecommerce.ecommerce.repository;

import org.ecommerce.ecommerce.models.Color;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ColorRepository extends JpaRepository<Color, Long> {

    @Query("SELECT DISTINCT c.code FROM Color c")
    List<String> getCodeColors();
}
