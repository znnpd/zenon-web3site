/*global chrome*/
import React, {useEffect} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import {extensionId as extensionIdFromConfig} from '../config/extension';

interface IMessageToContentScript {
    extensionId: string,
    direction: string,
    action: string
    data: object
}

interface Props {
    walletIsConnected: boolean,
}

function WalletConnection() {

    let extensionId: string = extensionIdFromConfig;
    if (process.env.NODE_ENV === 'development' && process.env.REACT_APP_EXTENSION_ID) {
        extensionId = process.env.REACT_APP_EXTENSION_ID;
    }
    // Wallet connection state management
    const [walletConnection, updateWalletConnection] = React.useState<{isConnected: boolean}>({isConnected: false});
    const [extensionData, updateExtensionData] = React.useState<{[key: string]: any}>({});
    
    // Send message to content script which has been injected by the wallet extension
    function sendMessageToContentScript(data: IMessageToContentScript) {
        window.postMessage(data);
    }

    // Listener to receive messages from backgroundScript.js
    React.useEffect(() => {
        window.addEventListener("message", (event) => {
            if (event.data && event.data.extensionId === extensionId && event.data.direction === 'toWebsite') {
                console.log('FINAL RESPONSE RECEIVED: ', event.data);
                updateWalletConnection({isConnected: event.data.data.isSiteTrusted});
                updateExtensionData(event.data.data);
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
                    } 
                }}>
                {walletConnection.isConnected? 'Disconnect wallet' : 'Connect wallet'}
            </Button>
            <Box sx={{mt: 5}}>
                {'Is wallet connected to extension: ' + walletConnection.isConnected}
            </Box>
            <Box sx={{mt: 5}}>
                {walletConnection.isConnected? 'Connection data from extension: ' + JSON.stringify(extensionData) : ''}
            </Box>
        </Box>
    );
}

export default WalletConnection;
