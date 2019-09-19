const shared = function() {
    const mysql = require("mysql");
    const _currencyFormatter = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      });

    const _pad = function(str, characterCount, paddingCharacter) {
        if (paddingCharacter === void 0) {
            paddingCharacter = " ";
        }
        str = str.toString();
        strLength = str.length;
        for (let i = 1; i <= characterCount - strLength; i++) {
            str += paddingCharacter;
        }
        return str;
    }

    const _findMaxLength = function(arr, key) {
        const valueLengths = arr.map((item) => item[key].toString().length);
        const maxValueLength = Math.max.apply(null,valueLengths);
        if (maxValueLength >= key.length) {
            return maxValueLength;
        } else {
            return key.length;
        }
    }

    return {
        displayProducts: function(products) {
            products.forEach((product) => {
                product.price = _currencyFormatter.format(product.price);
            });
            const itemIdLength = _findMaxLength(products, "item_id");
            const productNameLength = _findMaxLength(products, "product_name");
            const departmentNameLength = _findMaxLength(products, "department_name");
            const priceLength = _findMaxLength(products, "price");
            const quantityLength = _findMaxLength(products, "stock_quantity");
            console.log("");
            const itemIdHeader = _pad("item_id", itemIdLength);
            const productNameHeader = _pad("product_name", productNameLength);
            const departmentNameHeader = _pad("department_name", departmentNameLength);
            const priceHeader = _pad("price", priceLength);
            const quantityHeader = _pad("stock_quantity", quantityLength);
            console.log(`| ${itemIdHeader} | ${productNameHeader} | ${departmentNameHeader} | ${priceHeader} | ${quantityHeader} |`);
            const itemIdDivider = _pad("", itemIdLength, "-");
            const productNameDivider = _pad("", productNameLength, "-");
            const departmentNameDivider = _pad("", departmentNameLength, "-");
            const priceDivider = _pad("", priceLength, "-");
            const quantityDivider = _pad("", quantityLength, "-");
            console.log(`| ${itemIdDivider} | ${productNameDivider} | ${departmentNameDivider} | ${priceDivider} | ${quantityDivider} |`);
            products.forEach((product) => {
                const item_id = _pad(product.item_id, itemIdLength);
                const product_name = _pad(product.product_name, productNameLength);
                const department_name = _pad(product.department_name, departmentNameLength);
                const price = _pad(product.price, priceLength);
                const quantity = _pad(product.stock_quantity, quantityLength);
                console.log(`| ${item_id} | ${product_name} | ${department_name} | ${price} | ${quantity} |`);
            });
            console.log("");
        },
        doQuery: function(query, func) {
            const connection = mysql.createConnection({
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
        },
        getProducts: function(func) {
            this.doQuery("SELECT * FROM products", function(response) {
                const items = [];
                response.forEach((product) => {
                    items.push(product)
                });
                func(items);
            });
        }
    }
};

module.exports = shared;