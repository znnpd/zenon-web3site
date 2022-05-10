import * as React from 'react';
import Box from '@mui/material/Box';

interface Props {
    walletIsConnected: boolean,
}

function AccountInfo(props: Props) {

    return (
    
        <Box sx={{}}>
            {props.walletIsConnected === true ? <p>Wallet IS connected</p>: <p>Wallet NOT connected</p>      }
        </Box>
    );
}

export default AccountInfo;
