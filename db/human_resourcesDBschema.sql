-- Drops the human_resourcesDB if it exists currently --
DROP DATABASE IF EXISTS human_resourcesDB;
-- Creates the "human_resourcesDB" database --
CREATE DATABASE human_resourcesDB;

-- Makes it so all of the following code will affect animals_db --
USE human_resourcesDB;

CREATE TABLE department (
    id INTEGER AUTO_INCREMENT NOT NULL,
    name VARCHAR(30) NOT NULL,
    PRIMARY KEY (id)
);
CREATE TABLE role (
    id INTEGER AUTO_INCREMENT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL(8,2) NOT NULL,
    department_id INTEGER NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (department_id) REFERENCES department(id)
);
CREATE TABLE employee (
    id INTEGER AUTO_INCREMENT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
	last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
	manager_id INTEGER NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id)
);

SELECT * FROM department;

SELECT * FROM role;

SELECT * FROM employee;

SELECT * FROM employee
LEFT JOIN role ON employee.role_id=role.id
LEFT JOIN department ON department_id=department.id;