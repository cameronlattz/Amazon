const inquirer = require("inquirer");
const bamazonShared = require("./bamazonShared");
const shared = bamazonShared();

function init() {
    menu();
}

function menu() {
    const listOptionsFunctions = {
        "View Product Sales by Department": viewProductSales,
        "Create New Department": createDepartment
    };
    const listOptions = Object.keys(listOptionsFunctions);
    inquirer.prompt([
        {
            name: "selectedOption",
            message: "What would you like to do?",
            type: "list",
            choices: listOptions
        }
    ]).then(function(answer) {
        const func = listOptionsFunctions[answer.selectedOption];
        func();
    });
}

function viewProductSales() {
    const query = `SELECT department_id, departments.department_name, over_head_costs,
        COALESCE(SUM(product_sales), 0) AS product_sales, COALESCE(SUM(product_sales), 0)-over_head_costs AS total_profit
        FROM departments
        LEFT JOIN products
        ON departments.department_name = products.department_name 
        GROUP BY department_id`;
    shared.doQuery(query, function(departments) {
            shared.displayDepartments(departments);
            shared.closeConnection();
        });
}

function createDepartment() {
    inquirer.prompt([
        {
            name: "department_name",
            message: "Department name: "
        },
        {
            name: "over_head_costs",
            message: "Overhead costs: $"
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