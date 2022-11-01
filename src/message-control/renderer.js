const { channels } = require('../shared/constants');
const electron = window.require('electron');
const { ipcRenderer } = electron;

export default function send(sql) {
    return new Promise((resolve) => {
        ipcRenderer.once(channels.ASYNC_REPLY, (_, arg) => {
            resolve(arg);
        });
        ipcRenderer.send(channels.ASYNC_MESSAGE, sql);
    });
}
