import React, { useState } from 'react';

import sendAsync from './message-control/renderer';

import './App.css';

import { channels } from './shared/constants.js';

const { ipcRenderer } = window.require('electron');


function App() {
    const [message, setMessage] = useState('SELECT * FROM repositories');
    const [response, setResponse] = useState();

    function send(sql) {
        sendAsync(sql).then((result) => setResponse(result));
    }

    const getData = () => {
        ipcRenderer.send(channels.GET_DATA);
    };

    const resetDB = () => {
        ipcRenderer.send(channels.RESET_DB);
    }

    const fillMap = () => {
        ipcRenderer.send(channels.FILL_MAP);
    }

    return (
        <div className="App">
            <header className="App-header">
                <h1>
                    Standalone application with Electron, React, and
                    SQLite stack.
                </h1>
            </header>
            <article>
                <p>
                    Say <i>ping</i> to the main process.
                </p>
                <input
                    type="text"
                    value={message}
                    onChange={({ target: { value } }) => setMessage(value)}
                />
                <button type="button" onClick={() => send(message)}>
                    Send
                </button>
                <button type="button" onClick={getData}>
                    Populate
                </button>
                <button type="button" onClick={resetDB}>
                    Reset DB
                </button>
                <button type="button" onClick={fillMap}>
                    Fill Map
                </button>
                <br />
                <p>Main process responses:</p>
                <br />
                <pre>
                    {(response && response.map(({ event_name }) => event_name)) ||
                        'No query results yet!'}
                </pre>
                <p>
                    
                </p>
            </article>
        </div>



        
    );
}

export default App;

