const electron = require('electron')
const {
    ipcRenderer
} = electron;

const remote = require('electron').remote;
document.getElementById('btncancel').addEventListener('click', function (e) {
    var window = remote.getCurrentWindow();
    window.close();
})

ipcRenderer.on('real_customer_ready', (event, customerData) => {
    createTable(customerData);
})
var table = document.getElementById("productTable")


function createTable(customerData) {
    for (var i = 0; i < customerData.length; i++) {

        var newRow = table.insertRow(0);

        var cel1 = newRow.insertCell(0);
        var cel2 = newRow.insertCell(1);
        var cel3 = newRow.insertCell(2);
        var cel4 = newRow.insertCell(3);
        var cel5 = newRow.insertCell(4);
        var cel6 = newRow.insertCell(5);
        var cel7 = newRow.insertCell(6);

        var btnUpdate = document.createElement('button');
        btnUpdate.innerHTML = "Update";

        var opt = customerData[i];
        cel1.innerHTML = opt.customer_id;
        cel2.innerHTML = opt.customer_name;
        cel3.innerHTML = opt.customer_organization;
        cel4.innerHTML = opt.customer_contact;
        cel5.innerHTML = opt.customer_address;
        cel6.innerHTML = opt.isactive;
        cel7.appendChild(btnUpdate);
    }
}