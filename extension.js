

let fireEventInActiveTab = (data, callback) => {
    chrome.tabs.getSelected(null, tab => {
        chrome.tabs.sendRequest(tab.id, data, callback);
    });
};

let historyLog = [];
let addToHistory = (data) => {
    console.log('logging to history');
    historyLog.push(data);
};
chrome.extension.onRequest.addListener((request, sender, sendResponse) => {
    if (request.action == 'get-history') {
        sendResponse(historyLog);
    }
    if (request.action == 'clear-history') {
        historyLog = [];
        sendResponse();
    }
});

// hook into right click / contextmenu for text
chrome.contextMenus.create({
    title: 'Quick edit this text',
    contexts: ['page', 'selection', 'link'],
    onclick: e => {
        console.log('Text edit!', e);
        fireEventInActiveTab({
            action: 'text-edit',
        }, data => {
            if (data) {
                data.url = e.pageUrl;
            }
            addToHistory(data);
        });
    }
});

// & for images
chrome.contextMenus.create({
    title: 'Quick edit this image',
    contexts: ['image'],
    onclick: e => {
        console.log('Image edit!');
        fireEventInActiveTab({
            action: 'image-edit',
        }, data => {
            if (data) {
                data.url = e.pageUrl;
            }
            addToHistory(data);
        });
    }
});

// & for links
chrome.contextMenus.create({
    title: 'Quick edit this link',
    contexts: ['link'],
    onclick: e => {
        console.log('Link edit!');
        fireEventInActiveTab({
            action: 'link-edit',
        }, data => {
            if (data) {
                data.url = e.pageUrl;
            }
            addToHistory(data);
        });
    }
});
