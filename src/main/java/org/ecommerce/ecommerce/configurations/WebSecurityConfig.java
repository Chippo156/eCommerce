package org.ecommerce.ecommerce.configurations;

import org.ecommerce.ecommerce.filters.JwtTokenFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.annotation.web.configurers.CorsConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
public class WebSecurityConfig {

    @Value("${api.prefix}")
    private String apiPrefix;
    @Autowired
    private JwtTokenFilter jwtTokenFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class)
                .authorizeHttpRequests(requests -> {
                    requests
                            .requestMatchers(HttpMethod.POST,
                                    String.format("%s/users/register", apiPrefix)).permitAll()
                            .requestMatchers(HttpMethod.POST,
                                    String.format("%s/users/login", apiPrefix)).permitAll()
                            .requestMatchers(HttpMethod.GET,
                                    String.format("%s/products**", apiPrefix)).permitAll()
                            .requestMatchers(HttpMethod.GET,
                            String.format("%s/products/by-ids**", apiPrefix)).permitAll()
                            .requestMatchers(HttpMethod.GET,
                                    String.format("%s/products/viewImages/**", apiPrefix)).permitAll()
                            .requestMatchers(HttpMethod.GET,
                                    String.format("%s/products", apiPrefix)).permitAll()
                            .requestMatchers(HttpMethod.POST,
                                    String.format("%s/orders", apiPrefix)).permitAll()
                            .requestMatchers(HttpMethod.GET,
                                    String.format("%s/orders**", apiPrefix)).permitAll()
                            .anyRequest().authenticated();

                })
                .csrf(AbstractHttpConfigurer::disable);
        http.cors(new Customizer<CorsConfigurer<HttpSecurity>>() {
            @Override
            public void customize(CorsConfigurer<HttpSecurity> httpSecurityCorsConfigurer) {
                CorsConfiguration configuration = new CorsConfiguration();
                configuration.setAllowedOrigins(List.of("*"));
                configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE","PATCH","OPTIONS"));
                configuration.setAllowedHeaders(Arrays.asList("authorization", "x-auth-token", "content-type"));
                configuration.setExposedHeaders(List.of("x-auth-token"));
                UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
                source.registerCorsConfiguration("/**", configuration);
                httpSecurityCorsConfigurer.configurationSource(source);
            }
        });
        return http.build();
    }
}
