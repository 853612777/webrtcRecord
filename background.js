blobs = [];

chrome.runtime.onConnect.addListener(function (port) {

    let tabId = port.sender.tab.id;

    port.onMessage.addListener(function (message) {
        //console.log(message);
        //if (message[0] !== 'webrtcRecord') return;

        //download and make a new copy of the blob
        if (message[0] === 'recording'){
            var xhr = new XMLHttpRequest();
            xhr.open('GET', message[2], true);
            xhr.responseType = 'blob';
            xhr.onload = function(e) {
                if (this.status === 200) {
                    let newBlob = this.response;
                    console.log(newBlob);
                    download2(newBlob);
                }
            };
            xhr.send();           /// play(message[2]);
        }
        else{
            console.log("message:", new Date(), message);
        }

        function checkTab(){
            if (chrome.runtime.lastError){
                console.log(chrome.runtime.lastError.message);
            }
            else{
                chrome.pageAction.show(tabId);
                chrome.pageAction.setTitle({ tabId: tabId, title: 'Recording this tab'});
            }
        }

        tabId = port.sender.tab.id;
        chrome.tabs.get(port.sender.tab.id, checkTab)

    });
});

/*chrome.runtime.onDisconnect(function(message){
    console.log("Extension port disconnected " + message);
});*/

function play(blob){
    console.log("playing");

    let recordedAudio = document.createElement('audio');
    //recordedAudio.src = null;         //This was in the record sample
    //recordedAudio.srcObject = null;   //This was in the record sample
    recordedAudio.src = window.URL.createObjectURL(blob);
    recordedAudio.controls = true;
    recordedAudio.play();
}

/*
function download(blobUrl) {
    console.log("downloading");

    let a = document.createElement('a');
    document.body.appendChild(a);
    a.style = 'display: none';
    a.href = blobUrl;
    a.download = 'test.webm';
    a.click();
    window.URL.revokeObjectURL(blobUrl);

}
*/

function download(blob) {
    console.log("downloading");
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'test.webm';
    a.click();
    window.URL.revokeObjectURL(blob);

}

chrome.runtime.onMessage.addListener(
     function(request, sender, sendResponse) {
         console.log("Reached Background.js");
         console.log('onMessage', request, sender, sendResponse)
    });