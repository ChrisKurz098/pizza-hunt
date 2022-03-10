//create var to hold db connection 
let db;

// establish a connection to IndexDB database called pizza_hunt and set it to v1.
const request = indexedDB.open('pizza_hunt', 1);

// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function (event) {
    //save reference to database
    const db = event.target.result;
    // create an object store (table) called `new_pizza`, set it to have an auto incrementing primary key of sorts
    db.createObjectStore('new_pizza', { autoIncrement: true });
};

// upon a successful 
request.onsuccess = function (event) {
    // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save a reference to db in global variable
    db = event.target.result;

    // check if app is online, if yes run uploadPizza() function to send all local db data to api
    if (navigator.onLine) {
        // we haven't created this yet, but we will soon, so let's comment it out for now
        uploadPizza();
    }
};

request.onerror = function (event) {
    // log error here
    console.log(event.target.errorCode);
};

// This function will be executed if we attempt to submit a new pizza and there's no internet connection
function saveRecord(record) {
    //open a new transaction with the database with read/write permmisions
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    //access the object store for 'new_pizza'
    const pizzaobjectStore = transaction.objectStore('new_pizza');

    //add record to Your store with the add method
    pizzaobjectStore.add(record);

}

function uploadPizza() {
    //open a new transaction with the database with read/write permmisions
    const transaction = db.transaction(['new_pizza'], 'readwrite');

    //access the object store for 'new_pizza'
    const pizzaobjectStore = transaction.objectStore('new_pizza');
    const getAll = pizzaobjectStore.getAll();

    // upon a successful .getAll() execution, run this function

    getAll.onsuccess = function () {
        // if there was data in indexedDb's store, let's send it to the api server
        if (getAll.result.length > 0) {
            fetch('api/pizzas', {
                method: 'POST',
                body: JSON.stringify(getAll.result),
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                }
            })
                .then(response => response.json())
                .then(serverResponse => {
                    if (serverResponse.message) throw new Error(serverResponse);
                    //new transaction to clear the object store now that data is saved to server
                    const transaction = db.transaction(['new_pizza'], 'readwrite');
                    const pizzaobjectStore = transaction.objectStore('new_pizza');
                    //clear all items in store
                    pizzaobjectStore.clear();
                    alert('All offline pizzas have been submitted!');
                })
                .catch(err => console.log(err))
        }
    }
};


// listen for app coming back online
window.addEventListener('online', uploadPizza);