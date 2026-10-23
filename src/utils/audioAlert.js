// Web Audio API chime generator for high-priority Ready alerts
export const playReadyChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();

    // Notes: C5 -> E5 -> G5 -> C6 happy chord progression
    const notes = [523.25, 659.25, 783.99, 1046.50];
    const startTime = ctx.currentTime;

    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime + index * 0.12);

      gain.gain.setValueAtTime(0.25, startTime + index * 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + index * 0.12 + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + index * 0.12);
      osc.stop(startTime + index * 0.12 + 0.7);
    });

    // Device vibration for mobile browsers
    if ('vibrate' in navigator) {
      navigator.vibrate([250, 100, 250]);
    }
  } catch (err) {
    console.warn('Could not play audio chime:', err);
  }
};

// Kitchen New Order Sound Alert (Ding-Dong Service Bell)
export const playNewOrderKitchenAlert = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();
    const startTime = ctx.currentTime;

    // Dual-tone service bell (880Hz A5 followed by 1174.6Hz D6)
    const tones = [
      { freq: 880, delay: 0, dur: 0.4 },
      { freq: 1174.66, delay: 0.25, dur: 0.6 }
    ];

    tones.forEach((tone) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(tone.freq, startTime + tone.delay);

      gain.gain.setValueAtTime(0.35, startTime + tone.delay);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + tone.delay + tone.dur);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime + tone.delay);
      osc.stop(startTime + tone.delay + tone.dur + 0.1);
    });

    if ('vibrate' in navigator) {
      navigator.vibrate([300, 150, 300]);
    }
  } catch (err) {
    console.warn('Could not play kitchen alert:', err);
  }
};


