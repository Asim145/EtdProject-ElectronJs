const electron = require('electron')
const {
    ipcRenderer
} = electron;

const remote = require('electron').remote;
document.getElementById('btncancel').addEventListener('click', function (e) {
    var window = remote.getCurrentWindow();
    window.close();
})

var customerData = [];
var productData = [];
customerData = ipcRenderer.sendSync('customer_data');
productData = ipcRenderer.sendSync('product_data');
ipcRenderer.on('order_ready', (event, orderData) => {
    createTable(orderData, customerData, productData);
})

var table = document.getElementById("orderTable")


function createTable(orderData, customerData, productData) {


    for (var i = 0; i < orderData.length; i++) {

        var newRow = table.insertRow(1);

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

        var btnUpdate = document.createElement('button');
        btnUpdate.innerHTML = "Update";

        var order = orderData[i];
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
        cel6.innerHTML = order.order_date;
        cel7.innerHTML = order.deliver_date;
        cel8.innerHTML = customer_organization;
        cel9.innerHTML = customer_contact;
        cel10.innerHTML = customer_address;
        cel11.innerHTML = order.description;
        cel12.innerHTML = status;
        cel13.appendChild(btnUpdate);
    }
}