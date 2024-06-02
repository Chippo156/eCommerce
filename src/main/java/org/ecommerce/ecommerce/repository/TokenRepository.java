package org.ecommerce.ecommerce.repository;

import org.ecommerce.ecommerce.models.Token;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TokenRepository extends JpaRepository<Token, Long> {
}
