const inquirer = require("inquirer");
// import shared js file
const bamazonShared = require("./bamazonShared");
const shared = bamazonShared();

// function that runs when file loaded
function init() {
    inquireProductId();
}

// ask the user for the product id of the item
function inquireProductId() {
    // get all the rows in the products table and set up callback
    shared.get("products", function(rows) {
        // display the product rows in a nice table. format the price column as currency. hide the product_sales column
        shared.displayTable(rows, ["price"], ["product_sales"]);
        inquirer.prompt([
            {
                name: "productId",
                message: "What is the ID of the product you'd like to buy?",
                validate: shared.validatePositiveNumber
            }
        ]).then(function(answer) {
            const productId = Number(answer.productId);
            // find the row that matches the id the user inputted
            const row = rows.find((row) => row.item_id === productId);
            // if the row is found, ask about the quantity, otherwise tell the user nothing was found
            if (row !== void 0) {
                inquireQuantity(row);
            } else {
                console.log("Sorry, we don't have any products with that ID.");
                // close the connection because we're done
                shared.closeConnection();
            }
        });
    });
}

// ask the user about the quantity
function inquireQuantity(item) {
    inquirer.prompt([
        {
            name: "quantity",
            message: "How many would you like to buy?",
            validate: shared.validatePositiveNumber
        }
    ]).then(function(answer) {
        const answerQuantity = Number(answer.quantity);
        const stockQuantity = Number(item.stock_quantity);
        // check to make sure they're not trying to buy more items than we have in stock
        if (stockQuantity >= answerQuantity) {
            const newQuantity = stockQuantity - answerQuantity;
            const price = answerQuantity * parseFloat(item.price);
            const newSales = Number(item.product_sales) + price;
            const query = `UPDATE products 
                SET stock_quantity = ${newQuantity}, product_sales = ${newSales}
                WHERE item_id = ${item.item_id}`;
            // do the query above, and send a callback function to run if it works
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