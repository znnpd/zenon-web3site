/*global chrome*/
import React, {useEffect} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import {extensionId as extensionIdFromConfig} from '../config/extension';

interface IMessageToContentScript {
    extensionId: string,
    direction: string,
    action: string
    data: object
}

function SendTransaction() {

    const [toAddress, setToAddress] = React.useState<string>('mySuperAddress');

    let extensionId: string = extensionIdFromConfig;
    if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_EXTENSION_ID) {
        extensionId = process.env.REACT_APP_EXTENSION_ID;
    }
    
    // Send message to content script which has been injected by the wallet extension
    function sendMessageToContentScript(data: IMessageToContentScript) {
        window.postMessage(data);
    }

    // Listener to receive messages from backgroundScript.js
    React.useEffect(() => {
        window.addEventListener("message", (event) => {
            if (event.data && event.data.extensionId === extensionId && event.data.direction === 'toWebsite') {
                console.log('FINAL RESPONSE RECEIVED: ', event.data);
            }            
        }, false);
    }, []);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendMessageToContentScript({extensionId: extensionId, action: 'SEND_TRANSACTION', direction: 'toExtension', data: {toAddress: toAddress}});
    };

    return (
    
        <Box component="form" onSubmit={handleSubmit} sx={{}}>
            <TextField
                margin="normal"
                required
                fullWidth
                name="toAddress"
                label="to address"
                id="toAddress"
                value={toAddress}
                onChange={e => setToAddress(e.target.value)}
            />
            <Button variant="outlined" type="submit">
                Send Transaction
            </Button>
        </Box>
    );
}

export default SendTransaction;
