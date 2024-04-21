function GetCurrentTabId(callback) {
    chrome.tabs.query({
        active: true,
        currentWindow: true
    }, function (tabs) {
        // If there are active tabs, call handleTabUpdate with the tab information
        //console.log("Querying to get current tab");
        //console.log(tabs);
        if (tabs && tabs.length > 0) {
            let foundTabId = tabs[0].id;
            //console.log("Found tab id: " + foundTabId);
            callback(foundTabId);
        }
    });
}

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    //console.log("Recevied message: " + message.action);
    switch (message.action) {
        case "scroll_y":
            GetCurrentTabId(function (foundTabId) {
                chrome.tabs.sendMessage(foundTabId, {
                    action: 'scroll_y',
                    delta: message.delta
                });
            });
            break;
        case "scroll_x":
            GetCurrentTabId(function (foundTabId) {
                chrome.tabs.sendMessage(foundTabId, {
                    action: 'scroll_x',
                    delta: message.delta
                });
            });
            break;
        case "zoom":
            GetCurrentTabId(function (foundTabId) {
                chrome.tabs.sendMessage(foundTabId, {
                    action: 'zoom',
                    delta: message.delta
                });
            });
            break;
        case "select_next":
            GetCurrentTabId(function (foundTabId) {
                chrome.tabs.sendMessage(foundTabId, {
                    action: 'select_next'
                });
            });
            break;
        case "select_prev":
            GetCurrentTabId(function (foundTabId) {
                chrome.tabs.sendMessage(foundTabId, {
                    action: 'select_prev'
                });
            });
            break;
        case "interact":
            GetCurrentTabId(function (foundTabId) {
                chrome.tabs.sendMessage(foundTabId, {
                    action: 'interact'
                });
            });
            break;
    }
});

chrome.runtime.onInstalled.addListener(function () {
    console.log('Extension installed!');

    // Query all tabs and refresh them to allow for injection
    chrome.tabs.query({}, function (tabs) {
        tabs.forEach(function (tab) {
            chrome.tabs.reload(tab.id);
        });
    });
});


chrome.action.onClicked.addListener((tab) => {
    chrome.windows.create({
        url: 'index.html', // Specify the URL of your extension's page
        type: 'popup', // Choose the window type ('popup' or 'normal')
        width: 500, // Specify the width of the window
        height: 425 // Specify the height of the window
    });
});