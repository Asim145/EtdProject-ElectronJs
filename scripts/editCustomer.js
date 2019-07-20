const electron = require('electron')
const {
    ipcRenderer
} = electron;

const remote = require('electron').remote;

document.getElementById('btncancel').addEventListener('click', function (e) {
    remote.getCurrentWindow().close();
})

ipcRenderer.on('selected_customer', function (e, data) {
    document.getElementById('customer_name').value = data.customer_name;
    var organization = document.getElementById('customer_organization');
    if (data.customer_organization == "N/A") {
        organization.value = "";
    } else {
        organization = data.customer_organization;
    }
    document.getElementById('customer_contact').value = data.customer_contact;
    var address = document.getElementById('customer_address');
    if (data.customer_address == "N/A") {
        address.value = "";
    } else {
        address = data.customer_address;
    }
    var isactive = document.getElementById('isactive');
    if (data.isactive == "N") {
        isactive.options[1].selected = true;
    }
})



const form = document.querySelector('form');
form.addEventListener('submit', submitForm);

function submitForm(e) {
    e.preventDefault();

    ipcRenderer.send('data');
    ipcRenderer.on('le_data', function (e, data) {

        const customer_name = (document.querySelector('#customer_name').value).trim();
        const customer_organization = (document.querySelector('#customer_organization').value).trim();
        const customer_contact = (document.querySelector('#customer_contact').value).trim();
        const customer_address = (document.querySelector('#customer_address').value).trim();

        if (customer_organization == "" || customer_organization == null) {
            customer_organization = "N/A"
        }
        if (customer_address == "" || customer_address == null) {
            customer_address = "N/A"
        }
        if (customer_contact == "" || customer_contact == null) {
            customer_contact = "N/A"
        }

        var customer_id = data.customer_id;
        var isactive;
        var selected_status = document.getElementById('isactive');
        isactive = selected_status.options[selected_status.selectedIndex].text;
        //objetct of data
        const pdata = [
            customer_name,
            customer_organization,
            customer_contact,
            customer_address,
            isactive,
            customer_id
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
        $query = 'UPDATE `customers` SET customer_name=?,customer_organization=?,customer_contact=?,customer_address=?,isactive=? WHERE customer_id = ?';

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