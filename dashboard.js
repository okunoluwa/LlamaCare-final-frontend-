// THEME TOGGLE
const toggle = document.getElementById("themeToggle");
const body = document.body;

if (localStorage.getItem("theme") === "dark") {
    body.classList.add("dark");
    toggle.textContent = "☀️";
}

toggle.addEventListener("click", () => {
    body.classList.toggle("dark");

    if (body.classList.contains("dark")) {
        toggle.textContent = "☀️";
        localStorage.setItem("theme", "dark");
    } else {
        toggle.textContent = "🌙";
        localStorage.setItem("theme", "light");
    }
});

// VOICE ASSISTANT WITH START / STOP
const voiceBtn = document.getElementById("voiceBtn");
let isSpeaking = false;  // track if speech is active
let currentSpeech = null;

voiceBtn.addEventListener("click", () => {

    // If already speaking → STOP immediately
    if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        voiceBtn.style.background = "#0a84ff"; // return to normal color
        return;
    }

    // If NOT speaking → START talking
    let msg = new SpeechSynthesisUtterance(
        "Welcome to your hospital dashboard. How can I assist you?"
    );

    currentSpeech = msg;
    isSpeaking = true;
    voiceBtn.style.background = "#ff4444";  // red while active

    window.speechSynthesis.speak(msg);

    // Reset once talking ends
    msg.onend = () => {
        isSpeaking = false;
        voiceBtn.style.background = "#0a84ff";
    };
});

