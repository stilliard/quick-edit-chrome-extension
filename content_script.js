
let targetElement;
document.addEventListener('contextmenu', (e) => {
    targetElement = e.target;
});

// html encode string
// - create a blank element, set it's text content as the html and then pull out the html of it which will have encoded the html
function htmlEncode(html) {
    var a = document.createElement('div');
    a.textContent = html;
    return a.innerHTML;
}

chrome.extension.onRequest.addListener((request, sender, sendResponse) => {

    // function to setup content editable area with change detection
    let setupContentEditable = (el) => {

        el.setAttribute('contenteditable', true);
        el.focus();

        let from = htmlEncode(el.innerHTML);

        el.addEventListener('blur', function self(e) {
            let to = htmlEncode(el.innerHTML);
            if (to != from) {
                console.log('changed');

                // send back the response
                sendResponse({
                    type: 'text',
                    selector: UTILS.cssPath(el),
                    from,
                    to
                });

                // remove the listener
                el.removeEventListener('blur', self);

                // & remove contenteditable
                el.setAttribute('contenteditable', false);
            }
        });
    }

    switch (request.action) {

        // removed entire page based editing, problem is knowing which element was then edited and recording it's changes
        // case 'entire-page':
        //     document.designMode = request.enabled ? 'On' : 'Off';
        //     break;

        // removed selected text editing, this was the origin of
        // case 'selected-text':
        //     let selection = window.getSelection();
        //     if (selection && selection.baseNode && selection.baseNode.parentNode) {
        //         setupContentEditable(selection.baseNode.parentNode);
        //     }
        //     break;

        case 'text-edit':
            if (targetElement) {
                setupContentEditable(targetElement);
            }
            break;

        case 'image-edit':
            if (targetElement) {
                let from = targetElement.src;
                let to = prompt('Enter new image URL:', from);
                if (to) {
                    targetElement.src = to;
                    sendResponse({
                        type: 'image',
                        selector: UTILS.cssPath(targetElement),
                        from,
                        to
                    });
                }
            }
            break;

        case 'link-edit':
            if (targetElement) {
                let from = targetElement.href;
                let to = prompt('Enter new link URL:', from);
                if (to) {
                    targetElement.href = to;
                    sendResponse({
                        type: 'link',
                        selector: UTILS.cssPath(targetElement),
                        from,
                        to
                    });
                }
            }
            break;

    }

    targetElement = false;
});
