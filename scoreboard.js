const dbName = 'StopwatchDB';
const objectStoreName = 'ResetTimes';
let db;

let dataTime = [];

const request = indexedDB.open(dbName, 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    const objectStore = db.createObjectStore(objectStoreName, { keyPath: 'id', autoIncrement: true });
    objectStore.createIndex('resetTime', 'resetTime', { unique: false });
};

request.onsuccess = function(event) {
    db = event.target.result;

    const transaction = db.transaction([objectStoreName], 'readonly');
    const objectStore = transaction.objectStore(objectStoreName);

    const request = objectStore.getAll();

    request.onsuccess = function(event) {
        const data = event.target.result;
        console.log('Retrieved data:', data);

        const tableBody = document.querySelector('#dataTable tbody');
        tableBody.innerHTML = '';

        if (!data || data.length === 0) {
            const row = tableBody.insertRow();
            const cell = row.insertCell(0);
            cell.textContent = 'No data found.';
        }
        else{
            const dataTime = data.filter(element => element['totalTime'] !== '0 Sec')
                                .map(element => element['totalTime']);
    
            const tableBody = document.querySelector('#dataTable tbody');
            dataTime.forEach(time => {
                const row = tableBody.insertRow();
                const cell = row.insertCell(0);
                cell.textContent = time;
            });
        }
    };

    request.onerror = function(event) {
        console.error('Error retrieving data:', event.target.error);
    };
};

document.getElementById('resetButton').addEventListener('click', function() {
    const transaction = db.transaction([objectStoreName], 'readwrite');
    const objectStore = transaction.objectStore(objectStoreName);
    const clearRequest = objectStore.clear();

    clearRequest.onsuccess = function(event) {
        console.log('Object store cleared successfully.');

        const data = event.target.result;

        const tableBody = document.querySelector('#dataTable tbody');
        tableBody.innerHTML = '';

        if (!data || data.length === 0) {
            const row = tableBody.insertRow();
            const cell = row.insertCell(0);
            cell.textContent = 'No data found.';
        }
    };

    clearRequest.onerror = function(event) {
        console.error('Error clearing object store:', event.target.error);
    };
});

request.onerror = function(event) {
    console.error('Error opening database:', event.target.error);
};
