package com.iker.focolist.services;

import com.iker.focolist.models.User;
import com.iker.focolist.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private BCryptPasswordEncoder encoder;

    public User createUser(User user){

        if(userRepository.existsByEmail(user.getEmail()) || userRepository.existsByUserName(user.getUserName())){

            throw new RuntimeException("El usuario ya existe");
        }else{
            String contrasena = user.getPassword();
            String encriptada = encoder.encode(contrasena);
            user.setPassword(encriptada);

            if(user.getRol() == null){
                user.setRol(User.Role.USER);
            }

        }
        return userRepository.save(user);
    }
    private User getCurrentUser(){
        // La variable username se usa para obtener el usuario que previamente se logueó
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional <User> busqueda = userRepository.findByUserName(username);
        if(busqueda.isEmpty()){throw new RuntimeException("Usuario no encontrado");}
        return busqueda.get();
    }
    public User updatePassword (User user){

        User usuarioExistente = userRepository.findById(user.getId()).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if(!usuarioExistente.getUserName().equals(getCurrentUser().getUserName())){
            throw new RuntimeException("No tienes permisos para hacer esto");
        }
        String contrasenaNueva = user.getPassword();
        String encriptacion = encoder.encode(contrasenaNueva);
        usuarioExistente.setPassword(encriptacion);
        return userRepository.save(usuarioExistente);
    }
    public void deleteUser(Long id){
        User usuarioExistente = userRepository.findById(id).orElseThrow(()-> new RuntimeException("Usuario no encontrado"));
        if(!usuarioExistente.getUserName().equals(getCurrentUser().getUserName())){
            throw new RuntimeException("No tienes permisos para hacer esto");
        }
        userRepository.deleteById(id);
    }

    public User updateProfile(User userDetails) {
        User currentUser = getCurrentUser();
        if (userDetails.getUserName() != null && !userDetails.getUserName().isBlank()) {
            currentUser.setUserName(userDetails.getUserName());
        }
        if (userDetails.getEmail() != null && !userDetails.getEmail().isBlank()) {
            currentUser.setEmail(userDetails.getEmail());
        }
        if (userDetails.getPassword() != null && !userDetails.getPassword().isBlank()) {
            currentUser.setPassword(encoder.encode(userDetails.getPassword()));
        }
        return userRepository.save(currentUser);
    }

    public User updateUserByAdmin(Long id, User userDetails) {
        User targetUser = findById(id);
        if (userDetails.getUserName() != null && !userDetails.getUserName().isBlank()) {
            targetUser.setUserName(userDetails.getUserName());
        }
        if (userDetails.getEmail() != null && !userDetails.getEmail().isBlank()) {
            targetUser.setEmail(userDetails.getEmail());
        }
        if (userDetails.getPassword() != null && !userDetails.getPassword().isBlank()) {
            targetUser.setPassword(encoder.encode(userDetails.getPassword()));
        }
        return userRepository.save(targetUser);
    }

    public java.util.List<User> findAll() {
        return userRepository.findAll();
    }

    public User findById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }

    public User promoteToGestor(Long id) {
        User user = findById(id);
        user.setRol(User.Role.GESTOR);
        return userRepository.save(user);
    }

    public User demoteToUser(Long id) {
        User user = findById(id);
        user.setRol(User.Role.USER);
        return userRepository.save(user);
    }

    public User changeRole(Long id, User.Role newRole) {
        User user = findById(id);
        user.setRol(newRole);
        return userRepository.save(user);
    }
}
