const electron = require('electron')
const {
    ipcRenderer
} = electron;

ipcRenderer.on('real_product_ready', (event, productData) => {
    createTable(productData);
})

var table = document.getElementById("productTable")

function createTable(productData) {

    for (var i = 0; i < productData.length; i++) {

        var newRow = table.insertRow(1);

        var cel1 = newRow.insertCell(0);
        var cel2 = newRow.insertCell(1);
        var cel3 = newRow.insertCell(2);
        var cel4 = newRow.insertCell(3);

        var btnUpdate = document.createElement('button');
        btnUpdate.innerHTML = "Update";

        var opt = productData[i];
        cel1.innerHTML = opt.product_id;
        cel2.innerHTML = opt.product_name;
        cel3.innerHTML = opt.isactive;
        cel4.appendChild(btnUpdate);
    }
}