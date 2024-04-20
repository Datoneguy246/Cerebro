// Define SpeechRecognition
window.SpeechRecognition = window.SpeechRecognition ||
  window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.interimResults = true;
recognition.continuous = true; // Keep listening continuously

// Function to handle the 'result' event
recognition.addEventListener('result', e => {
  const transcript = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join('');

  // Output the transcript to the console
  console.log("TRANSCRIPT: " + transcript);
});

// Function to handle the 'error' event
recognition.addEventListener('error', e => {
  console.error('Speech Recognition Error:', e);
});

// Function to handle the 'end' event
recognition.addEventListener('end', () => {
  // Restart the recognition process if you want continuous listening
  recognition.start();
});

// Function to start speech recognition
function startRecognition() {
  console.log("Listening...");
  recognition.start();
}

// Function to stop speech recognition
function stopRecognition() {
  console.log("Not listening...");
  recognition.stop();
}
