import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import "./scss/index.scss";
import { ToastContainer } from "react-toastify";
import RouteProvider from "./routes";

const App = () => {
  return (
    <div className="App">
      <RouteProvider />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </div>
  );
};

export default App;
