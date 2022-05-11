import { useEffect, useState } from 'react';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { AvaxLogo, PolygonLogo, BSCLogo, ETHLogo, SolLogo } from './Logos';
import { useChain, useMoralis } from 'react-moralis';

const styles = {
  item: {
    display: 'flex',
    alignItems: 'center',
    height: '42px',
    fontWeight: '500',
    fontFamily: 'Roboto, sans-serif',
    fontSize: '14px',
    padding: '0 10px',
  },
  button: {
    border: '2px solid rgb(231, 234, 243)',
    borderRadius: '12px',
  },
};

const menuItems = [
  {
    index: 0,
    key: '0x1',
    value: 'Ethereum',
    icon: <ETHLogo />,
  },
  {
    index: 1,
    key: '0x539',
    value: 'Local Chain',
    icon: <ETHLogo />,
  },
  {
    index: 2,
    key: '0x4',
    value: 'Rinkeby Testnet',
    icon: <ETHLogo />,
  },
  {
    index: 3,
    key: '0x89',
    value: 'Polygon',
    icon: <PolygonLogo />,
  },
  {
    index: 4,
    key: '0x13881',
    value: 'Mumbai',
    icon: <PolygonLogo />,
  },
  {
    index: 5,
    key: '0xa86a',
    value: 'Avalanche',
    icon: <AvaxLogo />,
  },
  {
    index: 6,
    key: '0xa869',
    value: 'Fuji Testnet',
    icon: <AvaxLogo />,
  },
  {
    index: 7,
    key: '0x1507',
    value: 'Solana',
    icon: <SolLogo />,
  },
];

export default function Chains() {
  const { switchNetwork, chainId, chain } = useChain();
  const { isAuthenticated, authenticate } = useMoralis();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [selected, setSelected] = useState({});

  useEffect(() => {
    if (!chainId) return null;
    const newSelected = menuItems.find((item) => item.key === chainId);
    setSelected(newSelected);
    console.log('current chainId: ', chainId);
  }, [chainId]);

  const handleMenuClick = (option) => {
    if (isAuthenticated && typeof window !== 'undefined') {
      try {
        if (option.key === '0x1507') {
          authenticate({ type: 'sol' }).then(function (user) {
            console.log(user.get('solAddress'));
          });
        } else {
          switchNetwork(option.key);
          console.log(option.key);
        }
        handleClose();
      } catch (error) {
        console.log(error);
      }
    }
    handleClose();
  };

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <div>
        <List aria-label="Chain Network" sx={{ bgcolor: 'background.paper' }}>
          <ListItem
            button
            id="Chain Button"
            aria-haspopup="listbox"
            aria-controls="lock-menu"
            aria-label="when device is locked"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
          >
            <ListItemIcon sx={{ minWidth: 34 }}>
              {selected === undefined ? menuItems.ETHLogo : selected.icon}
            </ListItemIcon>
            <ListItemText
              primary={
                selected === undefined ? 'Unsupported Chain' : selected.value
              }
              secondary={menuItems[selected]}
            />
          </ListItem>
        </List>
        <Menu
          id="chain-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            'aria-labelledby': 'lock-button',
            role: 'listbox',
          }}
        >
          {menuItems.map((option, index) => (
            <MenuItem
              key={option.key}
              disabled={
                index === (selected === undefined ? 12 : selected.index)
              }
              selected={
                index === (selected === undefined ? 12 : selected.index)
              }
              onClick={() => handleMenuClick(option)}
            >
              <ListItemIcon>{option.icon}</ListItemIcon>
              {option.value}
            </MenuItem>
          ))}
        </Menu>
      </div>
    </>
  );
}
