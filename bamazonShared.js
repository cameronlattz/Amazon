const shared = function() {
    const _mysql = require("mysql");
    const _connection = _mysql.createConnection({
        host: "localhost",
        port: 3306,
        user: "root",
        password: "root",
        database: "bamazon"
    });
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
        closeConnection: function() {
            _connection.end();
        },
        displayDepartments: function(departments) {
            const formattedDepartments = JSON.parse(JSON.stringify(departments));
            formattedDepartments.forEach((department) => {
                department.over_head_costs = _currencyFormatter.format(department.over_head_costs);
                department.product_sales = _currencyFormatter.format(department.product_sales);
                department.total_profit = _currencyFormatter.format(department.total_profit);
            });
            const departmentIdLength = _findMaxLength(formattedDepartments, "department_id");
            const departmentNameLength = _findMaxLength(formattedDepartments, "department_name");
            const overHeadCostsLength = _findMaxLength(formattedDepartments, "over_head_costs");
            const productSalesLength = _findMaxLength(formattedDepartments, "product_sales");
            const totalProfitLength = _findMaxLength(formattedDepartments, "total_profit");
            console.log("");
            const departmentIdHeader = _pad("department_id", departmentIdLength);
            const departmentNameHeader = _pad("department_name", departmentNameLength);
            const overHeadCostsHeader = _pad("over_head_costs", overHeadCostsLength);
            const productSalesHeader = _pad("product_sales", productSalesLength);
            const totalProfitHeader = _pad("total_profit", totalProfitLength);
            console.log(`| ${departmentIdHeader} | ${departmentNameHeader} | ${overHeadCostsHeader} | ${productSalesHeader} | ${totalProfitHeader} |`);
            const departmentIdDivider = _pad("", departmentIdLength, "-");
            const departmentNameDivider = _pad("", departmentNameLength, "-");
            const overHeadCostsDivider = _pad("", overHeadCostsLength, "-");
            const productSalesDivider = _pad("", productSalesLength, "-");
            const totalProfitDivider = _pad("", totalProfitLength, "-");
            console.log(`| ${departmentIdDivider} | ${departmentNameDivider} | ${overHeadCostsDivider} | ${productSalesDivider} | ${totalProfitDivider} |`);
            formattedDepartments.forEach((department) => {
                const department_id = _pad(department.department_id, departmentIdLength);
                const department_name = _pad(department.department_name, departmentNameLength);
                const over_head_costs = _pad(department.over_head_costs, overHeadCostsLength);
                const product_sales = _pad(department.product_sales, productSalesLength);
                const total_profit = _pad(department.total_profit, totalProfitLength);
                console.log(`| ${department_id } | ${department_name} | ${over_head_costs} | ${product_sales} | ${total_profit} |`);
            });
            console.log("");
        },
        displayProducts: function(products) {
            const formattedProducts = JSON.parse(JSON.stringify(products));
            formattedProducts.forEach((product) => {
                product.price = _currencyFormatter.format(product.price);
            });
            const itemIdLength = _findMaxLength(formattedProducts, "item_id");
            const productNameLength = _findMaxLength(formattedProducts, "product_name");
            const departmentNameLength = _findMaxLength(formattedProducts, "department_name");
            const priceLength = _findMaxLength(formattedProducts, "price");
            const quantityLength = _findMaxLength(formattedProducts, "stock_quantity");
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
            formattedProducts.forEach((product) => {
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
            function queryFunction() {
                _connection.query(query, function(err, res) {
                    if (err) throw err;
                    func(res);
                });
            }
            if (_connection.status === "disconnected") {
                _connection.connect(function(err) {
                    if (err) throw err;
                    queryFunction();
                });
            } else {
                queryFunction();
            }
        },
        formatCurrency: function(value) {
            return _currencyFormatter.format(value);
        },
        get: function(tableName, func) {
            this.doQuery("SELECT * FROM " + tableName, function(response) {
                func(response);
            });
        }
    }
};

module.exports = shared;