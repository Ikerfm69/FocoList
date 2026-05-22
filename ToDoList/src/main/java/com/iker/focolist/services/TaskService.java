package com.iker.focolist.services;

import com.iker.focolist.dtos.TaskStats;
import com.iker.focolist.models.Tag;
import com.iker.focolist.repositories.TagRepository;
import com.iker.focolist.models.Task;
import com.iker.focolist.repositories.TaskRepository;
import com.iker.focolist.models.User;
import com.iker.focolist.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class TaskService {
    @Autowired
    private TaskRepository taskRepository;
    @Autowired
    private TagRepository tagRepository;
    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser(){
        // La variable username se usa para obtener el usuario que previamente se logueó
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Optional <User> busqueda = userRepository.findByUserName(username);
        if(busqueda.isEmpty()){throw new RuntimeException("Usuario no encontrado");}
        User filtrado = busqueda.get();

        return filtrado;
    }
    public Task createTask(Task task){

        task.setUser(getCurrentUser());

        if(task.getTags() != null && !task.getTags().isEmpty()){
            Set<Tag> etiquetasDefinitivas = new HashSet<>();
            for(Tag tagEnviada: task.getTags()){
                Optional<Tag>tagExistente = tagRepository.findByName(tagEnviada.getName());

                if(tagExistente.isPresent()){
                    etiquetasDefinitivas.add(tagExistente.get());
                }else{
                    Tag nuevaEtiqueta = tagRepository.save(tagEnviada);
                    etiquetasDefinitivas.add(nuevaEtiqueta);
                }
            }
            task.setTags(etiquetasDefinitivas);
        }
        return taskRepository.save(task);


    }
    public void deleteTask(Long id){
        User user = getCurrentUser();
        Optional <Task> tareaId = taskRepository.findById(id);
        if(tareaId.isEmpty()){throw new RuntimeException("No se encontro la tarea ");}
        if(!tareaId.get().getUser().equals(user)){throw new RuntimeException("No tienes permisos para borrar esta tarea");}
        taskRepository.deleteById(id);

    }
    public Task updateTask(Task task) {
        User user = getCurrentUser();
        Task existing = taskRepository.findById(task.getId())
                .orElseThrow(() -> new RuntimeException("No se encontro la tarea"));
        if (!existing.getUser().equals(user)) {
            throw new RuntimeException("No tienes permisos para actualizar esta tarea");
        }
        existing.setTitle(task.getTitle());
        existing.setDescription(task.getDescription());
        existing.setPriority(task.getPriority());
        existing.setDueDate(task.getDueDate());
        existing.setCategory(task.getCategory());

        // Mismo tratamiento de tags que en createTask
        if (task.getTags() != null && !task.getTags().isEmpty()) {
            Set<Tag> tagsDefinitivos = new HashSet<>();
            for (Tag tagEnviada : task.getTags()) {
                Optional<Tag> tagExistente = tagRepository.findByName(tagEnviada.getName());
                if (tagExistente.isPresent()) {
                    tagsDefinitivos.add(tagExistente.get());
                } else {
                    tagsDefinitivos.add(tagRepository.save(tagEnviada));
                }
            }
            existing.setTags(tagsDefinitivos);
        } else {
            existing.setTags(new HashSet<>());
        }

        return taskRepository.save(existing);
    }
    public Task updateStatus( Task.TaskStatus status, Long id){
        User user = getCurrentUser();
        Task tareaId = taskRepository.findById(id).orElseThrow(()-> new RuntimeException("Tarea no encontrada"));
        if(!tareaId.getUser().equals(user)){throw new RuntimeException("No tienes permisos para actualizar esta tarea");}
        tareaId.setStatus(status);
        return taskRepository.save(tareaId);
    }
    public List<Task> findAll(){
        return taskRepository.findByUser(getCurrentUser());
    }

    public Task findById(Long id) {
        Task task = taskRepository.findById(id).orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        if (!task.getUser().equals(getCurrentUser())) {
            throw new RuntimeException("No tienes permisos para ver esta tarea");
        }
        return task;
    }

    public TaskStats getTaskStats() {
        User user = getCurrentUser();
        TaskStats nuevo =new TaskStats();
        Long total =  taskRepository.countByUser(user);
        nuevo.setTotalTasks(total);
        Long completado = taskRepository.countByStatusAndUser(Task.TaskStatus.COMPLETED,user);
        nuevo.setCompletedTasks(completado);

        Long pendientes = taskRepository.countByStatusAndUser(Task.TaskStatus.PENDING, user);
        nuevo.setPendingTasks(pendientes);
        double porcentaje = 0.0;
        if(total > 0){
            porcentaje = (completado*100.0) / total ;
        }
        nuevo.setCompletionPercentage(porcentaje);

        return nuevo;
    }
    public List <Task> reminder(){
        User user = getCurrentUser();
        LocalDateTime Hoy = LocalDateTime.now();
        return taskRepository.findByStatusNotAndDueDateLessThanEqualAndUser(Task.TaskStatus.COMPLETED, Hoy,user);
    }

    public List<Task> filterTasks(Task.TaskStatus status, Task.TaskPriority priority, String tagName) {
        return taskRepository.filterTasks(getCurrentUser(), status, priority, tagName);
    }

    public Task addTagToTask(Long taskId, Long tagId) {
        Task task = taskRepository.findById(taskId).orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        if (!task.getUser().equals(getCurrentUser())) throw new RuntimeException("No tienes permisos");
        Tag tag = tagRepository.findById(tagId).orElseThrow(() -> new RuntimeException("Tag no encontrado"));
        task.getTags().add(tag);
        return taskRepository.save(task);
    }

    public Task removeTagFromTask(Long taskId, Long tagId) {
        Task task = taskRepository.findById(taskId).orElseThrow(() -> new RuntimeException("Tarea no encontrada"));
        if (!task.getUser().equals(getCurrentUser())) throw new RuntimeException("No tienes permisos");
        Tag tag = tagRepository.findById(tagId).orElseThrow(() -> new RuntimeException("Tag no encontrado"));
        task.getTags().remove(tag);
        return taskRepository.save(task);
    }



}