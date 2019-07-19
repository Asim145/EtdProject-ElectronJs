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
    var customer_name = (document.getElementById('customer_name').value).trim();
    var customer_organization = (document.querySelector('#customer_organization').value).trim();
    var customer_address = (document.querySelector('#customer_address').value).trim();
    var customer_contact = (document.querySelector('#customer_contact').value).trim();
    
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
    if(customer_organization == "" || customer_organization == null){
        customer_organization = "N/A"
    }
    if(customer_address == "" || customer_address == null){
        customer_address = "N/A"
    }
    if(customer_contact == "" || customer_contact == null){
        customer_contact = "N/A"
    }

    //objetct of data 
    const cdata = {
        customer_name: customer_name,
        customer_organization: customer_organization,
        customer_address: customer_address,
        customer_contact: customer_contact
    }
    console.log("---------------------------------")
    console.log(cdata)
    console.log("---------------------------------")

    // Perform a query
    $query = 'INSERT INTO `customers` SET ?';

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

    ipcRenderer.send('reload_customer', 'ping');
}