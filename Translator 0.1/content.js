console.log('content world!');
// NOTE: In this version of translator max text size per request is limited to around 500 characters
// But in the latest version of translator is workaround for this limitation
const API_KEY = "",
    XHR = new XMLHttpRequest();
XHR.withCredentials = true;

var prev = '',
    prevRange = '';

// Handles mouse clicks on the page
window.addEventListener('mouseup', function () {
    let selection = window.getSelection();
    console.log(selection);
    // If the user has closed the selection, revert text to the initial state
    if (selection.isCollapsed === true && prev != '') {
        try {
            prevRange.deleteContents();
            prevRange.insertNode(document.createTextNode(prev));
        } catch (error) { };
        return
    }
    // when source language autodetection should not be used
    // apiRequest(selection.toString(),'sk','from=en');

    // used with language autodetection
    apiRequest(selection.toString(), 'sk');
});

// Makes the HTTP request using the selected text as the query string
function apiRequest(text, target='en', source = '') {
    // All of the available languages are listed in microsoft api page overview
    XHR.open("POST", "https://microsoft-translator-text.p.rapidapi.com/translate?to="
        + target.toString() +
        "&api-version=3.0&"
        + source +
        "profanityAction=NoAction&textType=plain");
    XHR.setRequestHeader("content-type", "application/json");
    XHR.setRequestHeader("x-rapidapi-key", API_KEY);
    XHR.setRequestHeader("x-rapidapi-host", "microsoft-translator-text.p.rapidapi.com");
    XHR.send(JSON.stringify([{
        "text": text
    }]));
}

// Handles the translation response
XHR.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
        const responseData = JSON.parse(this.responseText)[0];
        let translation = responseData.translations[0].text;
        if (window.getSelection().toString().length > 1) {
            prev = window.getSelection().toString();
            replaceSelectedText(translation);
        }
    }
});

// Replaces the selected text with the translation
function replaceSelectedText(replacementText) {
    var sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            prevRange = range;
            range.deleteContents();
            range.insertNode(document.createTextNode(replacementText));
        }
    }
}