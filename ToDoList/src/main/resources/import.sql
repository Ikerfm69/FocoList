INSERT INTO categories (title, enfasis) VALUES ('Trabajo', 'info');
INSERT INTO categories (title, enfasis) VALUES ('Personal', 'warning');
INSERT INTO categories (title, enfasis) VALUES ('Estudios', 'success');

INSERT INTO tags (name) VALUES ('urgente');
INSERT INTO tags (name) VALUES ('backend');
INSERT INTO tags (name) VALUES ('frontend');
INSERT INTO tags (name) VALUES ('bug');
INSERT INTO tags (name) VALUES ('mejora');

INSERT INTO users (user_name, email, password, rol, created_at) VALUES ('admin', 'admin@focolist.com', '$2a$10$/7iDf.aH2NnXaLuc5LmKrOzV11zo2c5IpaR/O/hVHEbK.OhDToirS', 'ADMIN', NOW());
INSERT INTO users (user_name, email, password, rol, created_at) VALUES ('gestor', 'gestor@focolist.com', '$2a$10$D/pWjI5I7mv/EDhN8lSc4.0ZgFhmVW2rCFqpZr/OwKx5j35ecZI6u', 'GESTOR', NOW());
INSERT INTO users (user_name, email, password, rol, created_at) VALUES ('user', 'user@focolist.com', '$2a$10$hji4p9AF2Hym7Z3HUW.07.hfbsHGd2JxI6YGFcT4OEdv1gw1jEup2', 'USER', NOW());

INSERT INTO tasks (title, description, priority, status, due_date, created_at, user_id, category_id) VALUES ('Revisar permisos de usuarios', 'Comprobar que los roles ADMIN, GESTOR y USER tienen acceso correcto a cada endpoint.', 'HIGH', 'IN_PROGRESS', DATE_ADD(NOW(), INTERVAL 1 DAY), NOW(), 1, 1);
INSERT INTO tasks (title, description, priority, status, due_date, created_at, user_id, category_id) VALUES ('Actualizar documentación Swagger', 'Añadir descripciones a todos los endpoints que aún no las tienen.', 'MEDIUM', 'PENDING', DATE_ADD(NOW(), INTERVAL 5 DAY), NOW(), 1, 2);
INSERT INTO tasks (title, description, priority, status, due_date, created_at, user_id, category_id) VALUES ('Configurar entorno de producción', 'Migrar de H2 a MySQL y configurar variables de entorno.', 'HIGH', 'COMPLETED', DATE_SUB(NOW(), INTERVAL 2 DAY), NOW(), 1, 3);
INSERT INTO tasks (title, description, priority, status, due_date, created_at, user_id, category_id) VALUES ('Crear categoría de Soporte', 'Añadir una nueva categoría para agrupar tareas de soporte técnico.', 'LOW', 'PENDING', DATE_ADD(NOW(), INTERVAL 7 DAY), NOW(), 2, 1);
INSERT INTO tasks (title, description, priority, status, due_date, created_at, user_id, category_id) VALUES ('Revisar tareas vencidas', 'Comprobar las tareas cuya fecha límite ya ha pasado y reasignarlas.', 'MEDIUM', 'IN_PROGRESS', DATE_SUB(NOW(), INTERVAL 1 DAY), NOW(), 2, 1);
INSERT INTO tasks (title, description, priority, status, due_date, created_at, user_id, category_id) VALUES ('Arreglar bug en el formulario de login', 'El campo de contraseña no limpia el error al volver a escribir.', 'HIGH', 'PENDING', DATE_ADD(NOW(), INTERVAL 2 DAY), NOW(), 3, 1);
INSERT INTO tasks (title, description, priority, status, due_date, created_at, user_id, category_id) VALUES ('Estudiar Spring Security', 'Repasar filtros, roles y configuración de sesiones stateless.', 'MEDIUM', 'IN_PROGRESS', DATE_ADD(NOW(), INTERVAL 10 DAY), NOW(), 3, 3);
INSERT INTO tasks (title, description, priority, status, due_date, created_at, user_id, category_id) VALUES ('Hacer ejercicio', '30 minutos de cardio.', 'LOW', 'COMPLETED', DATE_SUB(NOW(), INTERVAL 1 DAY), NOW(), 3, 2);

INSERT INTO task_tags (task_id, tag_id) VALUES (1, 1);
INSERT INTO task_tags (task_id, tag_id) VALUES (1, 2);
INSERT INTO task_tags (task_id, tag_id) VALUES (2, 5);
INSERT INTO task_tags (task_id, tag_id) VALUES (3, 2);
INSERT INTO task_tags (task_id, tag_id) VALUES (3, 1);
INSERT INTO task_tags (task_id, tag_id) VALUES (4, 5);
INSERT INTO task_tags (task_id, tag_id) VALUES (6, 4);
INSERT INTO task_tags (task_id, tag_id) VALUES (6, 3);
INSERT INTO task_tags (task_id, tag_id) VALUES (7, 2);
