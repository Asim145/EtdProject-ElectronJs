const electron = require('electron')
const {
    ipcRenderer
} = electron;
const mysql = require('mysql')
const remote = require('electron').remote;
document.getElementById('btncancel').addEventListener('click', function (e) {
    remote.getCurrentWindow().close();
})

function forCustomer(customerData) {
    var table = document.getElementById("productTable")

    for (var i = 0; i < customerData.length; i++) {

        var newRow = table.insertRow(0);

        var cel1 = newRow.insertCell(0);
        var cel2 = newRow.insertCell(1);
        var cel3 = newRow.insertCell(2);
        var cel4 = newRow.insertCell(3);
        var cel5 = newRow.insertCell(4);
        var cel6 = newRow.insertCell(5);
        var cel7 = newRow.insertCell(6);

        var opt = customerData[i];

        var btnUpdate = document.createElement('button');
        btnUpdate.innerHTML = "Edit";
        btnUpdate.classList.add("btn");
        btnUpdate.classList.add("btn-info");
        btnUpdate.id = "btnEdit"
        btnUpdate.value = opt.customer_id;


        cel1.innerHTML = opt.customer_id;
        cel2.innerHTML = opt.customer_name;
        cel3.innerHTML = opt.customer_organization;
        cel4.innerHTML = opt.customer_contact;
        cel5.innerHTML = opt.customer_address;
        cel6.innerHTML = opt.isactive;
        cel7.appendChild(btnUpdate);
    }

    var btns = document.querySelectorAll('#btnEdit');

    Array.prototype.forEach.call(btns, function addClickListener(btn) {
        btn.addEventListener('click', function (event) {
            // code here to handle click
            for (var i = 0; i < customerData.length; i++) {

                if (btn.value == customerData[i].customer_id) {
                    ipcRenderer.send('edit_customer', customerData[i]);
                }

            }
        });
    });

}

//????????????????Getting Real Customers?????????????????//
function getCustomers(forCustomer) {
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
    // query for customers
    $query = 'SELECT * FROM `customers` WHERE isactive="N"';
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

getCustomers(forCustomer);