// THEME TOGGLE
const themeToggle = document.getElementById("themeToggle");

if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeToggle.textContent = "☀️";
}

themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
        themeToggle.textContent = "☀️";
    } else {
        localStorage.setItem("theme", "light");
        themeToggle.textContent = "🌙";
    }
});


// EDIT BUTTON
document.getElementById("editBtn").addEventListener("click", () => {
    alert("Editing functionality will be added later.");
});


// VOICE ASSISTANT START/STOP
const voiceBtn = document.getElementById("voiceBtn");
let isSpeaking = false;
let currentSpeech = null;

voiceBtn.addEventListener("click", () => {
    if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        voiceBtn.style.background = "#0a84ff";
        return;
    }

    let msg = new SpeechSynthesisUtterance(
        "This is your patient profile page. You can review your medical information."
    );

    currentSpeech = msg;
    isSpeaking = true;
    voiceBtn.style.background = "#ff4444";

    window.speechSynthesis.speak(msg);

    msg.onend = () => {
        isSpeaking = false;
        voiceBtn.style.background = "#0a84ff";
    };
});
