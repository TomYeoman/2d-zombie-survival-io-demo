import Chains from 'components/Chains';
import ERC20Balance from 'components/ERC20Balance';
import ERC20Transfers from 'components/ERC20Transfers';
import Account from 'components/Account';
import styles from 'styles/Home.module.css';
import dynamic from 'next/dynamic';
const MobileNav = dynamic(() => import('components/MobileNav'), {
  ssr: false,
});

const test = () => {
  return (
    <div className={styles.main}>
      <Chains />
      <Account />
      <h2>Deploy Contract</h2>
      <ERC20Balance />
      <ERC20Transfers />
      <MobileNav />
    </div>
  );
};

export default test;