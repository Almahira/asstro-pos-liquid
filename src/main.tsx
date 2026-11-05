import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  // React.StrictMode dimatikan untuk mencegah bentrok siklus render pada komponen <Html> 3D
  <App />,
);
