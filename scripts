console.log("app.js loaded");

// ------------------------------------
// GLOBAL VARIABLES
// ------------------------------------
let timerId = null;
let currentMins = 0;
let currentSecs = 0;
let isPaused = false;

// Session settings
let sessionLength = 25;
let breakLength = 5;
let sessionName = "Session";
let selectedDrink = "matcha";

let iceImageIndex = 0;

// ------------------------------------
// ELEMENTS
// ------------------------------------
const startBtn = document.getElementById("startBtn");
const pauseBtn = document.getElementById("pauseBtn");
const resetBtn = document.getElementById("resetBtn");
const drinkImg = document.getElementById("drinkImg");
const timeDisplay = document.getElementById("timeDisplay");
const statusText = document.getElementById("statusText");

const settingsModal = document.getElementById("settingsModal");

// ------------------------------------
// DRINK IMAGE LISTS
// ------------------------------------
const drinkTypes = {
    ice: [
        "./assets/Ice/ice cube.png",
        "./assets/Ice/IceMelt1.png",
        "./assets/Ice/IceMelt2.png",
        "./assets/Ice/IceMelt3.png",
        "./assets/Ice/IceMelt4.png",
        "./assets/Ice/IceMelt5.png"
    ],
    matcha: [
        "./assets/Matcha/Matcha-1.png",
        "./assets/Matcha/Matcha-2.png",
        "./assets/Matcha/Matcha-3.png",
        "./assets/Matcha/Matcha-4.png",
        "./assets/Matcha/Matcha-5.png",
        "./assets/Matcha/Matcha-6.png"
    ],
    coffee: [
        "./assets/Coffee/Coffee-1.png",
        "./assets/Coffee/Coffee-2.png",
        "./assets/Coffee/Coffee-3.png",
        "./assets/Coffee/Coffee-4.png",
        "./assets/Coffee/Coffee-5.png",
        "./assets/Coffee/Coffee-6.png"
    ],
    chocolate: [
        "./assets/chocolate/Choco-1.png",
        "./assets/chocolate/Choco-2.png",
        "./assets/chocolate/Choco-3.png",
        "./assets/chocolate/Choco-4.png",
        "./assets/chocolate/Choco-5.png",
        "./assets/chocolate/Choco-6.png"
    ],
    icedlemontea: [
        "./assets/icedlemontea/IcedLemon-1.png",
        "./assets/icedlemontea/IcedLemon-2.png",
        "./assets/icedlemontea/IcedLemon-3.png",
        "./assets/icedlemontea/IcedLemon-4.png",
        "./assets/icedlemontea/IcedLemon-5.png",
        "./assets/icedlemontea/IcedLemon-6.png"
    ]
};

// ------------------------------------
// START BUTTON
// ------------------------------------
startBtn.addEventListener("click", () => {
    startPomo(sessionLength, 0);

    startBtn.disabled = true;
    pauseBtn.disabled = false;
    resetBtn.disabled = false;
});

// ------------------------------------
// PAUSE / RESUME BUTTON
// ------------------------------------
pauseBtn.addEventListener("click", () => {
    if (!isPaused) {
        pausePomo();
        pauseBtn.textContent = "Resume";
    } else {
        resumePomo();
        pauseBtn.textContent = "Pause";
    }
});

// ------------------------------------
// RESET BUTTON
// ------------------------------------
resetBtn.addEventListener("click", () => {
    clearInterval(timerId);

    currentMins = sessionLength;
    currentSecs = 0;
    isPaused = false;

    updateDisplay(sessionLength, 0);

    startBtn.disabled = false;

    pauseBtn.textContent = "Pause";
    pauseBtn.disabled = true;
});

// ------------------------------------
// START FUNCTION
// ------------------------------------
function startPomo(minutes, seconds) {
    clearInterval(timerId);

    currentMins = minutes;
    currentSecs = seconds;
    isPaused = false;

    updateDisplay(currentMins, currentSecs);

    timerId = setInterval(runTimer, 1000);
}

// ------------------------------------
// TIMER LOOP
// ------------------------------------
function runTimer() {
    if (isPaused) return;

    if (currentSecs === 0) {

        // IMAGE CHANGE EVERY 5 MINUTES
        if (currentMins % 5 === 0 && currentMins !== sessionLength) {
            changeIceImage();
        }

        if (currentMins === 0) {
            clearInterval(timerId);
            timeDisplay.textContent = "FINITO";
            statusText.textContent = "Session Complete! 🎉";
            
            // Trigger stamp animation
            completeSession();

            // Reset buttons
            startBtn.disabled = false;
            pauseBtn.disabled = true;
            pauseBtn.textContent = "Pause";
            
            // Reset timer display after 3 seconds
            setTimeout(() => {
                currentMins = sessionLength;
                currentSecs = 0;
                updateDisplay(sessionLength, 0);
                statusText.textContent = sessionName;
            }, 3000);

            return;
        }

        currentMins--;
        currentSecs = 59;

    } else {
        currentSecs--;
    }

    // Update drink image based on progress
    changeIceImage();

    updateDisplay(currentMins, currentSecs);
}

// ------------------------------------
// PAUSE / RESUME
// ------------------------------------
function pausePomo() {
    isPaused = true;
}

function resumePomo() {
    isPaused = false;
}

// ------------------------------------
// DISPLAY UPDATE
// ------------------------------------
function updateDisplay(mins, secs) {
    timeDisplay.textContent = 
        `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

// ------------------------------------
// IMAGE CHANGE LOGIC
// ------------------------------------
function changeIceImage() {
    const totalSeconds = sessionLength * 60;
    const currentTotalSeconds = (currentMins * 60) + currentSecs;
    const progressPercent = ((totalSeconds - currentTotalSeconds) / totalSeconds) * 100;

    // Calculate which image should be showing (0-5 for 6 images)
    const newImageIndex = Math.min(Math.floor(progressPercent / 20), 5);

    if (newImageIndex !== iceImageIndex) {
        iceImageIndex = newImageIndex;
        drinkImg.src = drinkTypes[selectedDrink][iceImageIndex];
    }
}

// ------------------------------------
// SETTINGS MODAL
// ------------------------------------
document.getElementById("detailsBtn").addEventListener("click", () => {
    settingsModal.classList.remove("hidden");
});

// SAVE SETTINGS
document.getElementById("saveSettingsBtn").addEventListener("click", () => {

    // Save new values
    sessionName = document.getElementById("sessionNameInput").value || "Session";
    sessionLength = parseInt(document.getElementById("sessionLengthInput").value);
    breakLength = parseInt(document.getElementById("breakLengthInput").value);
    selectedDrink = document.getElementById("drinkTypeInput").value;

    // Reset ice animation
    iceImageIndex = 0;
    drinkImg.src = drinkTypes[selectedDrink][0];

    // ⭐ STOP ANY RUNNING TIMER
    clearInterval(timerId);
    isPaused = false;

    // ⭐ RESET TIMER TO NEW SESSION LENGTH
    currentMins = sessionLength;
    currentSecs = 0;
    updateDisplay(sessionLength, 0);

    // ⭐ RESET BUTTON STATES
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    pauseBtn.textContent = "Pause";

    // ⭐ UPDATE STATUS NAME
    statusText.textContent = sessionName;

    settingsModal.classList.add("hidden");
});

// Close modal
document.getElementById("closeSettingsBtn").addEventListener('click', () => {
    settingsModal.classList.add("hidden");
});

// Close when clicking outside the modal
settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        settingsModal.classList.add("hidden");
    }
});

// Stamp emojis
const stampEmojis = ['☕', '🍵', '🧋', '🥤', '🍹', '🧃', '🫖'];

let stampCount = 0;

// Load stamps from localStorage
function loadStamps() {
    const saved = localStorage.getItem('focusStamps');
    if (saved) {
        stampCount = parseInt(saved);
        updateStampDisplay();
    }
}

// Save stamps to localStorage
function saveStamps() {
    localStorage.setItem('focusStamps', stampCount.toString());
}

// Update stamp count display
function updateStampDisplay() {
    document.getElementById('stampCountDisplay').textContent = stampCount;
    updateModal();
}

// Generate random stamp
function getRandomStamp() {
    return stampEmojis[Math.floor(Math.random() * stampEmojis.length)];
}

// Create floating stamp animation
function createFloatingStamp() {
    const stamp = document.createElement('div');
    stamp.className = 'floating-stamp';
    stamp.textContent = getRandomStamp();
    
    // Random position near center
    stamp.style.left = `${window.innerWidth / 2 - 30 + (Math.random() - 0.5) * 100}px`;
    stamp.style.top = `${window.innerHeight / 2}px`;
    
    document.body.appendChild(stamp);
    
    // Create stamp flying to button
    setTimeout(() => {
        createStampToButton(stamp.textContent);
    }, 500);
    
    // Remove after animation
    setTimeout(() => {
        stamp.remove();
    }, 2000);
}

// Create stamp flying to button
function createStampToButton(emoji) {
    const stamp = document.createElement('div');
    stamp.className = 'stamp-to-button';
    stamp.textContent = emoji;
    
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;
    stamp.style.left = `${startX}px`;
    stamp.style.top = `${startY}px`;
    
    const cardBtn = document.getElementById('cardBtn');
    const btnRect = cardBtn.getBoundingClientRect();
    const endX = btnRect.left + btnRect.width / 2;
    const endY = btnRect.top + btnRect.height / 2;
    
    stamp.style.setProperty('--tx', `${endX - startX}px`);
    stamp.style.setProperty('--ty', `${endY - startY}px`);
    
    document.body.appendChild(stamp);
    
    // Animate button
    setTimeout(() => {
        cardBtn.style.transform = 'scale(1.1)';
        setTimeout(() => {
            cardBtn.style.transform = '';
        }, 200);
    }, 800);
    
    // Remove after animation
    setTimeout(() => {
        stamp.remove();
    }, 1000);
}

// Complete session and add stamp
function completeSession() {
    stampCount++;
    saveStamps();
    updateStampDisplay();
    createFloatingStamp();
    
    // Check for reward (every 10 stamps)
    if (stampCount % 10 === 0) {
        setTimeout(() => {
            document.getElementById('rewardMessage').classList.add('show');
            setTimeout(() => {
                document.getElementById('rewardMessage').classList.remove('show');
            }, 3000);
        }, 1500);
    }
}

// Update modal
function updateModal() {
    const grid = document.getElementById('stampGrid');
    grid.innerHTML = '';
    
    // Create 10 slots per card
    const slotsPerCard = 10;
    const currentCard = Math.floor(stampCount / slotsPerCard);
    const stampsInCurrentCard = stampCount % slotsPerCard;
    
    for (let i = 0; i < slotsPerCard; i++) {
        const slot = document.createElement('div');
        slot.className = 'stamp-slot';
        
        if (i < stampsInCurrentCard) {
            slot.classList.add('filled');
            slot.textContent = getRandomStamp();
        } else {
            slot.classList.add('empty');
        }
        
        grid.appendChild(slot);
    }
    
    // Update progress
    const progress = (stampsInCurrentCard / slotsPerCard) * 100;
    document.getElementById('progressFill').style.width = `${progress}%`;
    document.getElementById('progressText').textContent = 
        `${stampsInCurrentCard} / ${slotsPerCard} stamps collected`;
}

// Event listeners for stamp modal
document.getElementById('cardBtn').addEventListener('click', () => {
    document.getElementById('modalOverlayStamp').classList.add('active');
});

document.getElementById('closeBtn').addEventListener('click', () => {
    document.getElementById('modalOverlayStamp').classList.remove('active');
});

document.getElementById('modalOverlayStamp').addEventListener('click', (e) => {
    if (e.target === document.getElementById('modalOverlayStamp')) {
        document.getElementById('modalOverlayStamp').classList.remove('active');
    }
});

// Initialize stamps on page load
loadStamps();
updateModal();

// Call completeSession() whenever a focus session is completed
// Example: completeSession();
