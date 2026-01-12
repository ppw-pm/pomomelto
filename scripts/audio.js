const NOTE_INTERVAL = 4; // seconds per generated note
const VOICES = [
	{ ratio: 1, gain: 0.24 },
	{ ratio: 5 / 4, gain: 0.18 },
	{ ratio: 3 / 2, gain: 0.12 }
];

class IceAmbient {
	constructor() {
		this.context = null;
		this.masterGain = null;
		this.active = false;
		this.lastTick = 0;
		this.schedulerId = null;
		this.baseFrequency = 196; // G3
		this.filter = null;
	}

	async start() {
		if (this.active) return;

		if (!this.context) {
			const AudioContext = window.AudioContext || window.webkitAudioContext;
			this.context = new AudioContext({ latencyHint: "playback" });
			this.masterGain = this.context.createGain();
			this.masterGain.gain.value = 0.0;
			this.masterGain.connect(this.context.destination);

			this.filter = this.context.createBiquadFilter();
			this.filter.type = "lowpass";
			this.filter.frequency.value = 1200;
			this.filter.Q.value = 0.7;

			this.filter.connect(this.masterGain);
		}

		if (this.context.state === "suspended") {
			await this.context.resume();
		}

		this.active = true;
		this.fadeTo(0.35, 1.5);
		this.lastTick = this.context.currentTime;
		this.schedule();
	}

	stop() {
		if (!this.active || !this.context) return;
		this.active = false;
		this.fadeTo(0.0, 1.5);
		if (this.schedulerId) cancelAnimationFrame(this.schedulerId);
	}

	setIntensity(factor) {
		if (!this.context || !this.filter) return;
		const clamped = Math.min(Math.max(factor, 0), 1);
		this.filter.frequency.linearRampToValueAtTime(800 + clamped * 600, this.context.currentTime + 0.5);
		this.baseFrequency = 176 + clamped * 40; // subtle variation
	}

	schedule = () => {
		if (!this.context || !this.active) return;
		const now = this.context.currentTime;
		if (now - this.lastTick >= NOTE_INTERVAL) {
			this.lastTick = now;
			this.triggerChord(now);
		}
		this.schedulerId = requestAnimationFrame(this.schedule);
	};

	triggerChord(time) {
		const drift = (Math.random() - 0.5) * 6;
		VOICES.forEach(({ ratio, gain }) => {
			const osc = this.context.createOscillator();
			const amp = this.context.createGain();

			osc.type = "sine";
			osc.frequency.value = this.baseFrequency * ratio + drift;

			amp.gain.setValueAtTime(0, time);
			amp.gain.linearRampToValueAtTime(gain, time + 0.8);
			amp.gain.linearRampToValueAtTime(gain * 0.5, time + 2.5);
			amp.gain.linearRampToValueAtTime(0, time + 4.5);

			osc.connect(amp).connect(this.filter);
			osc.start(time);
			osc.stop(time + 5);
		});

		// Subtle noise wash
		const noiseBuffer = this.context.createBuffer(1, this.context.sampleRate * 2, this.context.sampleRate);
		const data = noiseBuffer.getChannelData(0);
		for (let i = 0; i < data.length; i++) {
			data[i] = (Math.random() * 2 - 1) * 0.3;
		}

		const noiseSource = this.context.createBufferSource();
		noiseSource.buffer = noiseBuffer;
		const noiseGain = this.context.createGain();
		noiseGain.gain.setValueAtTime(0, time);
		noiseGain.gain.linearRampToValueAtTime(0.12, time + 0.6);
		noiseGain.gain.linearRampToValueAtTime(0, time + 2.5);

		noiseSource.connect(noiseGain).connect(this.filter);
		noiseSource.start(time);
		noiseSource.stop(time + 2.6);
	}

	fadeTo(targetGain, duration) {
		if (!this.masterGain) return;
		const now = this.context.currentTime;
		this.masterGain.gain.cancelScheduledValues(now);
		this.masterGain.gain.setTargetAtTime(targetGain, now, duration / 5);
	}
}

export const ambientAudio = new IceAmbient();

