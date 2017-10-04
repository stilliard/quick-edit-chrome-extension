
// listen for history updates and list them out
chrome.extension.sendRequest({ action: 'get-history' }, data => {
    drawHistory(data);
});

document.getElementById('clear').addEventListener('click', e => {
    drawHistory({});
    chrome.extension.sendRequest({ action: 'clear-history' });
}, false);

function drawHistory(data) {
    html = '';
    if (data && data.length) {

        // remove any null values
        data = data.filter(entry => !! entry);
        if (data.length) {

            data.forEach(entry => {
                html += `
                    <li>
                        <a href="${entry.url}">${entry.url}</a>
                        <strong>${entry.type} change:</strong>
                        <br>
                        <em>${entry.selector}</em>
                        <br>
                        From: ${entry.from}
                        <br>
                        To: ${entry.to}
                    </li>
                `;
            });

        }
    }
    if (html == '') {
        html = '<li><em>No edits made yet.</em></li>';
    }
    document.querySelector('.history').innerHTML = html;
}
