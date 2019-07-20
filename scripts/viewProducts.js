const electron = require('electron')
const {
    ipcRenderer
} = electron;
const remote = require('electron').remote;
const mysql  = require('mysql')
const main = remote.require('./main.js')

document.getElementById('btncancel').addEventListener('click', function (e) {
    var window = remote.getCurrentWindow();
    window.close();
})

var table = document.getElementById("productTable")

function forProducts(productData) {

    for (var i = 0; i < productData.length; i++) {

        var newRow = table.insertRow(0);

        var cel1 = newRow.insertCell(0);
        var cel2 = newRow.insertCell(1);
        var cel3 = newRow.insertCell(2);
        var cel4 = newRow.insertCell(3);

        var opt = productData[i];

        var btnUpdate = document.createElement('button');
        btnUpdate.innerHTML = "Edit";
        btnUpdate.classList.add("btn");
        btnUpdate.classList.add("btn-info");
        btnUpdate.id = "btnEdit"
        btnUpdate.value = opt.product_id;


        cel1.innerHTML = opt.product_id;
        cel2.innerHTML = opt.product_name;
        cel3.innerHTML = opt.isactive;
        cel4.appendChild(btnUpdate);
    }

    var btns = document.querySelectorAll('#btnEdit');

    Array.prototype.forEach.call(btns, function addClickListener(btn) {
        btn.addEventListener('click', function (event) {
            // code here to handle click
            for (var i = 0; i < productData.length; i++) {

                if(btn.value == productData[i].product_id)
                {
                    ipcRenderer.send('edit_product',productData[i]);
                }

            }
        });
    });


}



//???????????????????Getting Real Products????????????????????//
function getProducts(forProducts) {
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
    // query for products
    $query = 'SELECT * FROM `products` WHERE isactive="Y"';
    connection.query($query, function (err, rows, fields) {
        if (err) {
            console.log("An error ocurred performing the query.");
            console.log(err);
            return;
        }
        forProducts(rows);
    });
    // Close the connection
    connection.end(function () {
        // The connection has been closed
    });
}

getProducts(forProducts);