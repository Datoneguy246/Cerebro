// Listen for messages from the extension
chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
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
const rawElements = document.querySelectorAll('a, input');
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
    if (elements[elementCount] != null)
    {
        elements[elementCount].classList.remove("ext_highlighted");
        elements[elementCount].classList.add("ext_interactable");
    }

    elementCount = Math.min(elementCount + 1, elements.length-1);
    elements[elementCount].classList.remove("ext_interactable");
    elements[elementCount].classList.add("ext_highlighted");
    elements[elementCount].scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "center"
    });
    console.log(elements[elementCount]);
}

function SelectPreviousElement() {
    if (elements[elementCount] != null)
    {
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
}

function InteractElement() {
    // Check for element type
    let toInteract = elements[elementCount];
    switch (toInteract.localName) {
        case "a":
            toInteract.click();
            break;
        default:
            console.warn("There's no specified behaviour for interacting with " + toInteract.localName + " elements!");
            break;
    }
}
alert("Injection");