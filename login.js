document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault();

    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();

    // Fetch user
    let savedUser = localStorage.getItem(email);

    if (!savedUser) {
        alert("User not found! Please register first.");
        return;
    }

    savedUser = JSON.parse(savedUser);

    // Check password
    if (savedUser.password === password) {

        // Save current logged-in user
        localStorage.setItem("currentUser", JSON.stringify(savedUser));

        alert("Login successful!");
        window.location.href = "WaitMate.html"; // Next step
    } 
    else {
        alert("Incorrect password. Try again!");
    }
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
        speak("Please enter" + field.placeholder);

        if (recorder) {
            recorder.start();

            recorder.onresult = (event) => {
                field.value = event.results[0][0].transcript;
                speak(field.placeholder + " received.");
            };
        }
    });
});
