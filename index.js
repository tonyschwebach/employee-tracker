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
      choices: ["View All Employees", "EXIT"],
    })
    .then(({ action }) => {
      switch (action) {
        case "View All Employees":
          viewAllEmployees();
          // init(); // place holder for testing
          break;
        case "EXIT":
          exit();
      }
    });
};

// function to exit the app
const exit = () => connection.end();

const viewAllEmployees = () => {
  const queryString = `SELECT 
  e.id, e.first_name, e.last_name, role.title, department.name, role.salary, 
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
