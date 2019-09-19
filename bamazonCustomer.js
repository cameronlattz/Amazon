const inquirer = require("inquirer");
const mysql = require("mysql");

function init() {
    listProducts();
}

function listProducts() {
    doQuery("SELECT * FROM products", function(response) {
        const items = [];
        for (let i = 0; i < response.length; i++) {
            const item = response[i];
            console.log(`ID: ${item.item_id} | Name: ${item.product_name} | Department: ${item.department_name} | Price: $${item.price} | Quantity: ${item.stock_quantity}`);
            items.push(item);
        }
        inquireProductId(items);
    });
}

function inquireProductId(items) {
    inquirer.prompt([
        {
            name: "productId",
            message: "What is the ID of the product you'd like to buy?"
        }
    ]).then(function(answer) {
        const productId = Number(answer.productId);
        const item = items.find((item) => item.item_id === productId);
        if (item !== void 0) {
            inquireQuantity(item);
        } else {
            console.log("Sorry, we don't have any products with that ID.");
        }
    });
}

function inquireQuantity(item) {
    inquirer.prompt([
        {
            name: "quantity",
            message: "How many would you like to buy?"
        }
    ]).then(function(answer) {
        const quantity = Number(answer.quantity);
        if (item.stock_quantity >= quantity) {
            console.log("Buying " + quantity + " of " + item.product_name + ".");
            const stock_quantity = item.stock_quantity - quantity;
            doQuery(`UPDATE products SET stock_quantity = ${stock_quantity} WHERE item_id = ${item.item_id}`, 
                function() {
                    const price = quantity * item.price;
                    console.log("That'll be $" + price + ". Thank you!");
                }
            );
        } else {
            console.log("Sorry, we only have " + item.stock_quantity + " of those.");
        }
    });
}

function doQuery(query, func) {
    var connection = mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "root",
        database: "bamazon"
    });
    connection.connect(function(err) {
        if (err) throw err;
        connection.query(query, function(err, res) {
          if (err) throw err;
          func(res);
          connection.end();
        });
    });
}

init();