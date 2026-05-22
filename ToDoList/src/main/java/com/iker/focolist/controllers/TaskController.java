package com.iker.focolist.controllers;

import com.iker.focolist.dtos.TaskResponse;
import com.iker.focolist.dtos.TaskStats;
import com.iker.focolist.models.Task;
import com.iker.focolist.models.Tag;
import com.iker.focolist.services.TaskService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @GetMapping
    public List<TaskResponse> findAll() {
        return taskService.findAll().stream()
                .map(this::toDto)
                .toList();
    }

    @GetMapping("/{id}")
    public TaskResponse findById(@PathVariable Long id) {
        return toDto(taskService.findById(id));
    }

    @PostMapping
    public TaskResponse createTask(@Valid @RequestBody Task task) {
        Task createdTask = taskService.createTask(task);
        return toDto(createdTask);
    }

    @PutMapping("/{id}")
    public TaskResponse updateTask(@Valid @RequestBody Task task, @PathVariable Long id) {
        // Fijamos el id de la URL para evitar inconsistencias con el body
        task.setId(id);
        Task updatedTask = taskService.updateTask(task);
        return toDto(updatedTask);
    }

    @DeleteMapping("/{id}")
    public void deleteTask(@PathVariable("id") Long id) {
        taskService.deleteTask(id);
    }

    @PutMapping("/status/{id}")
    public TaskResponse updateStatus(@RequestBody Task.TaskStatus taskStatus, @PathVariable("id") long id) {
        Task updatedTask = taskService.updateStatus(taskStatus, id);
        return toDto(updatedTask);
    }

    @GetMapping("/stats")
    public TaskStats getTaskStats() {
        return taskService.getTaskStats();
    }

    @GetMapping("/reminder")
    public List<TaskResponse> reminder() {
        return taskService.reminder().stream()
                .map(this::toDto)
                .toList();
    }

    @GetMapping("/dashboard")
    public TaskStats dashboard() {
        return taskService.getTaskStats();
    }

    @GetMapping("/search")
    public List<TaskResponse> searchTasks(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) Boolean completed,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) Task.TaskPriority priority,
            @RequestParam(name = "deadline-before", required = false) String deadlineBefore) {

        // Se llama al servicio de filtrado (se puede ampliar luego en TaskService para soportar todos)
        Task.TaskStatus status = (completed != null && completed) ? Task.TaskStatus.COMPLETED : null;
        return taskService.filterTasks(status, priority, null).stream()
                .map(this::toDto)
                .toList();
    }

    @GetMapping("/by-tag")
    public List<TaskResponse> searchByTag(@RequestParam String tag) {
        return taskService.filterTasks(null, null, tag).stream()
                .map(this::toDto)
                .toList();
    }

    @PostMapping("/{taskId}/tags/{tagId}")
    public TaskResponse addTagToTask(@PathVariable Long taskId, @PathVariable Long tagId) {
        return toDto(taskService.addTagToTask(taskId, tagId));
    }

    @DeleteMapping("/{taskId}/tags/{tagId}")
    public TaskResponse removeTagFromTask(@PathVariable Long taskId, @PathVariable Long tagId) {
        return toDto(taskService.removeTagFromTask(taskId, tagId));
    }

    private TaskResponse toDto(Task task) {
        Set<String> tagNames = task.getTags() == null
                ? Set.of()
                : task.getTags().stream()
                .map(Tag::getName)
                .collect(Collectors.toSet());

        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getStatus(),
                task.getPriority(),
                task.getDueDate(),
                task.getCreatedAt(),
                task.getUser() != null ? task.getUser().getUserName() : null,
                tagNames,
                task.getCategory() != null ? task.getCategory().getTitle() : null
        );
    }
}