# Amazon
This is an app for customers and employees of a department/grocery store. Customers can buy items and employees can
view listed items, view items low in stock, add more stock, add new products, view department information, and add 
new departments.

### OVERVIEW:
There are four main files in the app.
1. *bamazonCustomer.js* is the customer endpoint. It allows the user to buy items.
1. *bamazonManager.js* is the manager endpoint. It allows the user to:
    * View all products currently for sale
    * View products that are low in inventory
    * Restock products
    * Add new products to the database
1. *bamazonSupervisor.js* is the supervisor endpoint. It allows the user to:
    * View product sales (and other department) by department
    * Create new departments
1. *bamazonShared.js* is a script that all three of the above files use. It contains methods for handling the MySQL 
connections and queries, displaying data in more human-friendly form, and validating user input.

### HOW TO RUN:
Run server.js in node with the following structure:
```
    node .\server.js
```

### VIDEO:
[![Video](https://img.youtube.com/vi/X62zeL3pWww/0.jpg)](https://www.youtube.com/watch?v=X62zeL3pWww)

### TECHNOLOGIES USED:
* Node
* MySQL Node module
* MySQL database

### TEAM:
* Cameron Lattz, Developer