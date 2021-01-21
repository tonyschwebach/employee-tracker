const mysql = require ('mysql');
const inquirer = require('inquirer');

// establish connection with mysql
const connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "dentist123",
  database: "human_resourcesDB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log(`You are connect to ${connection.config.database} as id: ${connection.threadId}`)
  connection.end();
});