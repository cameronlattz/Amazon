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
        "View Products for Sale": viewProducts,
        "View Low Inventory": viewLowInventory,
        "Add to Inventory": addtoInventory,
        "Add New Product": addNewProduct
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

function viewProducts() {
    // get all the rows in the products table and set up callback
    shared.get("products", function(products) {
        // display the product rows in a nice table. format the price column as currency
        shared.displayTable(products, ["price"]);
        // close the connection cause we're done with it now
        shared.closeConnection();
    });
}

// show the products that have a low inventory
function viewLowInventory() {
    shared.get("products", function(products) {
        // filter the products array so that we only have items with a quantity less than 5
        products = products.filter((product) => {
            if (Number(product.stock_quantity) <= 5) {
                return product;
            }
        });
        shared.displayTable(products, ["price"]);
        shared.closeConnection();
    })
}

// update the stock_quantity of an item in the products table
function addtoInventory() {
    shared.get("products", function(products) {
        shared.displayTable(products, ["price"]);
        inquirer.prompt([
            {
                name: "item_id",
                message: "Enter the ID of the item you'd like to add more of: ",
                validate: shared.validatePositiveNumber
            },
            {
                name: "stock_quantity",
                message: "How many items would you like to add? ",
                validate: shared.validatePositiveNumber
            }
        ]).then(function(answer) {
            // find the product the user is referring to
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

// add a new product to the products table
function addNewProduct() {
    inquirer.prompt([
        {
            name: "product_name",
            message: "Product name: ",
            validate: shared.validateStringLength
        },
        {
            name: "department_name",
            message: "Department name: ",
            validate: shared.validateStringLength
        },
        {
            name: "price",
            message: "Price: $",
            validate: shared.validatePositiveNumber
        },
        {
            name: "stock_quantity",
            message: "Quantity in stock: ",
            validate: shared.validatePositiveNumber
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