/*global chrome*/
import React, {useEffect} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {extensionId} from '../config/extension';

interface IMessageToContentScript {
    extensionId: string,
    direction: string,
    action: string
    data: object
}

interface Props {
    walletIsConnected: boolean,
}

function AccountInfo() {

    // Wallet connection state management
    const [walletConnection, updateWalletConnection] = React.useState({isConnected: false});
    
    // Send message to content script which has been injected by the wallet extension
    function sendMessageToContentScript(data: IMessageToContentScript) {
        window.postMessage(data);
    }

    // Listener to receive messages from backgroundScript.js
    React.useEffect(() => {
        window.addEventListener("message", (event) => {
            if (event.data && event.data.extensionId === extensionId && event.data.direction === 'toWebsite') {
                console.log('FINAL RESPONSE RECEIVED: ', event.data);
                updateWalletConnection({isConnected: event.data.data.connectionApproved});
            }            
        }, false);
    }, []);

    return (
    
        <Box sx={{}}>
            <Button variant="outlined" onClick={() => {
                    if (walletConnection.isConnected) {
                        updateWalletConnection({isConnected: false});
                    } else {
                        sendMessageToContentScript({extensionId: extensionId, action: 'CONNECT_WALLET', direction: 'toExtension', data: {}});
                        updateWalletConnection({isConnected: true});
                    } 
                }}>
                {walletConnection.isConnected? 'Disconnect wallet' : 'Connect wallet'}
            </Button>
        </Box>
    );
}

export default AccountInfo;
