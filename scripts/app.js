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

/*document.getElementById("startBtn").addEventListener("click", () => {
    console.log("startPomo called");
    if (!hasStarted) {
        // First time: START the timer
        startPomo(25, 0);
        document.getElementById("startBtn").textContent = "Resume";
        hasStarted = true;
    } else {
        // After starting: RESUME the timer
        resumePomo();
    }
});

/*console.log("app.js loaded");

const startBtn = document.getElementById("startBtn");
if (startBtn) {
    console.log("startBtn found");
    startBtn.addEventListener("click", () => {
        console.log("Start clicked");
    });
} else {
    console.error("startBtn not found!");
}

function startPomo(minutes, seconds) {
    let mins = minutes;
    let secs = seconds;
    
    updateDisplay(mins, secs);

    const timerId = setInterval(() => {
        if (secs === 0) {
            if (mins === 0) {
                clearInterval(timerId);
                document.getElementById("timeDisplay").innerHTML = "FINITO";
                return;
            }
            mins--;
            secs = 59;
        } else {
            secs--;
        }

        updateDisplay(mins, secs);
    }, 1000);
}

document.getElementById("pauseBtn").addEventListener("click", () => {
    pausePomo();
});

function startPomo(minutes, seconds) {
    clearInterval(timerId);

    currentMins = minutes;
    currentSecs = seconds;
    isPaused = false;

    updateDisplay(currentMins, currentSecs);

    timerId = setInterval(runTimer, 1000);
}

function runTimer() {
    if (isPaused) return;

    if (currentSecs === 0) {
        if (currentMins === 0) {
            clearInterval(timerId);
            document.getElementById("timeDisplay").textContent = "FINITO";
            return;
        }
        currentMins--;
        currentSecs = 59;
    } else {
        currentSecs--;
    }

    updateDisplay(currentMins, currentSecs);
}

function pausePomo() {
    isPaused = true;
}

function resumePomo() {
    isPaused = false;
}

function updateDisplay(mins, secs) {
    document.getElementById("timeDisplay").innerHTML =
        `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}*/

// Minimal, robust implementation of the timer and canvas.
// Wrapped in DOMContentLoaded so it only runs after the page is ready.

/*document.addEventListener("DOMContentLoaded", () => {
	const sessionNameInput = document.getElementById("sessionNameInput");
	const minutesInput = document.getElementById("minutesInput");
	const drinkSelect = document.getElementById("drinkSelect");
	const startBtn = document.getElementById("startBtn");
	const pauseBtn = document.getElementById("pauseBtn");
	const resetBtn = document.getElementById("resetBtn");
	const timeDisplay = document.getElementById("timeDisplay");
	const statusText = document.getElementById("statusText");
	const musicToggle = document.getElementById("musicToggle");
	const iceCanvas = document.getElementById("iceCanvas");
	const controlsToggle = document.getElementById("controlsToggle");
	const quickDetailsBtn = document.getElementById("quickDetailsBtn");
	const controlsDrawer = document.getElementById("controlsDrawer");
	const drawerBackdrop = document.getElementById("drawerBackdrop");

	if (
		!sessionNameInput ||
		!minutesInput ||
		!drinkSelect ||
		!startBtn ||
		!pauseBtn ||
		!resetBtn ||
		!timeDisplay ||
		!statusText ||
		!musicToggle ||
		!iceCanvas ||
		!controlsToggle ||
		!quickDetailsBtn ||
		!controlsDrawer ||
		!drawerBackdrop
	) {
		console.error("Pomomelto: one or more required DOM elements are missing.");
		return;
	}

	const ctx = iceCanvas.getContext("2d");
	const DEFAULT_MINUTES = Number(minutesInput.value) || 25;

	const timerState = {
		totalSeconds: DEFAULT_MINUTES * 60,
		remainingSeconds: DEFAULT_MINUTES * 60,
		lastTimestamp: null,
		state: "idle", // idle | running | paused | complete
		rafId: null,
		musicOn: false,
		sessionName: ""
	};

	const imageCache = new Map(); // key: drink value (e.g. "matcha") -> HTMLImageElement

	function formatTime(seconds) {
		const wholeSeconds = Math.max(0, Math.floor(seconds));
		const mins = Math.floor(wholeSeconds / 60);
		const secs = wholeSeconds % 60;
		return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
	}

	function setButtons() {
		const { state } = timerState;
		startBtn.disabled = state === "running";
		pauseBtn.disabled = state !== "running";
		resetBtn.disabled = state === "idle";
	}

	function drawIce() {
		// Resize canvas to container
		const container = iceCanvas.parentElement;
		if (container) {
			const w = container.clientWidth || 400;
			const h = container.clientHeight || 400;
			if (iceCanvas.width !== w || iceCanvas.height !== h) {
				iceCanvas.width = w;
				iceCanvas.height = h;
			}
		} else {
			// Fallback to default size if container not found
			if (iceCanvas.width === 0 || iceCanvas.height === 0) {
				iceCanvas.width = 400;
				iceCanvas.height = 400;
			}
		}

		const { width, height } = iceCanvas;
		if (!width || !height) {
			console.warn("Canvas has no dimensions:", width, height);
			return;
		}

		ctx.clearRect(0, 0, width, height);

		const progress =
			timerState.totalSeconds > 0
				? 1 - timerState.remainingSeconds / timerState.totalSeconds
				: 0;

		// Try to use image for current drink if loaded
		const drinkKey = (drinkSelect.value || "").toLowerCase();
		let img = imageCache.get(drinkKey);
		// Fallbacks if current drink not loaded yet
		if (!img) {
			img = imageCache.get("matcha") || imageCache.get("coffee");
		}
		if (img) {
			const maxW = width * 0.8;
			const maxH = height * 0.8;
			const scale = Math.min(maxW / img.width, maxH / img.height);
			const drawW = img.width * scale;
			const drawH = img.height * scale;
			const dx = (width - drawW) / 2;
			const dy = (height - drawH) / 2;
			ctx.drawImage(img, dx, dy, drawW, drawH);
			return;
		}

		// Fallback: simple ice block
		const baseHeight = height * 0.5;
		const currentHeight = Math.max(40, baseHeight * (1 - progress));
		const melt = baseHeight - currentHeight;

		const cubeWidth = 180;
		const x = width / 2 - cubeWidth / 2;
		const y = height / 2 - currentHeight / 2 + melt * 0.8;

		// Puddle
		ctx.beginPath();
		ctx.ellipse(
			width / 2,
			y + currentHeight + 26,
			150 + progress * 60,
			28 + progress * 12,
			0,
			0,
			Math.PI * 2
		);
		ctx.fillStyle = `rgba(122, 151, 175, ${0.08 + progress * 0.25})`;
		ctx.fill();

		// Cube
		const gradient = ctx.createLinearGradient(x, y, x, y + currentHeight);
		gradient.addColorStop(0, `rgba(209, 235, 241, ${0.82 - progress * 0.3})`);
		gradient.addColorStop(1, `rgba(136, 164, 182, ${0.72 - progress * 0.4})`);

		ctx.fillStyle = gradient;
		ctx.strokeStyle = `rgba(102, 132, 160, 0.35)`;
		ctx.lineWidth = 2;
		const radius = 16 - progress * 6;

		ctx.beginPath();
		ctx.moveTo(x + radius, y);
		ctx.lineTo(x + cubeWidth - radius, y);
		ctx.quadraticCurveTo(x + cubeWidth, y, x + cubeWidth, y + radius);
		ctx.lineTo(x + cubeWidth, y + currentHeight - radius);
		ctx.quadraticCurveTo(
			x + cubeWidth,
			y + currentHeight,
			x + cubeWidth - radius,
			y + currentHeight
		);
		ctx.lineTo(x + radius, y + currentHeight);
		ctx.quadraticCurveTo(x, y + currentHeight, x, y + currentHeight - radius);
		ctx.lineTo(x, y + radius);
		ctx.quadraticCurveTo(x, y, x + radius, y);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	}

	function updateDisplay() {
		timeDisplay.textContent = formatTime(timerState.remainingSeconds);
		const drinkLabel =
			drinkSelect.options[drinkSelect.selectedIndex]?.text || "drink";
		const sessionName = timerState.sessionName.trim() || "Focus Session";

		switch (timerState.state) {
			case "running":
				statusText.textContent = `${sessionName} • ${drinkLabel}`;
				break;
			case "paused":
				statusText.textContent = `Paused: ${sessionName}`;
				break;
			case "complete":
				statusText.textContent = `✓ ${sessionName} Complete!`;
				break;
			default:
				statusText.textContent = sessionName || "Ready";
		}
		drawIce();
	}

	function resetTimerState(newMinutes) {
		timerState.totalSeconds = newMinutes * 60;
		timerState.remainingSeconds = timerState.totalSeconds;
		timerState.lastTimestamp = null;
		timerState.state = "idle";
		cancelAnimationFrame(timerState.rafId);
		timerState.rafId = null;
		setButtons();
		updateDisplay();
	}

	function tick(timestamp) {
		if (timerState.state !== "running") return;

		if (!timerState.lastTimestamp) {
			timerState.lastTimestamp = timestamp;
			timerState.rafId = requestAnimationFrame(tick);
			return;
		}

		const delta = (timestamp - timerState.lastTimestamp) / 1000;
		timerState.lastTimestamp = timestamp;
		timerState.remainingSeconds = Math.max(
			timerState.remainingSeconds - delta,
			0
		);

		updateDisplay();

		if (timerState.remainingSeconds <= 0.05) {
			timerState.state = "complete";
			timerState.remainingSeconds = 0;
			setButtons();
			updateDisplay();
			return;
		}

		timerState.rafId = requestAnimationFrame(tick);
	}

	function handleStart() {
		console.log("handleStart called");
		const minutes = Number(minutesInput.value);
		if (!Number.isFinite(minutes) || minutes <= 0) {
			minutesInput.classList.add("error");
			minutesInput.focus();
			return;
		}
		minutesInput.classList.remove("error");

		timerState.sessionName = sessionNameInput.value.trim();

		if (timerState.state === "idle" || timerState.state === "complete") {
			timerState.totalSeconds = minutes * 60;
			timerState.remainingSeconds = timerState.totalSeconds;
		}

		timerState.state = "running";
		timerState.lastTimestamp = null;
		setButtons();

		cancelAnimationFrame(timerState.rafId);
		timerState.rafId = requestAnimationFrame(tick);
		console.log("Timer started, state:", timerState.state);
	}

	function handlePause() {
		if (timerState.state !== "running") return;
		timerState.state = "paused";
		cancelAnimationFrame(timerState.rafId);
		timerState.rafId = null;
		setButtons();
		updateDisplay();
	}

	function handleReset() {
		resetTimerState(Number(minutesInput.value) || DEFAULT_MINUTES);
	}

	function handleInputChange() {
		if (timerState.state === "idle") {
			const minutes = Number(minutesInput.value) || DEFAULT_MINUTES;
			timerState.totalSeconds = minutes * 60;
			timerState.remainingSeconds = timerState.totalSeconds;
			timerState.sessionName = sessionNameInput.value.trim();
			updateDisplay();
		}
	}

	function handleSessionNameChange() {
		if (timerState.state === "idle") {
			timerState.sessionName = sessionNameInput.value.trim();
			updateDisplay();
		}
	}

	function handleMusicToggle() {
		timerState.musicOn = !timerState.musicOn;
		musicToggle.textContent = timerState.musicOn ? "Music: On" : "Music: Off";
		musicToggle.setAttribute("aria-pressed", String(timerState.musicOn));
	}

	function toggleDrawer() {
		const isOpen = controlsDrawer.getAttribute("aria-hidden") === "false";
		controlsDrawer.setAttribute("aria-hidden", String(isOpen));
		controlsToggle.setAttribute("aria-expanded", String(!isOpen));
		drawerBackdrop.hidden = isOpen;
	}

	function closeDrawer() {
		controlsDrawer.setAttribute("aria-hidden", "true");
		controlsToggle.setAttribute("aria-expanded", "false");
		drawerBackdrop.hidden = true;
	}

	function loadDrinkImages() {
		const options = Array.from(drinkSelect.options);
		options.forEach((opt) => {
			const value = (opt.value || "").toLowerCase();
			if (!value) return;
			const capitalized = value.charAt(0).toUpperCase() + value.slice(1);
			const src = `./assets/drinks/${capitalized}-1.png`;
			const img = new Image();
			img.src = src;
			img.onload = () => {
				console.log("Loaded drink image", value, src);
				imageCache.set(value, img);
				// If this is the currently selected drink, redraw
				if (value === (drinkSelect.value || "").toLowerCase()) {
					updateDisplay();
				}
			};
			img.onerror = (e) => {
				console.warn("Failed to load drink image", value, src, e);
			};
		});
	}

	// Event wiring
	console.log("Setting up event listeners...");
	startBtn.addEventListener("click", (e) => {
		console.log("Start button clicked", e);
		handleStart();
	});
	pauseBtn.addEventListener("click", handlePause);
	resetBtn.addEventListener("click", handleReset);
	minutesInput.addEventListener("change", handleInputChange);
	minutesInput.addEventListener("input", handleInputChange);
	sessionNameInput.addEventListener("input", handleSessionNameChange);
	musicToggle.addEventListener("click", handleMusicToggle);
	controlsToggle.addEventListener("click", toggleDrawer);
	quickDetailsBtn.addEventListener("click", toggleDrawer);
	drawerBackdrop.addEventListener("click", closeDrawer);
	drinkSelect.addEventListener("change", () => {
		if (timerState.state === "idle") {
			updateDisplay();
		}
	});
	console.log("Event listeners set up");

	window.addEventListener("visibilitychange", () => {
		if (document.hidden && timerState.state === "running") {
			handlePause();
		}
	});

	let resizeTimeout;
	window.addEventListener("resize", () => {
		clearTimeout(resizeTimeout);
		resizeTimeout = setTimeout(() => {
			updateDisplay();
		}, 150);
	});

	// Load drink images (Matcha, Coffee, etc.)
	loadDrinkImages();

	// Initial state
	console.log("Initializing Pomomelto...");
	resetTimerState(DEFAULT_MINUTES);
	console.log("Pomomelto initialized");
});
*/
