// Define SpeechRecognition
window.SpeechRecognition = window.SpeechRecognition ||
  window.webkitSpeechRecognition;

let listening = false;
const recognition = new SpeechRecognition();
recognition.interimResults = true;
let currentCallback = null;

// Function to handle the 'result' event
recognition.addEventListener('result', e => {
  if (!listening)
    return;

  const transcript = Array.from(e.results)
    .map(result => result[0])
    .map(result => result.transcript)
    .join('');

  currentCallback(transcript);

});

recognition.addEventListener('end', () => {
  // Restart the recognition process for continuous listening
  if (listening)
    recognition.start();
});


// Function to handle the 'error' event
recognition.addEventListener('error', e => {
  console.error('Speech Recognition Error:', e);
});

// Function to start speech recognition
function startRecognition(callback) {
  listening = true;
  currentCallback = callback;
  console.log("Listening...");
  recognition.start();
}

// Function to stop speech recognition
function stopRecognition() {
  currentCallback = null;
  listening = false;
  console.log("Not listening...");
  recognition.stop();
}