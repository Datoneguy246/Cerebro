/**
 * Specific functions for controlling the webpage
 */

function ScrollVertically(delta) {
    chrome.runtime.sendMessage({ action: 'scroll_y', delta: delta });
}

function ScrollHorizontally(delta) {
    chrome.runtime.sendMessage({ action: 'scroll_x', delta: delta });
}

function Zoom(delta) {
    chrome.runtime.sendMessage({ action: 'zoom', delta: delta });
}

function SelectNext() {
    chrome.runtime.sendMessage({ action: "select_next" });
}

function SelectPrev() {
    chrome.runtime.sendMessage({ action: "select_prev" });
}

function Interact() {
    chrome.runtime.sendMessage({ action: "interact" });
}

// The rest of the script is for debugging and can be ignored
/*

document.getElementById("scroll_y_down").onclick = function() {
    ScrollVertically(document.getElementById("scroll_in").value);
}

document.getElementById("scroll_y_up").onclick = function() {
    ScrollVertically(-document.getElementById("scroll_in").value);
}

document.getElementById("scroll_left").onclick = function() {
    ScrollHorizontally(-document.getElementById("scroll_in").value);
}

document.getElementById("scroll_right").onclick = function() {
    ScrollHorizontally(document.getElementById("scroll_in").value);
}

document.getElementById("zoom_in").onclick = function() {
    Zoom(document.getElementById("zoom_input").value);
}

document.getElementById("zoom_out").onclick = function() {
    Zoom(-document.getElementById("zoom_input").value);
}

document.getElementById("select_next").onclick = function() {
    SelectNext();
}

document.getElementById("select_prev").onclick = function() {
    SelectPrev();
}

document.getElementById("interact").onclick = function() {
    Interact();
}
*/