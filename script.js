let timer = false;
let hour = 0;
let minute = 0;
let second = 0;
let count = 0;

let totalTime = '';

let divTime = document.getElementById('div_time');
let divStart = document.getElementById('div_start');
divTime.setAttribute('hidden', true);

// Open IndexedDB database and create object store
const dbName = 'StopwatchDB';
const objectStoreName = 'ResetTimes';
let db;

const request = indexedDB.open(dbName, 1);

//Modal
var modal = document.getElementById("myModal");

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

request.onupgradeneeded = function(event) {
    db = event.target.result;
    const objectStore = db.createObjectStore(objectStoreName, { keyPath: 'id', autoIncrement: true });
    objectStore.createIndex('resetTime', 'resetTime', { unique: false });
};

request.onsuccess = function(event) {
    db = event.target.result;
};

document.getElementById('startButton').addEventListener('click', function() {
    timer = true;
    stopWatch();

    divStart.setAttribute('hidden', true);
    divTime.removeAttribute('hidden');
});

document.getElementById('closeModal').addEventListener('click', function(event) {
    modal.style.display = "none";
});

function stopWatch() {   
    if (timer) {
        count++;
        if (count === 100) {
            second++;
            count = 0;
        }
        if (second === 60) {
            minute++;
            second = 0;
        }
        if (minute === 60) {
            hour++;
            minute = 0;
            second = 0;
        }

        let hrString = hour < 10 ? "0" + hour : hour;
        let minString = minute < 10 ? "0" + minute : minute;
        let secString = second < 10 ? "0" + second : second;
        let countString = count < 10 ? "0" + count : count;

        document.getElementById('hr').textContent = hrString;
        document.getElementById('min').textContent = minString;
        document.getElementById('sec').textContent = secString;
        document.getElementById('count').textContent = countString;

        setTimeout(stopWatch, 10);

        totalTime = parsingTime(hrString, minString, secString);
        
        document.addEventListener('mousemove', handleReset);
        document.addEventListener('keydown', handleReset);
    }
}

function parsingTime(hrString, minString, secString) {
    let hr = parseInt(hrString, 10);
    let min = parseInt(minString, 10);
    let sec = parseInt(secString, 10);

    // Format hours
    let formattedHr = (hr === 0) ? '' : hr + ' Hr ';

    // Format minutes
    let formattedMin = (min === 0) ? '' : (min < 10 ? min : min.toString().replace(/^0+/, '')) + ' Min ';

    // Format seconds
    let formattedSec = (sec === 0) ? '0 Sec' : sec + ' Sec';

    // Construct the totalTime string
    let totalFormattedTime = formattedHr + formattedMin + formattedSec;

    return totalFormattedTime;
}

function handleReset() {
    document.removeEventListener('mousemove', handleReset);
    document.removeEventListener('keydown', handleReset);

    timer = false;
    hour = 0;
    minute = 0;
    second = 0;
    count = 0;

    document.getElementById('time_data_modal').textContent = totalTime;

    // Store the reset time in IndexedDB
    const transaction = db.transaction([objectStoreName], 'readwrite');
    const objectStore = transaction.objectStore(objectStoreName);
    objectStore.add({ totalTime });


    document.getElementById('hr').textContent = "00";
    document.getElementById('min').textContent = "00";
    document.getElementById('sec').textContent = "00";
    document.getElementById('count').textContent = "00";

    divStart.removeAttribute('hidden');
    divTime.setAttribute('hidden', true);

    modal.style.display = "block";
}

// Open the Chrome DevTools
// Right-click on your webpage and select "Inspect" or press Ctrl+Shift+I (Windows/Linux) or Cmd+Option+I (Mac) to open DevTools.

// Go to the "Application" tab
// In the DevTools, navigate to the "Application" tab.

// Explore IndexedDB:
// In the "Application" tab, you'll find a section called "Storage" in the left sidebar.
// Expand "IndexedDB" to see a list of databases. Look for your database (in this example, it's named 'StopwatchDB').

// View Object Store data:
// Click on your database ('StopwatchDB').