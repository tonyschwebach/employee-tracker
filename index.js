const mysql = require("mysql");
const inquirer = require("inquirer");
const printLogo = require("./lib/asciiLogo");
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
      message: "What would you like to do?",
      choices: [
        "View All Employees",
        "ADD dept, role, or employee",
        "VIEW depts, roles, or employees",
        "EXIT",
      ],
    })
    .then(({ action }) => {
      switch (action) {
        case "View All Employees":
          viewAllEmployees();
          break;
        case "ADD dept, role, or employee":
          addHRdata();
          break;
        case "VIEW depts, roles, or employees":
          view();
          break;
        case "EXIT":
          exit();
      }
    });
};

// function to exit the app
const exit = () => connection.end();

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
    // console.clear();
    console.table(res);
    init();
  });
};

// Add departments, roles, employees
const addHRdata = () => {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to add?",
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
          console.log("+employee");
          break;
        case "BACK":
          init();
      }
    });
};

const addDept = () => {
  const queryString = `INSERT INTO department (name) VALUES (?)`;
  inquirer
    .prompt({
      name: "deptName",
      type: "input",
      message: "What is the NAME of the department you would like to add?",
    })
    .then(({ deptName }) => {
      connection.query(queryString, [deptName], function (err, res) {
        if (err) throw err;
        console.log(`Dept: ${deptName} was successfully added!`);
        init();
      });
    });
};

const addRole = () => {
  const queryString = `INSERT INTO role SET ?`;
  connection.query(`SELECT * FROM department`, function (err, deptQueryResult) {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "title",
          type: "input",
          message: "What is the TITLE of the role you would like to add?",
        },
        {
          name: "salary",
          type: "number",
          message: "What is the SALARY of the role you are adding?",
        },
        {
          name: "departName",
          type: "list",
          message: "What is DEPARTMENT for which the role belongs?",
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
          [answer.departName],
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

// View departments, roles, employees
const view = () => {
  const queryString = `SELECT * FROM ?;`;
  let viewing = "";
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to view?",
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

// Update employee roles
