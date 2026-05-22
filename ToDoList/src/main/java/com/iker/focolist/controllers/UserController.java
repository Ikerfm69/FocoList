package com.iker.focolist.controllers;

import com.iker.focolist.dtos.UserSecure;
import com.iker.focolist.models.User;
import com.iker.focolist.services.UserService;
import io.swagger.v3.oas.annotations.Operation;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;
    @Autowired
    private ModelMapper modelMapper;


    @Operation(summary = "Registrar un usuario", description = "Crea un usuario desde el controlador de usuarios")
    @PostMapping ("/register")
    public UserSecure createUser(@Valid @RequestBody User user){
        User created = userService.createUser(user);
        return modelMapper.map(created, UserSecure.class);
    }
    @PutMapping("/{id}/password")
    public User updatePassword(@RequestBody User user, @PathVariable Long id){
        user.setId(id);
        return userService.updatePassword(user);
    }
    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id){
        userService.deleteUser(id);
    }

    @PutMapping("/profile")
    public UserSecure updateProfile(@RequestBody User user) {
        User updatedUser = userService.updateProfile(user);
        return modelMapper.map(updatedUser, UserSecure.class);
    }

    @GetMapping
    public java.util.List<UserSecure> getAllUsers() {
        return userService.findAll().stream()
                .map(u -> modelMapper.map(u, UserSecure.class))
                .toList();
    }

    @GetMapping("/{id}")
    public UserSecure getUserById(@PathVariable Long id) {
        return modelMapper.map(userService.findById(id), UserSecure.class);
    }

    @PutMapping("/{id}/promote")
    public UserSecure promoteToGestor(@PathVariable Long id) {
        return modelMapper.map(userService.promoteToGestor(id), UserSecure.class);
    }

    @PutMapping("/{id}/demote")
    public UserSecure demoteToUser(@PathVariable Long id) {
        return modelMapper.map(userService.demoteToUser(id), UserSecure.class);
    }

    @PutMapping("/{id}")
    public UserSecure updateUserByAdmin(@PathVariable Long id, @RequestBody User user) {
        return modelMapper.map(userService.updateUserByAdmin(id, user), UserSecure.class);
    }
}
