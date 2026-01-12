import { useLocation } from 'react-router-dom'
import Header from '../../Components/Header'
import Footer from '../../Components/Footer'

function PublicLayout({ children }) {
  const location = useLocation();

  const noLayoutRoutes = ["/login", "/register"];

  const hideLayout = noLayoutRoutes.includes(location.pathname);
  return (
    <>
     {!hideLayout && <Header />}
      {children}
      {!hideLayout && <Footer />}
    </>
  )
}

export default PublicLayout
