package org.ecommerce.ecommerce.services;

import org.ecommerce.ecommerce.dtos.UserDTO;
import org.ecommerce.ecommerce.exceptions.DataNotFoundException;
import org.ecommerce.ecommerce.models.User;

public interface iUserService {
    User createUser(UserDTO userDto) throws Exception;
    String login (String phoneNumber, String password) throws DataNotFoundException;

    User getUserDetailsFromToken(String token) throws Exception;
}
