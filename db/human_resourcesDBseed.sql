-
USE human_resourcesDB;

INSERT INTO department (name)
VALUES ("Finance"),("Sales"),("Human Resources"),("IT");

INSERT INTO role (title, salary, department_id)
VALUES ("Accountant",60000,1),("Controller",100000,1),
("Salesperson",80000,2),("Sales Manager",12000,2),
("HR Generalist",50000,3),("HR Manager",80000,3),
("Software Engineer",100000,4),("Lead Engineer",150000,4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Andy","Fastow",2,null),("Christian","Wolf",1,1),
("James","Halpert",3,4),("Mike","Scott",4,null),
("Janet","Crotum",6,null),("Toby","Flenderson",5,5),
("David","Lightman",7,8),("Howard","Wolowitz",8,null);