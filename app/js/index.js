var closeBtn = document.querySelector('.close-window');
const { ipcRenderer } = require('electron');
if(closeBtn){
    closeBtn.addEventListener('click', function(e){
        e.preventDefault();
        ipcRenderer.send('close-main-window');
    })
}

ipcRenderer.on('close-window', function(event, args){
    // var event = new MouseEvent('click');
    // var obj = document.querySelector(args);
    // closeBtn.dispatchEvent(event);
    ipcRenderer.send('close-main-window');
});
function removeDragEnterClass(e){
    console.log("Remove drag n Drop >>", e);
    e.target.classList.remove('drag-enter');
}