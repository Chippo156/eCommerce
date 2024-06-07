package org.ecommerce.ecommerce.filters;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.constraints.NotNull;
import org.ecommerce.ecommerce.components.JwtTokenUtils;
import org.ecommerce.ecommerce.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.util.Pair;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;

@Component
public class JwtTokenFilter extends OncePerRequestFilter {

    @Value("${api.prefix}")
    private String apiPrefix;
    @Autowired
    private UserDetailsService userDetailsService;
    @Autowired
    private JwtTokenUtils jwtTokenUtils;
    @Override
    protected void doFilterInternal(@NotNull HttpServletRequest request, @NotNull HttpServletResponse response, @NotNull FilterChain filterChain) throws ServletException, IOException {
        try {

           if(isByPassToken(request))
           {
               filterChain.doFilter(request,response);
               return;
           }
           final String authenticationHeader =  request.getHeader("Authorization");
           if(authenticationHeader == null || !authenticationHeader.startsWith("Bearer"))
           {
               response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
               return;
           }
           final String token = authenticationHeader.substring(7);
           final String phoneNumber = jwtTokenUtils.extractPhoneNumber(token);
           if(phoneNumber != null
           && SecurityContextHolder.getContext().getAuthentication() == null)
           {
               User userDetails = (User) userDetailsService.loadUserByUsername(phoneNumber);
               if(jwtTokenUtils.validateToken(token,userDetails))
               {
                   UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                            userDetails,null,userDetails.getAuthorities()
                     );
                   authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                   SecurityContextHolder.getContext().setAuthentication(authenticationToken);
               }
           }
           filterChain.doFilter(request,response);
        } catch (Exception e) {
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
        }
    }

    private boolean isByPassToken(@NotNull HttpServletRequest request) {
        final List<Pair<String, String>> byPassTokens = Arrays.asList(
                Pair.of(String.format("%s/users/register", apiPrefix), "POST"),
                Pair.of(String.format("%s/users/login", apiPrefix), "POST"),
//                Pair.of(String.format("%s/products", apiPrefix), "GET"),
                Pair.of(String.format("%s/products/viewImages", apiPrefix), "GET"),
                Pair.of(String.format("%s/categories", apiPrefix), "GET"),
                Pair.of(String.format("%s/orders", apiPrefix), "GET"),
                Pair.of(String.format("%s/roles", apiPrefix), "GET")
        );
        for (Pair<String, String> byPassToken : byPassTokens) {
            if (request.getServletPath().contains(byPassToken.getFirst()) && request.getMethod().equals(byPassToken.getSecond())) {
                return true;
            }
        }
        return false;
    }
}
