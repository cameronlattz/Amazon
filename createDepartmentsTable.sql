USE bamazon;

CREATE TABLE departments (
  department_id INTEGER NOT NULL AUTO_INCREMENT PRIMARY KEY,
  department_name VARCHAR(30),
  over_head_costs DOUBLE(10,2)
);