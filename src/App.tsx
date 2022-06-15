import './App.css';
import * as React from 'react';
import Grid from '@mui/material/Grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import WalletConnection from './pages/WalletConnection';
import SendTransaction from './pages/SendTransaction'

function App() {
    
    // Tabs navigation
    const [tabsValue, setTabsValue] = React.useState("1"); // Set 'tabsValue' to active first tab
    const handleChange = (event: any, newValue: string) => {
        // Switch between tabs
        setTabsValue(newValue);
    };

    return (
        <Grid container spacing={2}>
            <Grid item xs={2}/>
            <Grid item xs={8}>
                <TabContext value={tabsValue}>
                    <Tabs value={tabsValue} onChange={handleChange} centered>
                        <Tab label="Wallet Connection" value="1"/>
                        <Tab label="Send transactions" value="2" />
                        <Tab label="Show transactions" value="3"/>
                    </Tabs>
                    <TabPanel value="1">
                        <WalletConnection/>
                    </TabPanel>
                    <TabPanel value="2">
                        <SendTransaction/>
                    </TabPanel>
                    <TabPanel value="3">
                        under construction
                    </TabPanel>
                </TabContext>
            </Grid>
            <Grid item xs={2}/>
        </Grid> 
        );
}

export default App;