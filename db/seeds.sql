-- Seed departments
INSERT INTO department (name) VALUES
('Web Development'),
('Data Science'),
('Finance');

-- Seed roles
INSERT INTO role (title, salary, department_id) VALUES
('Manager', 85000, 1),
('Junior Developer', 60000, 1),
('Senior Supervisor', 120000, 2),
('Project Manager', 100000, 2),
('Account Manager', 95000, 3),
('Accountant', 75000, 3);

-- Seed employees
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, NULL),
('Wendy', 'Will', 2, 1),
('Jane', 'Doe', 3, NULL),
('Max', 'Shefield', 4, 3),
('Ruben', 'Varkey', 5, NULL),
('Ruth', 'Shee', 6, 5);