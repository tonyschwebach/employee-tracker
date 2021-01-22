const mysql = require("mysql");
const inquirer = require("inquirer");
const printLogo = require("./lib/asciiLogo");
const cTable = require('console.table');
// const Employee = require("./lib/employee");
// const sqlFunctions = require("./lib/sqlFunctions");

// establish connection with mysql
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "dentist123",
  database: "human_resourcesDB",
});

// connect to mysql database
connection.connect(function (err) {
  if (err) throw err;
  console.log(
    `You are connect to ${connection.config.database} as id: ${connection.threadId}`
  );
  console.clear();
  printLogo();
  init();
});

// init function to ask user what action to take
const init = () => {
  console.log();
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do? ",
      choices: [
        "VIEW All Employees",
        "VIEW depts, roles, or employees",
        "ADD dept, role, or employee",
        "UPDATE employee",
        "EXIT",
      ],
    })
    .then(({ action }) => {
      switch (action) {
        case "VIEW All Employees":
          viewAllEmployees();
          break;
        case "VIEW depts, roles, or employees":
          view();
          break;
        case "ADD dept, role, or employee":
          addHRdata();
          break;
        case "UPDATE employee":
          updateEmployee();
          break;
        case "EXIT":
          exit();
      }
    });
};

// view all employees
const viewAllEmployees = () => {
  const queryString = `SELECT 
  e.id, e.first_name, e.last_name, role.title, department.name AS department, role.salary, 
  CONCAT(m.first_name,' ',m.last_name) AS manager_name
  FROM employee e
  LEFT JOIN employee m ON e.manager_id = m.id
  LEFT JOIN role ON e.role_id=role.id
  LEFT JOIN department ON department_id=department.id;`;

  connection.query(queryString, function (err, res) {
    if (err) throw err;

    console.table(res);
    init();
  });
};

// View departments, roles, employees
const view = () => {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to view? ",
      choices: ["View Department", "View Role", "View Employee", "BACK"],
    })
    .then(({ action }) => {
      switch (action) {
        case "View Department":
          connection.query(`SELECT * FROM department;`, function (err, res) {
            if (err) throw err;
            console.table(res);
            init();
          });
          break;

        case "View Role":
          connection.query(`SELECT * FROM role;`, function (err, res) {
            if (err) throw err;
            console.table(res);
            init();
          });
          break;
        case "View Employee":
          connection.query(`SELECT * FROM employee;`, function (err, res) {
            if (err) throw err;
            console.table(res);
            init();
          });
          break;
        case "BACK":
          init();
          break;
      }
    });
};

// Add departments, roles, employees
const addHRdata = () => {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to add? ",
      choices: ["Add Department", "Add Role", "Add Employee", "BACK"],
    })
    .then(({ action }) => {
      switch (action) {
        case "Add Department":
          addDept();
          break;
        case "Add Role":
          addRole();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "BACK":
          init();
      }
    });
};

// add dept to department table
const addDept = () => {
  const queryString = `INSERT INTO department (name) VALUES (?)`;
  inquirer
    .prompt({
      name: "deptName",
      type: "input",
      message: "What is the NAME of the department you would like to add? ",
    })
    .then(({ deptName }) => {
      connection.query(queryString, [deptName], function (err, res) {
        if (err) throw err;
        console.log(`Dept: ${deptName} was successfully added!`);
        init();
      });
    });
};

// add role to role table
const addRole = () => {
  const queryString = `INSERT INTO role SET ?`;
  // query a list of departments as that is required for each role
  connection.query(`SELECT * FROM department`, function (err, deptQueryResult) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What is the TITLE of the role you would like to add? ",
        },
        {
          name: "salary",
          type: "number",
          message: "What is the SALARY of the role you are adding? ",
        },
        {
          name: "deptName",
          type: "list",
          message: "What is DEPARTMENT for which the role belongs? ",
          choices: function () {
            let deptArray = [];
            deptQueryResult.forEach((dept) => deptArray.push(dept.name));
            return deptArray;
          },
        },
      ])
      .then((answer) => {
        connection.query(
          `SELECT * FROM department WHERE name = ?`,
          [answer.deptName],
          function (err, result) {
            if (err) throw err;
            connection.query(
              queryString,
              {
                title: answer.title,
                salary: answer.salary,
                department_id: result[0].id,
              },
              function (err, res) {
                if (err) throw err;
                console.log(`Role: ${answer.title} was successfully added!`);
                init();
              }
            );
          }
        );
      });
  });
};

// add employee to employee table
const addEmployee = () => {
  const queryString = `INSERT INTO employee SET ?`;
  // store query of employees as potential manager choices
  let employeesArray = [];
  connection.query(
    `SELECT 
    CONCAT(employee.id,' - ',first_name,' ',last_name,' - ',title) AS employee_prompt
    FROM employee
    LEFT JOIN role ON employee.role_id=role.id;`,
    function (err, empQueryResult) {
      if (err) throw err;
      empQueryResult.forEach((employee) =>
        employeesArray.push(employee.employee_prompt)
      );
      employeesArray.push("No Manager");
    }
  );

  connection.query(`SELECT * FROM role;`, function (err, roleQueryResult) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "firstName",
          type: "input",
          message: "Employee first name: ",
        },
        {
          name: "lastName",
          type: "input",
          message: "Employee last name: ",
        },
        {
          name: "roleTitle",
          type: "list",
          message: "What is this employee's role? ",
          choices: function () {
            let roleArray = [];
            roleQueryResult.forEach((role) => roleArray.push(role.title));
            return roleArray;
          },
        },
        {
          name: "managerName",
          type: "list",
          message: "Who is this employee's manager (id - name - title)? ",
          choices: employeesArray,
        },
      ])
      .then((answer) => {
        // store id of selected manager
        let managerID = null;
        if (answer.managerName === "No Manager") {
          managerID = null;
        } else {
          managerID = parseInt(answer.managerName);
        }

        connection.query(
          `SELECT * FROM role WHERE title = ?`,
          [answer.roleTitle],
          function (err, result) {
            if (err) throw err;
            connection.query(
              queryString,
              {
                first_name: answer.firstName,
                last_name: answer.lastName,
                role_id: result[0].id,
                manager_id: managerID,
              },
              function (err, res) {
                if (err) throw err;
                console.log(
                  `Employee: ${answer.firstName} ${answer.lastName} was successfully added!`
                );
                init();
              }
            );
          }
        );
      });
  });
};

// Update employee roles
const updateEmployee = () => {
  // store query of employees as potential manager choices
  let employeesArray = [];
  // showing more information to ensure correct employee/manager is selected
  connection.query(
    `SELECT 
    CONCAT(employee.id,' - ',first_name,' ',last_name,' - ',title) AS employee_prompt
    FROM employee
    LEFT JOIN role ON employee.role_id=role.id;`,
    function (err, empQueryResult) {
      if (err) throw err;
      empQueryResult.forEach((employee) =>
        employeesArray.push(employee.employee_prompt)
      );

     
      // store query of employees as potential manager choices
      let rolesArray = [];
      connection.query(`SELECT * FROM role;`, function (err, roleQueryResult) {
        if (err) throw err;
        roleQueryResult.forEach((role) => rolesArray.push(role.title));
      });

      inquirer
        .prompt([
          {
            name: "updatedEmployee",
            type: "list",
            message: "Which employee would you like to update? ",
            choices: employeesArray,
          },
          {
            name: "firstName",
            type: "input",
            message: "Employee first name: ",
          },
          {
            name: "lastName",
            type: "input",
            message: "Employee last name: ",
          },
          {
            name: "roleTitle",
            type: "list",
            message: "What is this employee's role? ",
            choices: rolesArray,
          },
          //  employeesArray.push("No Manager"); employeesArray.push("No Manager");
          {
            name: "managerName",
            type: "list",
            message: "Who is this employee's manager (id - name - title)? ",
            choices: employeesArray,
          },
        ])
        .then((answer) => {
          console.log(answer);
        });
    }
  );
};

// function to exit the app
const exit = () => connection.end();
