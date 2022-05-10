import './App.css';
import * as React from 'react';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import Button from '@mui/material/Button';
import AccountInfo from './pages/AccountInfo';
import {extensionId} from './config/extension';

interface IMessageToContentScript {
    extensionId: string,
    action: string
    data: object
}

function App() {
    
    // Tabs navigation
    const [tabsValue, setTabsValue] = React.useState("1"); // Set 'tabsValue' to active first tab
    const handleChange = (event: any, newValue: string) => {
        // Switch between tabs
        setTabsValue(newValue);
    };

    // Wallet connection state management
    const [walletConnection, updateWalletConnection] = React.useState({isConnected: false, buttonText : 'Connect Wallet'});

    // Send message to content script which has been injected by the wallet extension
    function sendMessageToContentScript(data: IMessageToContentScript) {
        if (!chrome.runtime) {
            console.error('MAKE SURE TO USE HTTPS, chrome.runtime API IS ONLY EXPOSED TO SECURE SITES!');
            return;
        }
        //window.postMessage(data);
        chrome.runtime.sendMessage(extensionId, data, function(response) {
            console.log('FINAL RESPONSE: ', response);
        });
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={1}/>
            <Grid item xs={10}>
                <TabContext value={tabsValue}>
                    <Tabs value={tabsValue} onChange={handleChange} centered>
                        <Tab label="Account Info" value="1"/>
                        <Tab label="Show transactions" value="2"/>
                        <Tab label="Send transactions" value="3" />
                    </Tabs>
                    <TabPanel value="1">
                        <AccountInfo walletIsConnected = {walletConnection.isConnected}/>
                    </TabPanel>
                    <TabPanel value="2">Item Two</TabPanel>
                    <TabPanel value="3">Item Three</TabPanel>
                </TabContext>
            </Grid>
            <Grid item xs={1}>
                <Button variant="outlined" onClick={() => {
                        if (walletConnection.isConnected) {
                            updateWalletConnection({isConnected: false, buttonText: 'Connect Wallet'});
                        } else {
                            sendMessageToContentScript({extensionId: extensionId, action: 'CONNECT_WALLET', data: {}});
                            updateWalletConnection({isConnected: true, buttonText: 'Disconnect Wallet'});
                        } 
                    }}>
                    {walletConnection.buttonText}
                </Button>
            </Grid>
        </Grid> 
        );
}

export default App;