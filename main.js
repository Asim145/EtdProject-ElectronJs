const electron = require('electron');
const url = require('url');
const path = require('path');
const mysql = require('mysql');
const {
    app,
    BrowserWindow,
    Menu,
    ipcMain
} = electron;
let mainwindow, addOrderWindow, addProductWindow, addCustomerWindow,
    viewProductsWindow, viewCustomersWindow,processingOrderWindow, deliveredOrderWindow, deliveredAndPaidOrderWindow,
    recordProductsWindow,
    editProductWindow,editCustomerWindow,editOrderrWindow;

//Set Envoirenment for Production Mode//
//process.env.NODE_ENV = 'production'

//--------------------- Main Window -------------------//
function createMain() {
    mainwindow = new BrowserWindow({
        title: 'Expert-Tech Dental Lab',
        webPreferences: {
            nodeIntegration: true
        },
        backgroundColor: '#2e2c29',
        show: false,
        frame: false,
        minWidth: 800,
        minHeight: 620,

    });
    mainwindow.loadURL(url.format({
        pathname: path.join(__dirname, 'main.html'),
        protocol: 'file:',
        slashes: true
    }))
    mainwindow.once('ready-to-show', () => {
        mainwindow.show() //to prevent the white screen when loading the window, lets show it when it is ready
    })
}

//-------------------- For Windows ---------------------------//
app.on('ready', () => {
    if (mainwindow == null) {
        createMain();
        menu();
    }
});

app.on('closed', () => {
    mainwindow = null;
})

//---------------------- For Mac -----------------------------//
app.on('activate', () => {
    if (mainwindow == null) {
        createMain();
        menu();
    }
});
app.on('window-all-closed', () => {
    if (process.platform != 'darwin') {
        app.quit();
    }
})
//  Menu Template
const mainMenuTemplate = [{
        label: 'Orders',
        submenu: [{
                label: 'Add Order',
                click() {
                    craeteAddOrderWindow();
                }
            },
            {
                label: 'Processing Orders', //order to be delivered
                click() {
                    createProcessingOrderWindow();
                }
            },
            {
                label: 'Delivered Orders',
                click() {
                    createDeliveredOrderWindow();
                }
            },
            {
                label: 'UnPaid Orders', //Delivered but not paid
                click() {
                    createDeliveredButNotPaidOrderWindow();
                }
            },
            {
                label: 'Paid Orders(Record)', //Delivered & Paid
                click() {
                    createDeliveredAndPaidOrderWindow();
                }
            }
        ]
    },
    {
        label: 'Products',
        submenu: [{
                label: 'Add Product',
                click() {
                    createAddProductWindow();
                }
            },
            {
                label: 'Active Prducts',
                click() {
                    createViewProductsWindow();
                }
            },
            {
                label: 'Products Record',
                click() {
                    createRecordProductsWindow();
                }
            }
        ]
    },
    {
        label: 'Customers',
        submenu: [{
                label: 'Add Customer',
                click() {
                    createAddCustomerWindow();
                }
            },
            {
                label: 'Active Customers',
                click() {
                    createViewCustomersWindow();
                }
            },
            {
                label: 'Customers Record',
                click() {
                    createRecordCustomersWindow();
                }
            }
        ]
    },
    {
        label: 'Exit',
        submenu: [{
            label: 'Quit',
            accelerator: process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
            click() {
                app.quit();
            }
        }]
    }
]
//------------------- For mac first object is empty ---------------------//
if (process.platform == 'darwin') {
    mainMenuTemplate.shift({});
}
//---------------------- adding menu function --------------------------//
function menu() {
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
}
//------------- Add developer Tools if not in production --------------//
if (process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [{
                label: 'Toggle DevTools',
                accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            },
            {
                role: 'reload'
            }
        ]
    })
}
//---------------------------------Windows-------------------------------------//
// createAddProductWindow
function createAddProductWindow() {
    addProductWindow = new BrowserWindow({
        width: 400,
        height: 200,
        webPreferences: {
            nodeIntegration: true
        },
        frame: false,
        parent: mainwindow,
        resizable: false,
        modal: true
    });
    addProductWindow.loadURL(url.format({
        pathname: path.join(__dirname, './views/addProductWindow.html'),
        protocol: 'file:',
        slashes: true
    }))
}
// createAddCustomerWindow
function createAddCustomerWindow() {
    addCustomerWindow = new BrowserWindow({
        width: 800,
        height: 310,
        webPreferences: {
            nodeIntegration: true
        },
        frame: false,
        parent: mainwindow,
        resizable: false,
        modal: true
    });
    addCustomerWindow.loadURL(url.format({
        pathname: path.join(__dirname, './views/addCustomerWindow.html'),
        protocol: 'file:',
        slashes: true,
    }))
}
// createAddOrderWindow
function craeteAddOrderWindow() {
    addOrderWindow = new BrowserWindow({
        width: 800,
        height: 540,
        webPreferences: {
            nodeIntegration: true
        },
        frame: false,
        parent: mainwindow,
        resizable: false,
        modal: true
    });
    addOrderWindow.loadURL(url.format({
        pathname: path.join(__dirname, './views/addOrderWindow.html'),
        protocol: 'file:',
        slashes: true
    }))
    getCustomers(addOrderWindow);
    getProducts(addOrderWindow);
}
// createViewProductsWindow
function createViewProductsWindow() {
    viewProductsWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        frame: false,
        fullscreen: true
    });
    viewProductsWindow.loadURL(url.format({
        pathname: path.join(__dirname, './views/viewProductsWindow.html'),
        protocol: 'file:',
        slashes: true,
    }))
    getRealProducts(viewProductsWindow);
}
// createRecordProductsWindow
function createRecordProductsWindow() {
    recordProductsWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        frame: false,
        fullscreen: true
    });
    recordProductsWindow.loadURL(url.format({
        pathname: path.join(__dirname, './views/productsRecordWindow.html'),
        protocol: 'file:',
        slashes: true,
    }))
    getRecordProducts(recordProductsWindow);
}
// createViewCustomersWindow
function createViewCustomersWindow() {
    viewCustomersWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        frame: false,
        fullscreen: true
    });
    viewCustomersWindow.loadURL(url.format({
        pathname: path.join(__dirname, './views/viewCustomersWindow.html'),
        protocol: 'file:',
        slashes: true,
    }))
    getRealCustomers(viewCustomersWindow);
}
//createRecordCustomersWindow
function createRecordCustomersWindow() {
    recordCustomersWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        frame: false,
        fullscreen: true
    });
    recordCustomersWindow.loadURL(url.format({
        pathname: path.join(__dirname, './views/customersRecordWindow.html'),
        protocol: 'file:',
        slashes: true,
    }))
    getRecordCustomers(recordCustomersWindow);
}
//createProcessingOrderWindow
function  createProcessingOrderWindow() {
    processingOrderWindow = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        },
        show: false,
        frame: false,
        fullscreen: true
    });
    processingOrderWindow.loadURL(url.format({
        pathname: path.join(__dirname, './views/processingOrderWindow.html'),
        protocol: 'file:',
        slashes: true
    }))
    processingOrderWindow.once('ready-to-show', () => {
        processingOrderWindow.show() //to prevent the white screen when loading the window, lets show it when it is ready
    })
    getCustomers();
    getProducts();
    getUnderProcessOrders(processingOrderWindow);
}

//createDeliveredOrderWindow
function createDeliveredOrderWindow() {
    deliveredOrderWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'Delivered Orders',
        webPreferences: {
            nodeIntegration: true
        },
        frame: false,
        fullscreen: true
    });
    deliveredOrderWindow.loadURL(url.format({
        pathname: path.join(__dirname, './views/deliveredOrderWindow.html'),
        protocol: 'file:',
        slashes: true
    }))
    getCustomers();
    getProducts();
    getDeliveredOrders(deliveredOrderWindow);
}
//createDeliveredAndPaidOrderWindow
function createDeliveredAndPaidOrderWindow() {
    deliveredAndPaidOrderWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'Delivered & Paid Orders (Record)',
        webPreferences: {
            nodeIntegration: true
        },
        frame: false,
        fullscreen: true
    });
    deliveredAndPaidOrderWindow.loadURL(url.format({
        pathname: path.join(__dirname, './views/deliveredAndPaidOrderWindow.html'),
        protocol: 'file:',
        slashes: true
    }))
    getCustomers();
    getProducts();
    getDeliveredAndPaidOrders(deliveredAndPaidOrderWindow);
}
//createDeliveredButNotPaidOrderWindow
function createDeliveredButNotPaidOrderWindow() {
    deliveredButNotPaidOrderWindow = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'Delivered But Not Paid Orders',
        webPreferences: {
            nodeIntegration: true
        },
        frame: false,
        fullscreen: true
    });
    deliveredButNotPaidOrderWindow.loadURL(url.format({
        pathname: path.join(__dirname, './views/deliveredButNotPaidOrderWindow.html'),
        protocol: 'file:',
        slashes: true
    }))
    getCustomers();
    getProducts();
    getDeliveredButNotPaidOrders(deliveredButNotPaidOrderWindow);
}

//---------------------Database-----------------------------//

//????????????????Getting Active Customers?????????????????//
function getCustomers() {
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
    // query for Active Customers
    $query = 'SELECT * FROM `customers` WHERE isactive="Y"';
    connection.query($query, function (err, rows, fields) {
        if (err) {
            console.log("An error ocurred performing the query.");
            console.log(err);
            return;
        }
        ipcMain.on('customer_data', function (e) {
            e.returnValue = rows;
        })
    });
    // Close the connection
    connection.end(function () {
        // The connection has been closed
    });
}
//????????????????Getting All Customers?????????????????//
function getAllCustomers() {
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
    // query for Active Customers
    $query = 'SELECT * FROM `customers`';
    connection.query($query, function (err, rows, fields) {
        if (err) {
            console.log("An error ocurred performing the query.");
            console.log(err);
            return;
        }
        ipcMain.on('all_customer_data', function (e) {
            e.returnValue = rows;
        })
    });
    // Close the connection
    connection.end(function () {
        // The connection has been closed
    });
}
//???????????????????Getting Active Products????????????????????//
function getProducts() {
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
    // query for Active products
    $query = 'SELECT * FROM `products` WHERE isactive="Y"';
    connection.query($query, function (err, rows, fields) {
        if (err) {
            console.log("An error ocurred performing the query.");
            console.log(err);
            return;
        }
        ipcMain.on('product_data', function (e) {
            e.returnValue = rows;
        })
    });
    // Close the connection
    connection.end(function () {
        // The connection has been closed
    });
}
//???????????????????Getting All Products????????????????????//
function getAllProducts() {
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
    // query for Active products
    $query = 'SELECT * FROM `products`';
    connection.query($query, function (err, rows, fields) {
        if (err) {
            console.log("An error ocurred performing the query.");
            console.log(err);
            return;
        }
        ipcMain.on('all_product_data', function (e) {
            e.returnValue = rows;
        })
    });
    // Close the connection
    connection.end(function () {
        // The connection has been closed
    });
}
//??????????????????Getting Under Process Order?????????????????//
function getUnderProcessOrders(getWindow) {
    // Add the credentials to access your database
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: null, // or the original password : 'apaswword'
        database: 'etddatabase',
        timezone: 'utc'
    });
    // connect to mysql
    connection.connect(function (err) {
        // in case of error
        if (err) {
            console.log(err.code);
            console.log(err.fatal);
        }
    });
    // query for processing orders
    $query = 'SELECT * FROM `orders` WHERE deliver_date="0000-00-00"';
    connection.query($query, function (err, rows, fields) {
        if (err) {
            console.log("An error ocurred performing the query.");
            console.log(err);
            return;
        }
        getWindow.webContents.on('did-finish-load', () => {
            getWindow.webContents.send('order_ready', rows)
        })
    });
    // Close the connection
    connection.end(function () {
        // The connection has been closed
    });
}
//??????????????????Getting Delivered Order?????????????????//
function getDeliveredOrders(getWindow) {
    // Add the credentials to access your database
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: null, // or the original password : 'apaswword'
        database: 'etddatabase',
        timezone: 'utc'
    });
    // connect to mysql
    connection.connect(function (err) {
        // in case of error
        if (err) {
            console.log(err.code);
            console.log(err.fatal);
        }
    });
    // query for delivered orders
    $query = 'SELECT * FROM `orders` WHERE deliver_date!="0000-00-00"';
    connection.query($query, function (err, rows, fields) {
        if (err) {
            console.log("An error ocurred performing the query.");
            console.log(err);
            return;
        }
        getWindow.webContents.on('did-finish-load', () => {
            getWindow.webContents.send('order_ready', rows)
        })
    });
    // Close the connection
    connection.end(function () {
        // The connection has been closed
    });
}
//??????????????????????Getting Delivered And Paid Orders????????????????//
function getDeliveredAndPaidOrders(getWindow) {
    // Add the credentials to access your database
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: null, // or the original password : 'apaswword'
        database: 'etddatabase',
        timezone: 'utc'
    });
    // connect to mysql
    connection.connect(function (err) {
        // in case of error
        if (err) {
            console.log(err.code);
            console.log(err.fatal);
        }
    });
    // query for Delivered And Paid Orders
    $query = 'SELECT * FROM `orders` WHERE deliver_date!="0000-00-00" AND ispending="N"';
    connection.query($query, function (err, rows, fields) {
        if (err) {
            console.log("An error ocurred performing the query.");
            console.log(err);
            return;
        }
        getWindow.webContents.on('did-finish-load', () => {
            getWindow.webContents.send('order_ready', rows)
        })
    });
    // Close the connection
    connection.end(function () {
        // The connection has been closed
    });
}
//????????????????????Getting Delivered But Not Paid Orders????????????????//
function getDeliveredButNotPaidOrders(getWindow) {
    // Add the credentials to access your database
    var connection = mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: null, // or the original password : 'apaswword'
        database: 'etddatabase',
        timezone: 'utc'
    });
    // connect to mysql
    connection.connect(function (err) {
        // in case of error
        if (err) {
            console.log(err.code);
            console.log(err.fatal);
        }
    });
    // query for Delivered But Not Paid Orders
    $query = 'SELECT * FROM `orders` WHERE deliver_date!="0000-00-00" AND ispending="Y"';
    connection.query($query, function (err, rows, fields) {
        if (err) {
            console.log("An error ocurred performing the query.");
            console.log(err);
            return;
        }
        getWindow.webContents.on('did-finish-load', () => {
            getWindow.webContents.send('order_ready', rows)
        })
    });
    // Close the connection
    connection.end(function () {
        // The connection has been closed
    });
}
//????????????????Getting Real Customers?????????????????//
function getRealCustomers(getWindow) {
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
    $query = 'SELECT * FROM `customers` WHERE isactive="Y"';
    connection.query($query, function (err, rows, fields) {
        if (err) {
            console.log("An error ocurred performing the query.");
            console.log(err);
            return;
        }
        getWindow.webContents.on('did-finish-load', () => {
            getWindow.webContents.send('real_customer_ready', rows)
        })
    });
    // Close the connection
    connection.end(function () {
        // The connection has been closed
    });
}
//???????????????????Getting Real Products????????????????????//
function getRealProducts(getWindow) {
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
        getWindow.webContents.on('did-finish-load', () => {
            getWindow.webContents.send('real_product_ready', rows)
            getWindow.webContents.send('real_product_for_btn', rows)
        })
    });
    // Close the connection
    connection.end(function () {
        // The connection has been closed
    });
}
//???????????????????Getting Record Products????????????????????//
function getRecordProducts(getWindow) {
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
    // query for products Record
    $query = 'SELECT * FROM `products` WHERE isactive="N"';
    connection.query($query, function (err, rows, fields) {
        if (err) {
            console.log("An error ocurred performing the query.");
            console.log(err);
            return;
        }
        getWindow.webContents.on('did-finish-load', () => {
            getWindow.webContents.send('real_product_ready', rows)
        })
    });
    // Close the connection
    connection.end(function () {
        // The connection has been closed
    });
}
//????????????????Getting Record Customers?????????????????//
function getRecordCustomers(getWindow) {
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
    // query for Record Customers
    $query = 'SELECT * FROM `customers` WHERE isactive="N"';
    connection.query($query, function (err, rows, fields) {
        if (err) {
            console.log("An error ocurred performing the query.");
            console.log(err);
            return;
        }
        getWindow.webContents.on('did-finish-load', () => {
            getWindow.webContents.send('real_customer_ready', rows)
        })
    });
    // Close the connection
    connection.end(function () {
        // The connection has been closed
    });
}


/*-------------------- Update Windows ----------------*/

//??????????????????? Edit Product Window ????????????????????????//
ipcMain.on('edit_product', function(event, data){
    editProductWindow = new BrowserWindow({
        width: 400,
        height: 300,
        webPreferences: {
            nodeIntegration: true
        },
        frame: false,
        parent: viewProductsWindow,
        alwaysOnTop: true,
        resizable: false,
        modal: true
    });
    editProductWindow.loadURL(url.format({
        pathname: path.join(__dirname, './views/editProductWindow.html'),
        protocol: 'file:',
        slashes: true
    }))
    editProductWindow.webContents.on('did-finish-load', () => {
    editProductWindow.webContents.send('selected_product', data)
    })
    ipcMain.on('data',function(e ,args){
        e.sender.send('le_data', data)
        data = null;
    })
})

//??????????????????? Edit Customer Window ????????????????????????//
ipcMain.on('edit_customer', function(event, data){
    editCustomerWindow = new BrowserWindow({
        width: 800,
        height: 380,
        webPreferences: {
            nodeIntegration: true
        },
        frame: false,
        parent: viewCustomersWindow,
        alwaysOnTop: true,
        resizable: false,
        modal: true
    });
    editCustomerWindow.loadURL(url.format({
        pathname: path.join(__dirname, './views/editCustomerWindow.html'),
        protocol: 'file:',
        slashes: true
    }))
    editCustomerWindow.webContents.on('did-finish-load', () => {
        editCustomerWindow.webContents.send('selected_customer', data)
    })
    ipcMain.on('data',function(e ,args){
        e.sender.send('le_data', data)
        data = null;
    })
})

//??????????????????? Edit Order Window ????????????????????????//
ipcMain.on('edit_order', function(event, data){
    editOrderrWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        },
        frame: false,
        parent: processingOrderWindow,
        alwaysOnTop: true,
        resizable: false,
        modal: true
    });
    editOrderrWindow.loadURL(url.format({
        pathname: path.join(__dirname, './views/editOrderWindow.html'),
        protocol: 'file:',
        slashes: true
    }))
    getAllCustomers();
    getAllProducts();
    editOrderrWindow.webContents.on('did-finish-load', () => {
        editOrderrWindow.webContents.send('selected_order', data)
    })
    ipcMain.on('data',function(e ,args){
        e.sender.send('le_data', data)
        data = null;
    })
})