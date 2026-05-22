package com.iker.focolist.shared.init;

import com.iker.focolist.models.Category;
import com.iker.focolist.models.Tag;
import com.iker.focolist.models.Task;
import com.iker.focolist.models.User;
import com.iker.focolist.repositories.CategoryRepository;
import com.iker.focolist.repositories.TagRepository;
import com.iker.focolist.repositories.TaskRepository;
import com.iker.focolist.repositories.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Set;


@Component
public class DataSeed implements CommandLineRunner {

    private final UserRepository userRepository;
    private final TaskRepository taskRepository;
    private final CategoryRepository categoryRepository;
    private final TagRepository tagRepository;
    private final PasswordEncoder passwordEncoder;

    public DataSeed(UserRepository userRepository, TaskRepository taskRepository,
                    CategoryRepository categoryRepository, TagRepository tagRepository,
                    PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.taskRepository = taskRepository;
        this.categoryRepository = categoryRepository;
        this.tagRepository = tagRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) return;

        // ── USUARIOS ────────────────────────────────────────────────
        User admin = new User();
        admin.setUserName("admin");
        admin.setEmail("admin@focolist.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRol(User.Role.ADMIN);
        userRepository.save(admin);

        User gestor = new User();
        gestor.setUserName("gestor");
        gestor.setEmail("gestor@focolist.com");
        gestor.setPassword(passwordEncoder.encode("gestor123"));
        gestor.setRol(User.Role.GESTOR);
        userRepository.save(gestor);

        User user = new User();
        user.setUserName("user");
        user.setEmail("user@focolist.com");
        user.setPassword(passwordEncoder.encode("user123"));
        user.setRol(User.Role.USER);
        userRepository.save(user);

        // ── CATEGORÍAS ───────────────────────────────────────────────
        Category trabajo = new Category();
        trabajo.setTitle("Trabajo");
        trabajo.setEnfasis("info");
        categoryRepository.save(trabajo);

        Category personal = new Category();
        personal.setTitle("Personal");
        personal.setEnfasis("warning");
        categoryRepository.save(personal);

        Category estudios = new Category();
        estudios.setTitle("Estudios");
        estudios.setEnfasis("success");
        categoryRepository.save(estudios);

        // ── TAGS ─────────────────────────────────────────────────────
        Tag urgente = new Tag();
        urgente.setName("urgente");
        tagRepository.save(urgente);

        Tag backend = new Tag();
        backend.setName("backend");
        tagRepository.save(backend);

        Tag frontend = new Tag();
        frontend.setName("frontend");
        tagRepository.save(frontend);

        Tag bug = new Tag();
        bug.setName("bug");
        tagRepository.save(bug);

        Tag mejora = new Tag();
        mejora.setName("mejora");
        tagRepository.save(mejora);

        // ── TAREAS DEL ADMIN ─────────────────────────────────────────
        Task t1 = new Task();
        t1.setTitle("Revisar permisos de usuarios");
        t1.setDescription("Comprobar que los roles ADMIN, GESTOR y USER tienen acceso correcto a cada endpoint.");
        t1.setPriority(Task.TaskPriority.HIGH);
        t1.setStatus(Task.TaskStatus.IN_PROGRESS);
        t1.setDueDate(LocalDateTime.now().plusDays(1));
        t1.setUser(admin);
        t1.setCategory(trabajo);
        t1.setTags(Set.of(urgente, backend));
        taskRepository.save(t1);

        Task t2 = new Task();
        t2.setTitle("Actualizar documentación Swagger");
        t2.setDescription("Añadir descripciones a todos los endpoints que aún no las tienen.");
        t2.setPriority(Task.TaskPriority.MEDIUM);
        t2.setStatus(Task.TaskStatus.PENDING);
        t2.setDueDate(LocalDateTime.now().plusDays(5));
        t2.setUser(admin);
        t2.setCategory(personal);
        t2.setTags(Set.of(mejora));
        taskRepository.save(t2);

        Task t3 = new Task();
        t3.setTitle("Configurar entorno de producción");
        t3.setDescription("Migrar de H2 a MySQL y configurar variables de entorno.");
        t3.setPriority(Task.TaskPriority.HIGH);
        t3.setStatus(Task.TaskStatus.COMPLETED);
        t3.setDueDate(LocalDateTime.now().minusDays(2));
        t3.setUser(admin);
        t3.setCategory(estudios);
        t3.setTags(Set.of(backend, urgente));
        taskRepository.save(t3);

        // ── TAREAS DEL GESTOR ────────────────────────────────────────
        Task t4 = new Task();
        t4.setTitle("Crear categoría de Soporte");
        t4.setDescription("Añadir una nueva categoría para agrupar tareas de soporte técnico.");
        t4.setPriority(Task.TaskPriority.LOW);
        t4.setStatus(Task.TaskStatus.PENDING);
        t4.setDueDate(LocalDateTime.now().plusDays(7));
        t4.setUser(gestor);
        t4.setCategory(trabajo);
        t4.setTags(Set.of(mejora));
        taskRepository.save(t4);

        Task t5 = new Task();
        t5.setTitle("Revisar tareas vencidas");
        t5.setDescription("Comprobar las tareas cuya fecha límite ya ha pasado y reasignarlas.");
        t5.setPriority(Task.TaskPriority.MEDIUM);
        t5.setStatus(Task.TaskStatus.IN_PROGRESS);
        t5.setDueDate(LocalDateTime.now().minusDays(1));
        t5.setUser(gestor);
        t5.setCategory(trabajo);
        taskRepository.save(t5);

        // ── TAREAS DEL USER ──────────────────────────────────────────
        Task t6 = new Task();
        t6.setTitle("Arreglar bug en el formulario de login");
        t6.setDescription("El campo de contraseña no limpia el error al volver a escribir.");
        t6.setPriority(Task.TaskPriority.HIGH);
        t6.setStatus(Task.TaskStatus.PENDING);
        t6.setDueDate(LocalDateTime.now().plusDays(2));
        t6.setUser(user);
        t6.setCategory(trabajo);
        t6.setTags(Set.of(bug, frontend));
        taskRepository.save(t6);

        Task t7 = new Task();
        t7.setTitle("Estudiar Spring Security");
        t7.setDescription("Repasar filtros, roles y configuración de sesiones stateless.");
        t7.setPriority(Task.TaskPriority.MEDIUM);
        t7.setStatus(Task.TaskStatus.IN_PROGRESS);
        t7.setDueDate(LocalDateTime.now().plusDays(10));
        t7.setUser(user);
        t7.setCategory(estudios);
        t7.setTags(Set.of(backend));
        taskRepository.save(t7);

        Task t8 = new Task();
        t8.setTitle("Hacer ejercicio");
        t8.setDescription("30 minutos de cardio.");
        t8.setPriority(Task.TaskPriority.LOW);
        t8.setStatus(Task.TaskStatus.COMPLETED);
        t8.setDueDate(LocalDateTime.now().minusDays(1));
        t8.setUser(user);
        t8.setCategory(personal);
        taskRepository.save(t8);
    }
}