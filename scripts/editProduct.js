const electron = require('electron')
const {
    ipcRenderer
} = electron;

const remote = require('electron').remote;

document.getElementById('btncancel').addEventListener('click', function (e) {
    remote.getCurrentWindow().close();
})

ipcRenderer.on('selected_product', function (e, data) {
    document.getElementById('product_name').value = data.product_name;
    var isactive = document.getElementById('isactive');
    if (data.isactive == "N") {
        isactive.options[1].selected = true;
    }


    const form = document.querySelector('form');
    form.addEventListener('submit', submitForm);

    function submitForm(e) {
        e.preventDefault();

        const product_name = (document.querySelector('#product_name').value).trim();


        var product_id = data.product_id;
        var isactive;
        var selected_status = document.getElementById('isactive');
        isactive = selected_status.options[selected_status.selectedIndex].text;

        //objetct of data
        const pdata = [
            product_name, isactive, product_id
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
        $query = 'UPDATE `products` SET product_name = ?, isactive = ? WHERE product_id = ?';

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

})