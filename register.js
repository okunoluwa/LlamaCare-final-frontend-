document.getElementById("registerForm").addEventListener("submit", function(e){
    // In Registration.html, update the form submission script section
document.getElementById('registerForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get the patient name from the form
    const patientName = document.getElementById('name').value.trim();
    
    // Simple validation
    const password = document.getElementById('password').value;
    if (password.length < 6) {
        alert('Password should be at least 6 characters long.');
        return;
    }
    
    // Save patient data to localStorage database
    const patientData = {
        name: patientName,
        email: document.getElementById('email').value,
        location: document.getElementById('location').value,
        gender: document.getElementById('gender').value,
        registrationDate: new Date().toISOString(),
        id: 'LLC-' + Date.now() // Generate a unique ID
    };
    
    // Save to localStorage
    localStorage.setItem('llamacare_current_patient', patientName);
    localStorage.setItem('llamacare_patient_data', JSON.stringify(patientData));
    
    // Create a database entry in a patient list
    let patientList = JSON.parse(localStorage.getItem('llamacare_patient_list') || '[]');
    patientList.push(patientData);
    localStorage.setItem('llamacare_patient_list', JSON.stringify(patientList));
    
    // Show success message
    alert(`Account registration successful, ${patientName}! Your information has been saved.`);
    console.log('Patient registered:', patientData);
    
    // In a real app, this would redirect to the next page
    // For demo, you can redirect to the homepage
    // window.location.href = 'index.html';
    
    this.reset();
});
    
    e.preventDefault();

    let name = document.getElementById("name").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let location = document.getElementById("location").value;
    let gender = document.getElementById("gender").value;
    let profileFile = document.getElementById("profile").files[0];

    // Check existing user
    if(localStorage.getItem(email)){
        alert("User already exists!");
        return;
    }

    // Convert image to Base64
    const reader = new FileReader();

    reader.onload = function(){
        const profileBase64 = reader.result;

        const user = {
            name,
            email,
            password,
            location,
            gender,
            profile: profileBase64
        };

        localStorage.setItem(email, JSON.stringify(user));

        alert("Registration Successful!");
        window.location.href = "login.html";
    };

    reader.readAsDataURL(profileFile);
});

const body = document.body;
const themeBtn = document.getElementById("themeToggle");

// Load saved theme
document.getElementById('themeToggle').addEventListener('click', function() {
        const body = document.body;
        const currentTheme = this.textContent;
        
        // Toggle between moon and sun
        if (currentTheme === '🌙') {
            this.textContent = '☀️';
            // For a full theme toggle, you would change CSS variables here
            // This is a simplified version that just changes body background
            body.style.backgroundColor = '#1a1a2e';
            body.style.color = '#e6e6e6';
        } else {
            this.textContent = '🌙';
            body.style.backgroundColor = '';
            body.style.color = '';
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
