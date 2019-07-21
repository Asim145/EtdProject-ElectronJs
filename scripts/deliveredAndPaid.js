const electron = require('electron')
const {
    ipcRenderer
} = electron;

var mysql = require('mysql');
const remote = require('electron').remote;
document.getElementById('btncancel').addEventListener('click', function (e) {
    var window = remote.getCurrentWindow();
    window.close();
})



var table = document.getElementById("orderTable")


function forOrder(orderData) {
    function forCustomer(customerData) {
        function forProduct(productData) {


            for (var i = 0; i < orderData.length; i++) {

                var newRow = table.insertRow(0);

                var cel1 = newRow.insertCell(0);
                var cel2 = newRow.insertCell(1);
                var cel3 = newRow.insertCell(2);
                var cel4 = newRow.insertCell(3);
                var cel5 = newRow.insertCell(4);
                var cel6 = newRow.insertCell(5);
                var cel7 = newRow.insertCell(6);
                var cel8 = newRow.insertCell(7);
                var cel9 = newRow.insertCell(8);
                var cel10 = newRow.insertCell(9);
                var cel11 = newRow.insertCell(10);
                var cel12 = newRow.insertCell(11);
                var cel13 = newRow.insertCell(12);

                var order = orderData[i];

                var btnUpdate = document.createElement('button');
                btnUpdate.innerHTML = "Edit";
                btnUpdate.classList.add("btn");
                btnUpdate.classList.add("btn-info");
                btnUpdate.id = "btnEdit";
                btnUpdate.value = order.order_id;


                var status;
                if (order.ispending == 'Y') {
                    status = "Pending";
                } else if (order.ispending == 'N') {
                    status = "Paid";
                }
                var product_name;
                var customer_name;
                var customer_organization;
                var customer_address;
                var customer_contact;

                for (var p = 0; p < productData.length; p++) {
                    var product = productData[p];
                    if (order.product_id == product.product_id) {
                        product_name = product.product_name;

                    }
                }
                for (var c = 0; c < customerData.length; c++) {
                    var customer = customerData[c];
                    if (order.customer_id == customer.customer_id) {
                        customer_name = customer.customer_name;
                        customer_organization = customer.customer_organization;
                        customer_contact = customer.customer_contact;
                        customer_address = customer.customer_address;

                    }
                }

                cel1.innerHTML = order.order_id;
                cel2.innerHTML = customer_name;
                cel3.innerHTML = product_name;
                cel4.innerHTML = order.shade;
                cel5.innerHTML = order.price;
                cel6.innerHTML = order.order_date//.split(' ')[0];
                cel7.innerHTML = order.deliver_date;
                cel8.innerHTML = customer_organization;
                cel9.innerHTML = customer_contact;
                cel10.innerHTML = customer_address;
                cel11.innerHTML = order.description;
                cel12.innerHTML = status;
                cel13.appendChild(btnUpdate);
            }

            var btns = document.querySelectorAll('#btnEdit');

            Array.prototype.forEach.call(btns, function addClickListener(btn) {
                btn.addEventListener('click', function (event) {
                    // code here to handle click
                    for (var i = 0; i < orderData.length; i++) {

                        if (btn.value == orderData[i].order_id) {
                            ipcRenderer.send('edit_order', orderData[i]);
                        }

                    }
                });
            });
        }



        //???????????????????Getting Active Products????????????????????//
        function getProduct(forProduct) {
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
                forProduct(rows)
            });


            // Close the connection
            connection.end(function () {
                // The connection has been closed
            });
        }

        getProduct(forProduct);

    }


    //???????????????????Getting Active Products????????????????????//
    function getCustomer(forCustomer) {
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
        // query for Active customers
        $query = 'SELECT * FROM `customers` WHERE isactive="Y"';
        connection.query($query, function (err, rows, fields) {
            if (err) {
                console.log("An error ocurred performing the query.");
                console.log(err);
                return;
            }
            forCustomer(rows)
        });


        // Close the connection
        connection.end(function () {
            // The connection has been closed
        });
    }
    getCustomer(forCustomer);
}


//???????????????????Getting Processing Orders????????????????????//
function getOrder(forOrder) {
    // Add the credentials to access your database
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: null, // or the original password : 'apaswword'
        database: 'etddatabase',
       // timezone: 'utc'
    });
    // connect to mysql
    connection.connect(function (err) {
        // in case of error
        if (err) {
            console.log(err.code);
            console.log(err.fatal);
        }
    });
    // query for processing orders
    $query1 = 'SELECT * FROM `orders` WHERE deliver_date!="0000-00-00" AND ispending="N"';
    connection.query($query1, function (err, rows, fields) {
        if (err) {
            console.log("An error ocurred performing the query.");
            console.log(err);
            return;
        }
        forOrder(rows)


    });


    // Close the connection
    connection.end(function () {
        // The connection has been closed
    });
}

getOrder(forOrder);