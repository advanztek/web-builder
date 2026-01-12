import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import Router from './Routes';
import { ThemeProvider } from "./Context";
import { Provider } from "react-redux";
import {store} from "./Store";

function App() {
  return (
    <ThemeProvider>
      <Provider store={store}>
        <BrowserRouter>
          <Router />
        </BrowserRouter>
      </Provider>
    </ThemeProvider>
  )
}

export default App