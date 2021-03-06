const electron = require('electron')
const {
    ipcRenderer
} = electron;
var mysql = require('mysql');

// To Close The Current Window
const remote = require('electron').remote;
document.getElementById('btncancel').addEventListener('click', function (e) {
    remote.getCurrentWindow().close();
})

// Getting The Fields
var customer = document.getElementById("customer_id");
var product = document.getElementById("product_id");
var shade = document.getElementById("shade");
var itsPrice = document.querySelector('#product_price');
var orderDate = document.querySelector('#order_date');
var deliverDate = document.querySelector('#deliver_date');
var desc = document.querySelector('#description');

function forCustomer(customerData){
// To populate Customers
for (var i = 0; i < customerData.length; i++) {
    var opt = customerData[i];
    var el = document.createElement("option");
    el.textContent = opt.customer_name;
    el.value = opt.customer_id;
    customer.appendChild(el);
}}
function forProduct(productData){

// To populate Products
for (var i = 0; i < productData.length; i++) {
    var opt = productData[i];
    var el = document.createElement("option");
    el.textContent = opt.product_name;
    el.value = opt.product_id;
    product.appendChild(el);
}
}
// To submit Form
const form = document.querySelector('form');
form.addEventListener('submit', submitForm);

function submitForm(e) {
    e.preventDefault();
    //Getting Selected Customer
    var customer_index = customer.selectedIndex;
    var customer_option = customer.options;
    var customer_id = customer_option[customer_index].getAttribute('value');
    //Getting Selected Product
    var product_index = product.selectedIndex;
    var product_option = product.options;
    var product_id = product_option[product_index].getAttribute('value');
    //Getting Selected shade
    var shade_index = shade.selectedIndex;
    var shade_option = shade.options;
    var Selected_shade;
    if (shade_option[shade_index].index == 0) {
        Selected_shade = "-"
    } else {
        Selected_shade = shade_option[shade_index].text;
    }
    //Getting Other Values
    var price = (itsPrice.value).trim();
    var order_date = orderDate.value;
    var deliver_date = deliverDate.value;
    var description;
    if ((desc.value).trim() == "") {
        description = "-"
    } else {
        description = (desc.value).trim();
    }

    //objetct of data 
    const cdata = {
        customer_id: customer_id,
        product_id: product_id,
        shade: Selected_shade,
        price: price,
        order_date: order_date,
        deliver_date: deliver_date,
        description: description
    }
    //---------------------Database-----------------------------//
    

    // Add the credentials to access your database
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: null, // or the original password : 'apaswword'
        database: 'etddatabase'
    });

    // connect to mysql
    connection.connect(function (err) {
        // in case of error
        if (err) {
            console.log(err.code);
            console.log(err.fatal);
        }
    });

    // Perform a query
    $query = 'INSERT INTO `orders` SET ?';

    connection.query($query, cdata, function (err, rows, fields) {
        if (err) {
            console.log("An error ocurred performing the query.");
            console.log(err);
            return;
        }

        console.log("Query succesfully executed", rows);
    });

    // Close the connection
    connection.end(function () {
        // The connection has been closed
    });
    remote.getCurrentWindow().reload();
}
//????????????????Getting Active Customers?????????????????//
function getCustomers(callback) {
    // Add the credentials to access your database
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: null, // or the original password : 'apaswword'
        database: 'etddatabase'
    });
    // connect to mysql
    connection.connect(function (err) {
        // in case of error
        if (err) {
            console.log(err.code);
            console.log(err.fatal);
        }
    });
    // query for Active Customers
    $query = 'SELECT * FROM `customers` WHERE isactive="Y"';
    connection.query($query, function (err, rows, fields) {
        if (err) {
            console.log("An error ocurred performing the query.");
            console.log(err);
            return;
        }
        callback(rows);
    });
    // Close the connection
    connection.end(function () {
        // The connection has been closed
    });
}
//???????????????????Getting Active Products????????????????????//
function getProducts(callback) {
    // Add the credentials to access your database
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: null, // or the original password : 'apaswword'
        database: 'etddatabase'
    });
    // connect to mysql
    connection.connect(function (err) {
        // in case of error
        if (err) {
            console.log(err.code);
            console.log(err.fatal);
        }
    });
    // query for Active products
    $query = 'SELECT * FROM `products` WHERE isactive="Y"';
    connection.query($query, function (err, rows, fields) {
        if (err) {
            console.log("An error ocurred performing the query.");
            console.log(err);
            return;
        }
        callback(rows)
    });
    // Close the connection
    connection.end(function () {
        // The connection has been closed
    });
}
 
 getProducts(forProduct);
 getCustomers(forCustomer);