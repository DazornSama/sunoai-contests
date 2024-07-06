import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { CssVarsProvider, extendTheme } from "@mui/joy/styles";
import GlobalStyles from "@mui/joy/GlobalStyles";
import ContestView, { contestLoader } from "./views/contest";
import DataView from "./views/data";
import Shared404 from "./shared/404";
import "@fontsource/inter";
import DataContestView, { dataContestLoader } from "./views/data/contest";

const router = createBrowserRouter([
  {
    path: "contest/:id",
    element: <ContestView />,
    loader: contestLoader,
  },
  {
    path: "data",
    element: <DataView />,
  },
  {
    path: "data/contests",
    element: <DataContestView />,
    loader: dataContestLoader,
  },
  {
    path: "*",
    element: <Shared404 />,
  },
]);

const theme = extendTheme({
  colorSchemes: {
    dark: {
      palette: {
        primary: {
          50: "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
          solidColor: "var(--joy-palette-neutral-900)",
        },
      },
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CssVarsProvider theme={theme} defaultMode="dark">
      <GlobalStyles
        styles={{
          svg: {
            color: "var(--Icon-color)",
            margin: "var(--Icon-margin)",
            fontSize: "var(--Icon-fontSize, 24px)",
            width: "0.75em",
            height: "0.75em",
          },
        }}
      />
      <RouterProvider router={router} />
    </CssVarsProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
