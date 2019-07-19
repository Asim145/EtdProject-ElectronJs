const electron = require('electron')
const {
    ipcRenderer
} = electron;

const remote = require('electron').remote;

document.getElementById('btncancel').addEventListener('click', function (e) {
    var window = remote.getCurrentWindow();
    window.close();
})

const form = document.querySelector('form');
form.addEventListener('submit', submitForm);

function submitForm(e) {
    e.preventDefault();
    const product_name = (document.querySelector('#product_name').value).trim();


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

    //objetct of data 
    const pdata = {
        product_name: product_name
    }
    console.log("---------------------------------")
    console.log(pdata)
    console.log("---------------------------------")

    // Perform a query
    $query = 'INSERT INTO `products` SET ?';

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
    ipcRenderer.send('reload_product', 'ping');
}