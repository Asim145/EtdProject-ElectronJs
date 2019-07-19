const electron = require('electron')
const {
    ipcRenderer
} = electron;
const remote = require('electron').remote;

const main = remote.require('./main.js')

document.getElementById('btncancel').addEventListener('click', function (e) {
    var window = remote.getCurrentWindow();
    window.close();
})

ipcRenderer.on('real_product_ready', (event, productData) => {
    createTable(productData);
})
var table = document.getElementById("productTable")

function createTable(productData) {

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