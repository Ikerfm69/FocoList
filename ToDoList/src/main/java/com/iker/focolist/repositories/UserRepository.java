package com.iker.focolist.repositories;

import com.iker.focolist.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface UserRepository extends JpaRepository<User, Long> {
    // Buscar por usuario para
    Optional<User> findByUserName(String username);
    // Boleano para comprobar que el email no está repetido
    Boolean existsByEmail(String email);
    // Boleano para comprobar que el username no está repetido
    Boolean existsByUserName(String userName);
}
