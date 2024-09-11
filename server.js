const express = require('express');
const { Pool } = require('pg');
const inquirer = require('inquirer');
require('dotenv').config();

const PORT = 3001;

const app = express();

// Middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT || 5432
});

pool.connect()
    .then(() => console.log('Connected to the employee_db database!'))
    .catch(err => console.error('Connection error', err.stack));

function run() {
    inquirer
        .prompt([
            {
                type: "list",
                message: "What would you like to do?",
                name: "choice",
                choices: [
                    "View All Employees",
                    "Add Employee",
                    "Update Employee Role",
                    "View All Roles",
                    "Add Role",
                    "View All Departments",
                    "Add Department"
                ]
            }
        ])
        .then((response) => {
            if (response.choice === 'View All Departments') {
                pool.query('SELECT id AS dept_id, name AS dept_name FROM department', (err, res) => {
                    if (err) {
                        console.log('Error fetching departments:', err);
                    } else {
                        console.table(res.rows);
                    }
                    run();
                });
            } else if (response.choice === 'View All Roles') {
                pool.query('SELECT * FROM role', (err, res) => {
                    if (err) {
                        console.log('Error fetching roles:', err);
                    } else {
                        console.table(res.rows);
                    }
                    run();
                });
            } else if (response.choice === 'View All Employees') {
                pool.query('SELECT * FROM employee', (err, res) => {
                    if (err) {
                        console.log('Error fetching employees:', err);
                    } else {
                        console.table(res.rows);
                    }
                    run();
                });
            } else if (response.choice === 'Add Department') {
                inquirer
                    .prompt([
                        {
                            message: 'What is the name of the department?',
                            name: 'departmentName'
                        }
                    ])
                    .then((response) => {
                        pool.query('INSERT INTO department(name) VALUES($1)', [response.departmentName], (err, res) => {
                            if (err) {
                                console.log('Error adding department:', err);
                            } else {
                                console.log('Added new department');
                            }
                            run();
                        });
                    });
            } else if (response.choice === 'Add Role') {
                inquirer
                    .prompt([
                        {
                            message: 'What is the title of the role?',
                            name: 'roleName'
                        },
                        {
                            message: 'What is the salary of the role?',
                            name: 'roleSalary'
                        },
                        {
                            message: 'What is the department ID the role belongs to?',
                            name: 'roleDept'
                        }
                    ])
                    .then((response) => {
                        pool.query('INSERT INTO role(title, salary, department_id) VALUES($1, $2, $3)', [response.roleName, response.roleSalary, response.roleDept], (err, res) => {
                            if (err) {
                                console.log('Error adding role:', err);
                            } else {
                                console.log('Added new role');
                            }
                            run();
                        });
                    });
            } else if (response.choice === "Add Employee") {
                inquirer
                    .prompt([
                        {
                            message: "What is the employee's first name?",
                            name: 'firstName'
                        },
                        {
                            message: "What is the employee's last name?",
                            name: 'lastName'
                        },
                        {
                            message: 'What is the employee\'s role ID?',
                            name: 'role'
                        },
                        {
                            message: 'Who is the employee\'s manager (ID, optional)?',
                            name: 'manager'
                        }
                    ])
                    .then((response) => {
                        pool.query('INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES($1, $2, $3, $4)', [response.firstName, response.lastName, response.role, response.manager], (err, res) => {
                            if (err) {
                                console.log('Error adding employee:', err);
                            } else {
                                console.log('Added new employee');
                            }
                            run();
                        });
                    });
            } else if (response.choice === "Update Employee Role") {
                inquirer
                    .prompt([
                        {
                            message: 'What is the ID of the employee whose role you are updating?',
                            name: 'id'
                        },
                        {
                            message: 'What is the employee\'s new role ID?',
                            name: 'newRole'
                        }
                    ])
                    .then((response) => {
                        pool.query('UPDATE employee SET role_id = $1 WHERE id = $2', [response.newRole, response.id], (err, res) => {
                            if (err) {
                                console.log('Error updating employee role:', err);
                            } else {
                                console.log('Updated employee role');
                            }
                            run();
                        });
                    });
            }
        });
}

run();

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});