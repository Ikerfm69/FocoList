package com.iker.focolist.services;

import com.iker.focolist.models.User;
import com.iker.focolist.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        //Busqueda de usuarios
        Optional<User> user = userRepository.findByUserName(username);
        //Comprobacion de si esta vacio o no
        if(user.isEmpty())
        {throw new UsernameNotFoundException("Usuario no encontrado sory");
        }

        User miUsuario = user.get();
        return org.springframework.security.core.userdetails.User.builder()
                .username(miUsuario.getUserName())
                .password(miUsuario.getPassword())
                .roles(miUsuario.getRol().name())
                .build();
    }


}
