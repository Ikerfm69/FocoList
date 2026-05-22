package com.iker.focolist.repositories;

import com.iker.focolist.models.Task;
import com.iker.focolist.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task>findByStatus(Task.TaskStatus status);

    List<Task> findByPriority(Task.TaskPriority priority);
    // Contar filas por estado exacto
    long countByStatusAndUser(Task.TaskStatus status, User user);
    // Contar filas por usuario
    long countByUser(User user);
    // Buscar por estado y que no esten completa
    List <Task> findByStatusNotAndDueDateLessThanEqualAndUser(Task.TaskStatus status, LocalDateTime date, User user);

    // Buscar por usuario
    List<Task>findByUser(User user);

    // Filtrar por varios campos opcionales
    @org.springframework.data.jpa.repository.Query("SELECT t FROM Task t LEFT JOIN t.tags tag WHERE t.user = :user AND " +
            "(:status IS NULL OR t.status = :status) AND " +
            "(:priority IS NULL OR t.priority = :priority) AND " +
            "(:tagName IS NULL OR tag.name = :tagName)")
    List<Task> filterTasks(@org.springframework.data.repository.query.Param("user") User user,
                           @org.springframework.data.repository.query.Param("status") Task.TaskStatus status,
                           @org.springframework.data.repository.query.Param("priority") Task.TaskPriority priority,
                           @org.springframework.data.repository.query.Param("tagName") String tagName);
}