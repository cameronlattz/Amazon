const inquirer = require("inquirer");
const bamazonShared = require("./bamazonShared");
const shared = bamazonShared();

function init() {
    menu();
}

function menu() {
    const listOptionsFunctions = {
        "View Products for Sale": viewProducts,
        "View Low Inventory": viewLowInventory,
        "Add to Inventory": addtoInventory,
        "Add New Product": addNewProduct
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

function viewProducts() {
    shared.get("products", function(products) {
        shared.displayProducts(products);
        shared.closeConnection();
    });
}

function viewLowInventory() {
    shared.get("products", function(products) {
        const lowInventory = [];
        products.forEach((product) => {
            if (Number(product.stock_quantity) <= 5) {
                lowInventory.push(product);
            }
        });
        shared.displayProducts(lowInventory);
        shared.closeConnection();
    })
}

function addtoInventory() {
    shared.get("products", function(products) {
        shared.displayProducts(products);
        inquirer.prompt([
            {
                name: "item_id",
                message: "Enter the ID of the item you'd like to add more of: "
            },
            {
                name: "stock_quantity",
                message: "How many items would you like to add? "
            }
        ]).then(function(answer) {
            const product = products.find((product) => Number(product.item_id) === Number(answer.item_id));
            const newQuantity = Number(product.stock_quantity) + Number(answer.stock_quantity);
            const query = `UPDATE products
                SET stock_quantity = ${newQuantity}
                WHERE item_id = ${answer.item_id}`;
            shared.doQuery(query, function() {
                console.log(product.product_name + " now has " + newQuantity + " items.");
                shared.closeConnection();
            });
        });
    })
}

function addNewProduct() {
    inquirer.prompt([
        {
            name: "product_name",
            message: "Product name: "
        },
        {
            name: "department_name",
            message: "Department name: "
        },
        {
            name: "price",
            message: "Price: $"
        },
        {
            name: "stock_quantity",
            message: "Quantity in stock: "
        }
    ]).then(function(answer) {
        const query =`INSERT INTO products (product_name, department_name, price, stock_quantity)
            VALUES (\"${answer.product_name}\", \"${answer.department_name}\", ${answer.price}, ${answer.stock_quantity})`;
        shared.doQuery(query, function() {
            console.log("Added " + answer.product_name +  " to the database.");
            shared.closeConnection();
        });
    });
}

init();