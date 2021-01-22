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
      choices: ["View All Employees", "ADD dept, role, or employee", "EXIT"],
    })
    .then(({ action }) => {
      switch (action) {
        case "View All Employees":
          viewAllEmployees();
          break;
        case "ADD dept, role, or employee":
          addHRdata();
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
          console.log("+dept");
          break;
        case "Add Role":
          console.log("+role");
          break;
        case "Add Employee":
          console.log("+employee");
          break;
        case "BACK":
          init();
      }
    });
};

// View departments, roles, employees

// Update employee roles
