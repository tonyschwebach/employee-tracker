const mysql = require("mysql");
const inquirer = require("inquirer");
const Employee = require("./lib/employee");
const sqlFunctions = require("./lib/sqlFunctions");

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

  init();
});

// init function to ask user what action to take
// choices
init = () => {
  inquirer
    .prompt({
      name: "action",
      type: "list",
      message: "What would you like to do?",
      choices: ["View All Employees", "EXIT"],
    })
    .then(({action}) => {
      switch (action) {
        case "View All Employees":
          console.log("call view employees function");
          init(); // place holder for testing
        case "EXIT":
          exit();
      }
    });
};

// function to exit the app
exit = () => connection.end();
