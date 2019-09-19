const inquirer = require("inquirer");
// import shared js file
const bamazonShared = require("./bamazonShared");
const shared = bamazonShared();

// function that runs when file loaded
function init() {
    menu();
}

// prompt the user with a menu
function menu() {
    // link the options and the functions they will lead to here so we don't need a switch later
    const listOptionsFunctions = {
        "View Product Sales by Department": viewProductSales,
        "Create New Department": createDepartment
    };
    // the listed options are the keys of the above object
    const listOptions = Object.keys(listOptionsFunctions);
    inquirer.prompt([
        {
            name: "selectedOption",
            message: "What would you like to do?",
            type: "list",
            choices: listOptions
        }
    ]).then(function(answer) {
        // grab the function from the options/functions object and then run it
        const func = listOptionsFunctions[answer.selectedOption];
        func();
    });
}

// display all departments and show their product sales, overhead costs, and total profit
function viewProductSales() {
    const query = `SELECT department_id, departments.department_name, over_head_costs,
        COALESCE(SUM(product_sales), 0) AS product_sales, COALESCE(SUM(product_sales), 0)-over_head_costs AS total_profit
        FROM departments
        LEFT JOIN products
        ON departments.department_name = products.department_name
        GROUP BY department_id`;
    shared.doQuery(query, function(departments) {
        // display the product rows in a nice table. format the over_head_costs, product_sales, and price column
        // as currency then close the connection
        shared.displayTable(departments, ["over_head_costs", "product_sales", "total_profit"]);
        shared.closeConnection();
    });
}

// create a new department and add it to the departments table
function createDepartment() {
    inquirer.prompt([
        {
            name: "department_name",
            message: "Department name: ",
            validate: shared.validateStringLength
        },
        {
            name: "over_head_costs",
            message: "Overhead costs: $",
            validate: shared.validatePositiveNumber
        }
    ]).then(function(answer) {
        const query =`INSERT INTO departments (department_name, over_head_costs)
            VALUES (\"${answer.department_name}\", ${answer.over_head_costs})`;
        shared.doQuery(query, function() {
            console.log("Added the " + answer.department_name +  " department to the database.");
            shared.closeConnection();
        });
    });
}

init();