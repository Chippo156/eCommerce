package org.ecommerce.ecommerce.controllers;

import jakarta.validation.Valid;
import org.ecommerce.ecommerce.dtos.UserDTO;
import org.ecommerce.ecommerce.dtos.UserLoginDTO;
import org.ecommerce.ecommerce.models.User;
import org.ecommerce.ecommerce.responses.LoginResponse;
import org.ecommerce.ecommerce.responses.RegisterResponse;
import org.ecommerce.ecommerce.services.impl.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/users")
public class UserController {
    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> createUser(@Valid @RequestBody UserDTO userDTO , BindingResult result) throws Exception {
        try {
            if(result.hasErrors())
            {
                List<String> errors = result.getFieldErrors().stream().map(error -> error.getField() + " " + error.getDefaultMessage()).toList();
                return ResponseEntity.badRequest().body(errors);
            }
            if(!userDTO.getPassword().equals(userDTO.getRetypePassword()))
            {
                return ResponseEntity.badRequest().body("Password and retype password not match");
            }
            User user = userService.createUser(userDTO);
            return ResponseEntity.ok(RegisterResponse.builder().message("Register successfully").user(user).build());

        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody UserLoginDTO userLoginDTO , BindingResult result) throws Exception {
        try {
            if(result.hasErrors())
            {
                List<String> errors = result.getFieldErrors().stream().map(error -> error.getField() + " " + error.getDefaultMessage()).toList();
                return ResponseEntity.badRequest().body(errors);
            }
          String token =   userService.login(userLoginDTO.getPhoneNumber(), userLoginDTO.getPassword());
            return ResponseEntity.ok(LoginResponse.builder().message("Login successfully").token(token).build());

        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
