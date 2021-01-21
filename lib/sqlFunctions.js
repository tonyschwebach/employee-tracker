const { createConnection } = require("mysql")

// view all employees
const viewAllEmployees = (mysqlConnection) => {
  const queryString = `SELECT 
  e.id, e.first_name, e.last_name, role.title, department.name, role.salary, 
  CONCAT(m.first_name,' ',m.last_name) AS manager_name
  FROM employee e
  LEFT JOIN employee m ON e.manager_id = m.id
  LEFT JOIN role ON e.role_id=role.id
  LEFT JOIN department ON department_id=department.id;`
  mysqlConnection.query(queryString, function(err,res){
    if (err) throw err;
    console.table(res);
    mysqlConnection.end();
  })
}


// Add departments, roles, employees


// View departments, roles, employees

// Update employee roles






module.exports = sqlFunctions;


// Update employee managers

// View employees by manager

// Delete departments, roles, and employees

// View the total utilized budget of a department -- ie the combined salaries of all employees in that department