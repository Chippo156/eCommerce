package org.ecommerce.ecommerce.responses;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class LoginResponse {
    private String message;
    private String token;
}
