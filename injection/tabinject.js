// Listen for messages from the extension
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    console.log(message);
    switch (message.action) {
        case 'scroll_y':
            ScrollVertically(message.delta);
            break;
        case "scroll_x":
            ScrollHorizontally(message.delta);
            break;
        case "zoom":
            Zoom(message.delta);
            break;
        case "select_next":
            SelectNextElement();
            break;
        case "select_prev":
            SelectPreviousElement();
            break;
        case "interact":
            InteractElement();
            break;
    }
});

const SCROLL_FACTOR = 5;

function ScrollVertically(delta) {
    window.scrollBy({
        top: delta * SCROLL_FACTOR,
        left: 0,
        behavior: "smooth",
    });
}

function ScrollHorizontally(delta) {
    window.scrollBy({
        top: 0,
        left: delta * SCROLL_FACTOR,
        behavior: "smooth"
    });
}

const ZOOM_FACTOR = 0.5;
let currentZoom = 1;

function Zoom(delta) {
    var zoomIncrease = delta * ZOOM_FACTOR;
    currentZoom += zoomIncrease;

    // Clamp between valid zoom values
    currentZoom = Math.min(Math.max(currentZoom, ZOOM_FACTOR), 6);

    // Apply zoom
    document.body.style.zoom = String(currentZoom);
    console.log(document.body.style.zoom);
    this.blur();
}

// Get reference to all interactable components on this webpage
const rawElements = document.querySelectorAll('a, input, button');
const elements = [];
rawElements.forEach((element) => {
    if (element.style.display !== "none" && element.getAttribute("type") !== "hidden") {
        element.classList.add("ext_interactable");
        elements.push(element);
    }
});
console.log(elements);

let elementCount = 0;

function SelectNextElement() {
    if (elements[elementCount] != null) {
        elements[elementCount].classList.remove("ext_highlighted");
        elements[elementCount].classList.add("ext_interactable");
    }

    elementCount = Math.min(elementCount + 1, elements.length - 1);
    elements[elementCount].classList.remove("ext_interactable");
    elements[elementCount].classList.add("ext_highlighted");
    elements[elementCount].scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center"
    });
    console.log(elements[elementCount]);

    // Check if this is an input field
    stopRecognition();
    console.log(elements[elementCount].localName);
    if (elements[elementCount].localName.includes("input")) {
        console.log("At input... listening");
        startRecognition((transcript) => {
            console.log("TRANSCRIPT: " + transcript);
            elements[elementCount].value = transcript;
        });
    } else {
        console.log("Not at input... listening for keyword");
        startRecognition((transcript) => {
            let words = transcript.split(" ");
            console.log(words);
            let lastWord = words[words.length - 1].toLowerCase();
            if (lastWord.includes("enter"))
                InteractElement();
            else if (lastWord.includes("forward")) {
                window.history.forward();
            } else if (lastWord.includes("back")) {
                window.history.back();
            }
        });
    }
}

function SelectPreviousElement() {
    if (elements[elementCount] != null) {
        elements[elementCount].classList.remove("ext_highlighted");
        elements[elementCount].classList.add("ext_interactable");
    }

    elementCount = Math.max(0, elementCount - 1);
    elements[elementCount].classList.remove("ext_interactable");
    elements[elementCount].classList.add("ext_highlighted");
    elements[elementCount].scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center"
    });

    // Check if this is an input field
    stopRecognition();
    console.log(elements[elementCount].localName);
    if (elements[elementCount].localName.includes("input")) {
        console.log("At input... listening");
        startRecognition((transcript) => {
            console.log("TRANSCRIPT: " + transcript);
            elements[elementCount].value = transcript;
        });
    } else {
        console.log("Not at input... listening for keyword");
        startRecognition((transcript) => {
            let words = transcript.split(" ");
            console.log(words);
            let lastWord = words[words.length - 1].toLowerCase();
            if (lastWord.includes("enter"))
                InteractElement();
            else if (lastWord.includes("forward")) {
                window.history.forward();
            } else if (lastWord.includes("back")) {
                window.history.back();
            }
        });
    }
}

function InteractElement() {
    // Check for element type
    let toInteract = elements[elementCount];
    switch (toInteract.localName) {
        case "a":
            toInteract.click();
            break;
        case "button":
            toInteract.click();
            break;
        default:
            console.warn("There's no specified behaviour for interacting with " + toInteract.localName + " elements!");
            break;
    }
}

stopRecognition();