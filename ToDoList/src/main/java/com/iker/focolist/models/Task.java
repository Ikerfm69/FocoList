package com.iker.focolist.models;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.Set;

@Entity
@Table (name = "Tasks")
@Data
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id ;
    @NotBlank
    private String title;
    @NotBlank
    private String description;

    @Enumerated(EnumType.STRING)
    @NotNull
    private TaskPriority priority;
    @Enumerated(EnumType.STRING)
    private TaskStatus status = TaskStatus.PENDING;
    @NotNull
    private LocalDateTime dueDate;
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn (name = "user_id")
    private User user;

    @ManyToOne
    @JoinColumn (name = "category_id")
    private Category category;

    @ManyToMany
    @JoinTable(
            name = "task_tags", joinColumns = @JoinColumn(name = "task_id"), inverseJoinColumns = @JoinColumn (name = "tag_id")
    )
    private Set<Tag> tags;

    public enum TaskPriority{
        HIGH,MEDIUM,LOW;
    }
    public enum TaskStatus{
        PENDING,IN_PROGRESS, COMPLETED
    }

}