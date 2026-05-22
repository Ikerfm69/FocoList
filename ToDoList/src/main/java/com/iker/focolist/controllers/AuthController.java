package com.iker.focolist.controllers;

import com.iker.focolist.dtos.LoginRequest;
import com.iker.focolist.dtos.LoginResponse;
import com.iker.focolist.dtos.UserResponse;
import com.iker.focolist.dtos.UserSecure;
import com.iker.focolist.models.User;
import com.iker.focolist.repositories.UserRepository;
import com.iker.focolist.services.UserService;
import jakarta.validation.Valid;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;
    @Autowired
    private ModelMapper modelMapper;

    @Operation(summary = "Registrar un usuario", description = "Crea un nuevo usuario y lo guarda en base de datos")
    @PostMapping ("/register")
    public UserSecure createUser(@Valid @RequestBody User user){
        User created = userService.createUser(user);

        return modelMapper.map(created, UserSecure.class);
    }

    @Operation(summary = "Autenticarse", description = "Valida credenciales. Retorna información del usuario si son correctas")
    @PostMapping("/login")
    public LoginResponse login(@Valid @RequestBody LoginRequest request) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUserName(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByUserName(request.getUserName())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return new LoginResponse(
                "Login correcto",
                user.getUserName(),
                user.getRol().name()
        );
    }

    @Operation(summary = "Datos del usuario actual", description = "Retorna los datos del usuario logueado en Basic Auth")
    @GetMapping("/me")
    public UserResponse me(Authentication authentication) {
        String username = authentication.getName();

        User user = userRepository.findByUserName(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        return new UserResponse(
                user.getId(),
                user.getUserName(),
                user.getEmail(),
                user.getRol().name()
        );
    }

    @Operation(summary = "Cerrar sesión", description = "Endpoint de logout sin estado")
    @PostMapping("/logout")
    public LoginResponse logout() {
        return new LoginResponse("Logout correcto (Stateless)", null, null);
    }
}