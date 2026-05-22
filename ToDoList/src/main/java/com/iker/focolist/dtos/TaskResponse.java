package com.iker.focolist.dtos;

import com.iker.focolist.models.Task;
import lombok.*;

import java.time.LocalDateTime;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private Task.TaskStatus status;
    private Task.TaskPriority priority;
    private LocalDateTime dueDate;
    private LocalDateTime createdAt;
    private String userName;      // Solo el nombre del usuario, no toda la información del usuario
    private Set<String> tags;     // Cojo solo los nombres de los tag
    private String categoryTitle; // Nombre de la categoría
}