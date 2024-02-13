let timer = false;
let hour = 0;
let minute = 0;
let second = 0;
let count = 0;

let divTime = document.getElementById('div_time');
let divStart = document.getElementById('div_start');
divTime.setAttribute('hidden', true);

document.getElementById('startButton').addEventListener('click', function() {
    timer = true;
    stopWatch();

    divStart.setAttribute('hidden', true);
    divTime.removeAttribute('hidden');
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
    }
}

document.addEventListener('mousemove', handleReset);
document.addEventListener('keydown', handleReset);

function handleReset() {
    timer = false;
    hour = 0;
    minute = 0;
    second = 0;
    count = 0;
    document.getElementById('hr').textContent = "00";
    document.getElementById('min').textContent = "00";
    document.getElementById('sec').textContent = "00";
    document.getElementById('count').textContent = "00";

    divStart.removeAttribute('hidden');
    divTime.setAttribute('hidden', true);
}
