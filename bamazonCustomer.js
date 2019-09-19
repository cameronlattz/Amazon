const inquirer = require("inquirer");
const bamazonShared = require("./bamazonShared");
const shared = bamazonShared();

function init() {
    inquireProductId();
}

function inquireProductId() {
    shared.getProducts(function(items) {
        shared.displayProducts(items);
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
            shared.doQuery(`UPDATE products SET stock_quantity = ${stock_quantity} WHERE item_id = ${item.item_id}`, 
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

init();