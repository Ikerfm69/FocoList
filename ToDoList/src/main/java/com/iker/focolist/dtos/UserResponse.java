package com.iker.focolist.dtos;

import com.iker.focolist.models.User;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserResponse {
    private Long id;
    private String userName;
    private String email;
    private String role;

    // Este método es el que falta — añádelo si no está
    public static UserResponse of(User user) {
        return new UserResponse(
                user.getId(),
                user.getUserName(),
                user.getEmail(),
                user.getRol().name()
        );
    }
}