import ReactDOM from "react-dom/client";
import App from "./App";

import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import { CssBaseline } from "@mui/material";
import { Provider } from "react-redux";

import { theme } from "./theme/theme";
import { store } from "./store";

ReactDOM.createRoot(
  document.getElementById("root")!
).render(
  <Provider store={store}>
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </Provider>
);