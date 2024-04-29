const visualizer = document.querySelector('.visualizer');
const bufferLength = 64;
let elements = [];
let intervalId = null; // Variable to hold interval ID

// Function to reset the scale of all elements to 0
const resetScale = () => {
    for (let i = 0; i < bufferLength; i++) {
        elements[i].style.transform = `rotate(${(360 / bufferLength) * i}deg) scaleY(0)`;
    }
};

// Function to stop the animation
const stopAnimation = () => {
    resetScale();
    clearInterval(intervalId);
};

// Function to resume the animation
const resumeAnimation = () => {
    intervalId = setInterval(update, 500);
};

for (let i = 0; i < bufferLength; i++) {
    const element = document.createElement('span');
    element.classList.add('element');
    element.style.transform = `rotate(${(360 / bufferLength) * i}deg)`;
    elements.push(element);
    visualizer.appendChild(element);
}

const update = () => {
    for (let i = 0; i < bufferLength; i++) {
        const scale = Math.random() * 2.5; 
        elements[i].style.transform = `rotate(${(360 / bufferLength) * i}deg) scaleY(${scale})`;
    }
};

// Function to fetch JSON data from the provided URL
const fetchData = async () => {
    try {
        const response = await fetch('https://akiraserver-default-rtdb.firebaseio.com/.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
};

// Function to check for changes in the 'talking' value and act accordingly
let previousTalkingStatus = null; // Variable to store the previous value of 'talking'

// Function to check for changes in the 'talking' value and act accordingly
const checkTalkingStatus = async () => {
    const data = await fetchData();
    if (data && typeof data.talking !== 'undefined') {
        const currentTalkingStatus = data.talking;
        if (currentTalkingStatus !== previousTalkingStatus) {
            if (currentTalkingStatus) {
                resumeAnimation();
            } else {
                stopAnimation();
            }
            previousTalkingStatus = currentTalkingStatus;
        }
    }
};

// Interval to check for changes in 'talking' value every 500 milliseconds
setInterval(checkTalkingStatus, 500);

