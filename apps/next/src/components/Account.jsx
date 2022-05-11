import { useMoralis } from 'react-moralis';
import { useState, useMemo } from 'react';
import { getEllipsisTxt } from 'src/helpers/formatters';
import PropTypes from 'prop-types';
import Blockie from './Blockie';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import LinkIcon from '@mui/icons-material/Link';
import Address from './Address/Address';
import { getExplorer } from 'src/helpers/networks';

const styles = {
  account: {
    height: '42px',
    padding: '0 15px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 'fit-content',
    borderRadius: '12px',
    backgroundColor: 'rgb(244, 244, 244)',
    cursor: 'pointer',
  },
  text: {
    color: '#21BF96',
  },
};

function AccountDialog(props) {
  const { onClose, open, chainId, account, logout } = props;
  const handleClose = () => {
    onClose();
  };
  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle>Account</DialogTitle>
      <Card
        style={{
          marginTop: '10px',
          borderRadius: '1rem',
        }}
      >
        <Address
          address={account}
          avatar="left"
          size="6"
          copyable
          style={{ fontSize: '20px' }}
        />
        <div style={{ marginTop: '10px', padding: '0 10px' }}>
          <a
            href={`${getExplorer(chainId)}/address/${account}`}
            target="_blank"
            rel="noreferrer"
          >
            <LinkIcon />
            View on Explorer
          </a>
        </div>
      </Card>
      <Button
        title="Disconnect"
        style={{
          width: '100%',
          marginTop: '10px',
          borderRadius: '0.5rem',
          fontSize: '16px',
          fontWeight: '500',
        }}
        onClick={() => {
          logout();
          handleClose();
        }}
      >
        Disconnect Wallet
      </Button>
    </Dialog>
  );
}

AccountDialog.proptypes = {
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  chainId: PropTypes.string.isRequired,
  account: PropTypes.string.isRequired,
  logout: PropTypes.func.isRequired,
};

export default function Account() {
  const {
    authenticate,
    isAuthenticated,
    logout,
    account,
    chainId,
    isAuthenticating,
    isLoggingOut,
    isUnauthenticated,
  } = useMoralis();
  const [open, setOpen] = useState(false);

  const address = useMemo(() => account, [account]);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  if (isUnauthenticated && chainId === '0x1507')
    return (
      <div
        style={styles.account}
        onClick={() =>
          authenticate({ type: 'sol' }).then(function (user) {
            console.log(user.get('solAddress'));
          })
        }
      >
        <p style={styles.text}>Login</p>
      </div>
    );
  if (isUnauthenticated) {
    return (
      <div
        style={styles.account}
        onClick={() => authenticate({ signingMessage: 'Dynamic Sheets' })}
      >
        <p style={styles.text}>Login</p>
      </div>
    );
  }
  if (!isAuthenticated) {
    return (
      <div
        style={styles.account}
        onClick={() => authenticate({ signingMessage: 'Dynamic Sheets' })}
      >
        <p style={styles.text}>Login</p>
      </div>
    );
  }
  if (isLoggingOut) {
    return (
      <div style={styles.account}>
        <p style={styles.text}>Signing Out</p>
      </div>
    );
  }
  if (isAuthenticating) {
    return (
      <div style={styles.account}>
        <p style={styles.text}>Signing</p>
      </div>
    );
  }
  return (
    <>
      <div style={styles.account} onClick={handleClickOpen}>
        <p style={{ marginRight: '5px', ...styles.text }}>
          {getEllipsisTxt(account, 6)}
        </p>
        <Blockie currentWallet={address} scale={3} />
      </div>
      <AccountDialog
        onClose={handleClose}
        open={open}
        chainId={chainId}
        account={address}
        logout={logout}
      />
    </>
  );
}
