 --- SELECT ---
-- show all department info --
SELECT * FROM department;

-- show all role info --
SELECT * FROM role;

-- show all employee info --
SELECT * FROM employee;

-- show employee info joined --
SELECT 
e.id, e.first_name, e.last_name, role.title, department.name, role.salary, 
CONCAT(m.first_name,' ',m.last_name) AS manager_name
FROM employee e
LEFT JOIN employee m ON e.manager_id = m.id
LEFT JOIN role ON e.role_id=role.id
LEFT JOIN department ON department_id=department.id;


-- Display employees with id and title to ensure correct employee is picked --
SELECT 
CONCAT(employee.id,' - ',first_name,' ',last_name,' - ',title) AS employee_prompt
FROM employee
LEFT JOIN role ON employee.role_id=role.id;

 -- Employees by manager or by department (switch the commented where statement)
 SELECT 
employee.id, first_name, last_name, role.title, department.name, role.salary 
FROM employee 
LEFT JOIN role ON role_id=role.id
LEFT JOIN department ON department_id=department.id
WHERE manager_id = 1;
-- WHERE department.name = "Finance"; --


 --- UPDATES ---
-- update employee role for employee id 1--
UPDATE employee SET role_id = 1 WHERE id = 1;
-- update department name for id 2--
UPDATE department SET name = "Marketing" WHERE id = 2;
-- update role title for id 2--
UPDATE role SET title = "CFO" WHERE id = 2;


 --- DELETES ---

-- delete employee by employee id --
DELETE FROM employee where id = 1; 
-- delete dept by dept id --
DELETE FROM department where id = 1;
-- delete role by role id --
DELETE FROM role where id = 1;