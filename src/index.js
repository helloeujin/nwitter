import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App";
import "./styles.css";
// import firebase from "./fbase";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// For saving twice for dev
// <React.StrictMode>
//   <App />
// </React.StrictMode>
