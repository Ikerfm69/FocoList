package com.iker.focolist.shared.error;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<String> handleRuntimeException(RuntimeException e){
        String message = e.getMessage();

        // Devolver 409 Conflict si el usuario ya existe
        if(message != null && message.contains("ya existe")){
            return ResponseEntity.status(HttpStatus.CONFLICT).body(message);
        }

        // Devolver 400 Bad Request para otros errores de validación
        if(message != null && message.contains("no encontrado")){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(message);
        }

        // Devolver 403 Forbidden solo para permisos
        if(message != null && message.contains("permisos")){
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(message);
        }

        // Por defecto 400 Bad Request
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
    }
}