const inquirer = require("inquirer");
const bamazonShared = require("./bamazonShared");
const shared = bamazonShared();

function init() {
    inquireProductId();
}

function inquireProductId() {
    shared.get("products", function(items) {
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
                shared.closeConnection();
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
        const answerQuantity = Number(answer.quantity);
        const stockQuantity = Number(item.stock_quantity);
        if (stockQuantity >= answerQuantity) {
            const newQuantity = stockQuantity - answerQuantity;
            const price = answerQuantity * parseFloat(item.price);
            const newSales = Number(item.product_sales) + price;
            const query = `UPDATE products 
                SET stock_quantity = ${newQuantity}, product_sales = ${newSales}
                WHERE item_id = ${item.item_id}`;
            shared.doQuery(query, function() {
                console.log("That'll be " + shared.formatCurrency(price) + ". Thank you!");
                shared.closeConnection();
            });
        } else {
            console.log("Sorry, we only have " + item.stock_quantity + " of those.");
            shared.closeConnection();
        }
    });
}

init();