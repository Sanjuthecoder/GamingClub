// Web Audio API Sound Controller

const audioContext = new (window.AudioContext || window.webkitAudioContext)();

const playTone = (frequency, type, duration, volume = 0.1) => {
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, audioContext.currentTime);

    gain.gain.setValueAtTime(volume, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

    osc.connect(gain);
    gain.connect(audioContext.destination);

    osc.start();
    osc.stop(audioContext.currentTime + duration);
};

export const playMoveSound = (player) => {
    if (player === 'O') {
        // Soft, round sound for O (Sine wave)
        playTone(300, 'sine', 0.15, 0.2);
        setTimeout(() => playTone(400, 'sine', 0.1, 0.1), 50);
    } else {
        // Crisp, sharp sound for X (Triangle/Square)
        playTone(600, 'triangle', 0.1, 0.1);
        setTimeout(() => playTone(800, 'triangle', 0.05, 0.05), 30);
    }
};

export const playWinSound = () => {
    // A major chord for victory
    const now = audioContext.currentTime;

    // Arpeggio
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        setTimeout(() => playTone(freq, 'sine', 0.4, 0.2), i * 100);
    });
};

export const playResetSound = () => {
    playTone(200, 'sine', 0.3, 0.15);
};
