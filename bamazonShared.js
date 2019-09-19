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

    const _displayTable = function(rows, keysToFormat = [], keysToHide = []) {
        if (rows.length < 1) return;
        const findMaxLength = function(rows, key) {
            rows.push({[key]:key});
            const valueLengths = rows.map(row => row[key].toString().length);
            const maxValueLength = Math.max.apply(null, valueLengths);
            rows.pop();
            return maxValueLength;
        }
        const pad = function(str, characterCount, paddingCharacter = " ") {
            str = str.toString();
            let padding = "";
            for (let i = 0; i < characterCount - str.length; i++) {
                padding += paddingCharacter;
            }
            return str + padding;
        }
        const formattedRows = JSON.parse(JSON.stringify(rows));
        formattedRows.forEach((row) => {
            keysToFormat.forEach((keyToFormat) => {
                row[keyToFormat] = _currencyFormatter.format(row[keyToFormat]);
            })
        });
        const headers = [];
        const dividers = [];
        const keys = Object.keys(formattedRows[0]);
        keys.forEach((key) => {
            if (!keysToHide.includes(key)) {
                const maxLength = findMaxLength(formattedRows, key);
                const header = pad(key, maxLength);
                headers.push(header);
                const divider = pad("", maxLength, "-");
                dividers.push(divider);
            }
        });
        console.log("");
        console.log("| " + headers.join(" | ") + " |");
        console.log("| " + dividers.join(" | ") + " |");
        formattedRows.forEach((row) => {
            const values = [];
            keys.forEach((key) => {
                if (!keysToHide.includes(key)) {
                    const maxLength = findMaxLength(formattedRows, key);
                    const value = pad(row[key], maxLength);
                    values.push(value);
                }
            });
            console.log("| " + values.join(" | ") + " |");
        });
        console.log("");
    }

    return {
        closeConnection: function() {
            _connection.end();
        },
        displayTable: _displayTable,
        doQuery: function(query, func) {
            const queryFunction = function() {
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
        },
        validatePositiveNumber: function(str) {
            const isValid = !isNaN(str) && str.length > 0 && Number(str) > 0;
            if (!isValid) {
                console.log("");
                console.log("Please enter a positive number.");
            }
            return isValid;
        },
        validateStringLength: function(str) {
            const isValid = str.length > 0;
            if (!isValid) {
                console.log("");
                console.log("Please enter at least one character.");
            }
            return isValid;
        }
    }
};

module.exports = shared;