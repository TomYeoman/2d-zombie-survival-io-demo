import Skeleton from '@mui/material/Skeleton';
import Blockies from 'react-blockies';
import { useMoralis } from 'react-moralis';

/**
 * Shows a blockie image for the provided wallet address
 * @param {*} props
 * @returns <Blockies> JSX Elemenet
 */

function Blockie(props) {
  const { isUserUpdating, account, isInitialized, isWeb3EnableLoading } =
    useMoralis();
  if (!isInitialized && isUserUpdating && isWeb3EnableLoading && !props.address)
    return <Skeleton variant="rectangular" width={40} height={20} />;

  return (
    isInitialized && (
      <Blockies
        seed={props.currentWallet ? account?.toLowerCase() : props.address}
        className="identicon"
        {...props}
      />
    )
  );
}

export default Blockie;
