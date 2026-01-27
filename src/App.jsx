import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import { CssBaseline } from "@mui/material";
import './index.css'
import Router from './Routes';
import { ThemeProvider } from "./Context";
import { Provider } from "react-redux";
import { store } from "./Store";
import { AuthProvider } from "./Context/AuthContext";

function App() {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <BrowserRouter> 
          <AuthProvider>  
            <CssBaseline />
            <ToastContainer />
            <Router />
          </AuthProvider>
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  )
}

export default App