import { useEffect } from 'react'
import { useMoralis } from 'react-moralis'

export default function Layout({ children }) {
  const { isWeb3Enabled, enableWeb3, isAuthenticated, isWeb3EnableLoading } =
    useMoralis()
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isAuthenticated && !isWeb3Enabled && !isWeb3EnableLoading)
        enableWeb3()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isWeb3Enabled])

  return (
    <>
      <main> {children} </main>
    </>
  )
}
