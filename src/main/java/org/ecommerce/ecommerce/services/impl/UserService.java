package org.ecommerce.ecommerce.services.impl;

import org.ecommerce.ecommerce.components.JwtTokenUtils;
import org.ecommerce.ecommerce.dtos.UserDTO;
import org.ecommerce.ecommerce.exceptions.DataNotFoundException;
import org.ecommerce.ecommerce.models.Role;
import org.ecommerce.ecommerce.models.User;
import org.ecommerce.ecommerce.repository.RoleRepository;
import org.ecommerce.ecommerce.repository.UserRepository;
import org.ecommerce.ecommerce.services.iUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService implements iUserService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private JwtTokenUtils jwtTokenUtils;
    @Override
    public User createUser(UserDTO userDto) throws Exception {
        String phoneNumber = userDto.getPhoneNumber();
        if (userRepository.existsByPhoneNumber(phoneNumber)) {
            throw new Exception("Phone number already exists");
        }

       User user =  User.builder()
                .fullName(userDto.getFullName())
                .phoneNumber(userDto.getPhoneNumber())
                .password(userDto.getPassword())
                .address(userDto.getAddress())
                .dateOfBirth(userDto.getDateOfBirth())
                .facebookAccountId(userDto.getFacebookAccountId())
                .googleAccountId(userDto.getGoogleAccountId())
               .isActive(true)
                .build();

        Role role = roleRepository.findById(userDto.getRoleId()).orElseThrow(() -> new Exception("Role not found"));
        user.setRole(role);
        if (userDto.getFacebookAccountId() == 0 && userDto.getGoogleAccountId() == 0) {
            String password = userDto.getPassword();
            String passwordEncoded = passwordEncoder.encode(password);
            user.setPassword(passwordEncoded);
        }
        return userRepository.save(user);
    }
    @Override
    public String login(String phoneNumber, String password) throws DataNotFoundException {
        Optional<User> user = userRepository.findByPhoneNumber(phoneNumber);
        if(user.isEmpty())
        {
            throw new DataNotFoundException("User not found");
        }
        User existingUser = user.get();
        //Check password
        if(existingUser.getFacebookAccountId() == 0 && existingUser.getGoogleAccountId() == 0)
        {
            if(!passwordEncoder.matches(password,existingUser.getPassword()))
            {
                throw new BadCredentialsException("Invalid password");
            }
        }
        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                phoneNumber,password,existingUser.getAuthorities()
        );
        authenticationManager.authenticate(authenticationToken);
        return jwtTokenUtils.generateToken(existingUser);
    }
}
