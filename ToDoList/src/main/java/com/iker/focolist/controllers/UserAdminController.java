package com.iker.focolist.controllers;

import com.iker.focolist.dtos.UserResponse;
import com.iker.focolist.models.User;
import com.iker.focolist.services.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/admin/user")
public class UserAdminController {

    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<UserResponse>> listUsers() {
        List<UserResponse> users = userService.findAll().stream()
                .map(UserResponse::of)
                .toList();
        return ResponseEntity.ok(users);
    }

    @PatchMapping("/{id}/promote")
    public ResponseEntity<UserResponse> makeAdmin(@PathVariable Long id) {
        // Ejecutamos el cambio de rol en el servicio
        User updatedUser = userService.changeRole(id, User.Role.ADMIN);

        // Devolvemos el usuario modificado convertido a DTO con un 200 OK
        return ResponseEntity.ok(UserResponse.of(updatedUser));
    }

    @PatchMapping("/{id}/promote-gestor")
    public ResponseEntity<UserResponse> makeGestor(@PathVariable Long id) {
        User updatedUser = userService.changeRole(id, User.Role.GESTOR);
        return ResponseEntity.ok(UserResponse.of(updatedUser));
    }

    @PatchMapping("/{id}/demote-user")
    public ResponseEntity<UserResponse> demoteToUser(@PathVariable Long id) {
        User updatedUser = userService.changeRole(id, User.Role.USER);
        return ResponseEntity.ok(UserResponse.of(updatedUser));
    }
}
