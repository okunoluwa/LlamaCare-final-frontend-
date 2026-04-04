document.getElementById("forgotForm").addEventListener("submit", function(e) {
    e.preventDefault();

    let email = document.getElementById("email").value.trim();

    // Check if user exists
    let storedUser = localStorage.getItem(email);

    if (!storedUser) {
        alert("Email not found! Please enter a registered email.");
        return;
    }

    storedUser = JSON.parse(storedUser);

    // Ask user for new password
    let newPassword = prompt("Enter your new password:");

    if (!newPassword || newPassword.trim() === "") {
        alert("Password reset cancelled!");
        return;
    }

    // Update password
    storedUser.password = newPassword.trim();

    // Save updated user
    localStorage.setItem(email, JSON.stringify(storedUser));

    alert("Password updated successfully!");

    // Redirect to login
    window.location.href = "login.html";
});

const body = document.body;
const themeBtn = document.getElementById("themeToggle");

// Load saved theme
if (localStorage.getItem("hospitalTheme") === "dark") {
    body.classList.add("dark");
    themeBtn.textContent = "☀️ Light Mode";
}

// Toggle theme
themeBtn.addEventListener("click", () => {
    body.classList.toggle("dark");

    if (body.classList.contains("dark")) {
        themeBtn.textContent = "☀️ Light Mode";
        localStorage.setItem("hospitalTheme", "dark");
    } else {
        themeBtn.textContent = "🌙 Dark Mode";
        localStorage.setItem("hospitalTheme", "light");
    }
});

// Speech Synthesis
function speak(text) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
}

// Speech Recognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recorder;

if (SpeechRecognition) {
    recorder = new SpeechRecognition();
    recorder.lang = "en-US";
    recorder.interimResults = false;
    recorder.maxAlternatives = 1;
}

document.getElementById("voiceAssist").addEventListener("click", () => {
    speak("Voice assistance activated. Tap any field and speak.");
});

// Auto-listen when user focuses input
document.querySelectorAll("input, select").forEach(field => {
    field.addEventListener("focus", () => {
        speak("Please " + field.placeholder);

        if (recorder) {
            recorder.start();

            recorder.onresult = (event) => {
                field.value = event.results[0][0].transcript;
                speak(field.placeholder + " received.");
            };
        }
    });
});
