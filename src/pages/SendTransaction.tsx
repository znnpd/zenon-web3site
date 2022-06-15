/*global chrome*/
import React, {useEffect} from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import {ToggleButton, ToggleButtonGroup} from "@mui/material";
import Alert from '@mui/material/Alert';
import {extensionId as extensionIdFromConfig} from '../config/extension';

interface IMessageToContentScript {
    extensionId: string,
    direction: string,
    action: string
    data: object
}

enum Currency {
    ZNN = "ZNN", QSR = "QSR"
}

function SendTransaction() {

    const [toAddress, setToAddress] = React.useState<string>('mySuperAddress');
    const [amount, setAmount] = React.useState<string>('0.00001');
    const [currency, setCurrency] = React.useState<Currency>(Currency.ZNN);
    const [alert, setAlert] = React.useState<boolean | string>(false);

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
            if (event.data && event.data.extensionId === extensionId && event.data.direction === 'toWebsite' && event.data.action === 'SEND_TRANSACTION_RESPONSE') {
                console.log('FINAL RESPONSE RECEIVED: ', event.data);
                if (event.data.data.error) {
                    setAlert(event.data.data.error);
                }
            }            
        }, false);
    }, []);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        sendMessageToContentScript({extensionId: extensionId, action: 'SEND_TRANSACTION', direction: 'toExtension', data: {toAddress: toAddress, amount: amount, currency: currency}});
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
            <ToggleButtonGroup
                color="primary"
                value={currency}
                exclusive
                onChange={(event, newCurrency) => setCurrency(newCurrency)}
            >
                {Object.keys(Currency).map(currency =>
                    (<ToggleButton value={currency} key={currency}>{currency}</ToggleButton>)
                )}
            </ToggleButtonGroup>
            <TextField
                margin="normal"
                required
                fullWidth
                name="amount"
                label="amount"
                id="amount"
                value={amount}
                onChange={e => setAmount(e.target.value)}
            />
            <Button variant="outlined" type="submit">
                Send Transaction
            </Button>
            {alert? <Alert onClose={() => {setAlert(false)}} severity="error">{alert}</Alert> : <div/>}
        </Box>
    );
}

export default SendTransaction;
