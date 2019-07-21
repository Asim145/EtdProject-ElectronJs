const electron = require('electron')
const {
    ipcRenderer
} = electron;
var mysql = require('mysql');
const remote = require('electron').remote;

document.getElementById('btncancel').addEventListener('click', function (e) {
    remote.getCurrentWindow().close();
})


// Getting The Fields
var customer = document.getElementById("customer_id");
var product = document.getElementById("product_id");
var selected_shade = document.getElementById("shade");
var itsPrice = document.getElementById('product_price');
var orderDate = document.querySelector('#order_date');
var deliverDate = document.querySelector('#deliver_date');
var desc = document.querySelector('#description');

ipcRenderer.on('selected_order', function (e, selectedOrder) {

    // To populate Customers
    function forCustomers(customerData) {
        for (var i = 0; i < customerData.length; i++) {
            var opt = customerData[i];
            var el = document.createElement("option");
            el.textContent = opt.customer_name;
            el.value = opt.customer_id;
            customer.appendChild(el);
        }
        //To Set Selected Customer
        for (var i = 0; i <= customerData.length; i++) {
            if (customer.options[i].value == selectedOrder.customer_id) {
                customer.options[i].selected = true;
            }
        }
    }

    // To populate Products
    function forProducts(productData) {
        for (var i = 0; i < productData.length; i++) {
            var opt = productData[i];
            var el = document.createElement("option");
            el.textContent = opt.product_name;
            el.value = opt.product_id;
            product.appendChild(el);
        }
        //To Set Selected Product
        for (var i = 0; i <= productData.length; i++) {
            if (product.options[i].value == selectedOrder.product_id) {
                product.options[i].selected = true;
            }
        }
    }


    //To Set Selected Shade
    for (var i = 0; i < selected_shade.length; i++) {
        if (selected_shade.options[i].text == selectedOrder.shade) {
            selected_shade.options[i].selected = true;
        }
    }
    itsPrice.value = selectedOrder.price;
    function convert(str) {
        var date = new Date(str),
          mnth = ("0" + (date.getMonth() + 1)).slice(-2),
          day = ("0" + date.getDate()).slice(-2);
        return [date.getFullYear(), mnth, day].join("-");
      }
    orderDate.value = convert(selectedOrder.order_date);
    deliverDate.value = convert(selectedOrder.deliver_date);
    if (selectedOrder.description == "-") {
        desc.value = "";
    } else {
        desc.value = selectedOrder.description;
    }
    var isactive = document.getElementById('isactive');
    if (selectedOrder.ispending == "N") {
        isactive.options[1].selected = true;
    }

    const form = document.querySelector('form');
    form.addEventListener('submit', submitForm);
    
        function submitForm(e) {
            e.preventDefault();

            var order_id = selectedOrder.order_id;
            //Getting Selected Customer
            var customer_index = customer.selectedIndex;
            var customer_option = customer.options;
            var customer_id = customer_option[customer_index].getAttribute('value');
            //Getting Selected Product
            var product_index = product.selectedIndex;
            var product_option = product.options;
            var product_id = product_option[product_index].getAttribute('value');
            //Getting Selected shade
            var shade_index = selected_shade.selectedIndex;
            var shade_option = selected_shade.options;
            var shade;
            if (shade_option[shade_index].index == 0) {
                shade = "-"
            } else {
                shade = shade_option[shade_index].text;
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
            var ispending;
            var selected_status = document.getElementById('isactive');
            var status = selected_status.options[selected_status.selectedIndex].text;
            if (status == "Paid") {
                ispending = "N";
            } else {
                ispending = "Y";
            }
            //objetct of data
            const pdata = [
                customer_id,
                product_id,
                shade,
                price,
                order_date,
                deliver_date,
                description,
                ispending,
                order_id
            ];

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
            $query = `UPDATE orders SET customer_id=?,product_id=?,shade=?,price=?,order_date=?,
                      deliver_date=?,description=?,ispending=? WHERE order_id = ?`;

            connection.query($query, pdata, function (err, rows, fields) {
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
    


    //????????????????Getting All Customers?????????????????//
    function getAllCustomers(forCustomers) {
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
        $query = 'SELECT * FROM `customers`';
        connection.query($query, function (err, rows, fields) {
            if (err) {
                console.log("An error ocurred performing the query.");
                console.log(err);
                return;
            }
            forCustomers(rows)
        });
        // Close the connection
        connection.end(function () {
            // The connection has been closed
        });
    }
    //???????????????????Getting All Products????????????????????//
    function getAllProducts(forProducts) {
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
        $query = 'SELECT * FROM `products`';
        connection.query($query, function (err, rows, fields) {
            if (err) {
                console.log("An error ocurred performing the query.");
                console.log(err);
                return;
            }
            forProducts(rows)
        });
        // Close the connection
        connection.end(function () {
            // The connection has been closed
        });
    }

    getAllCustomers(forCustomers);
    getAllProducts(forProducts);


})