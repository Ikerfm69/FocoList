package com.iker.focolist.dtos;

import com.iker.focolist.models.User;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserSecure {
    private Long id;

    private String userName;

    private String email;

    private LocalDateTime createdAt;

    private User.Role Rol;
}
