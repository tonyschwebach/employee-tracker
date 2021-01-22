
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

-- update employee role --
UPDATE employee
SET role_id = 1
WHERE id = 1;


