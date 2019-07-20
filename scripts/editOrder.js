const electron = require('electron')
const {
    ipcRenderer
} = electron;

const remote = require('electron').remote;

document.getElementById('btncancel').addEventListener('click', function (e) {
    remote.getCurrentWindow().close();
})



var customerData = [];
var productData = [];
customerData = ipcRenderer.sendSync('all_customer_data');
productData = ipcRenderer.sendSync('all_product_data');


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
    for (var i = 0; i < customerData.length; i++) {
        var opt = customerData[i];
        var el = document.createElement("option");
        el.textContent = opt.customer_name;
        el.value = opt.customer_id;
        customer.appendChild(el);
    }
    // To populate Products
    for (var i = 0; i < productData.length; i++) {
        var opt = productData[i];
        var el = document.createElement("option");
        el.textContent = opt.product_name;
        el.value = opt.product_id;
        product.appendChild(el);
    }
    //To Set Selected Customer
    for (var i = 0; i <= customerData.length; i++) {
        if (customer.options[i].value == selectedOrder.customer_id) {
            customer.options[i].selected = true;
        }
    }
    //To Set Selected Product
    for (var i = 0; i <= productData.length; i++) {
        if (product.options[i].value == selectedOrder.product_id) {
            product.options[i].selected = true;
        }
    }
    //To Set Selected Shade
    for (var i = 0; i < selected_shade.length; i++) {
        if (selected_shade.options[i].text == selectedOrder.shade) {
            selected_shade.options[i].selected = true;
        }
    }
    itsPrice.value = selectedOrder.price;
    orderDate.value = selectedOrder.order_date.split('T')[0];
    deliverDate.value = selectedOrder.deliver_date.split('T')[0];
    if (selectedOrder.description == "-") {
        desc.value = "";
    } else {
        desc.value = selectedOrder.description;
    }
    var isactive = document.getElementById('isactive');
    if (selectedOrder.ispending == "N") {
        isactive.options[1].selected = true;
    }
})


const form = document.querySelector('form');
form.addEventListener('submit', submitForm);

function submitForm(e) {
    e.preventDefault();

    ipcRenderer.send('data');
    ipcRenderer.on('le_data', function (e, data) {

        var order_id = data.order_id;

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
        var mysql = require('mysql');

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

    })

}