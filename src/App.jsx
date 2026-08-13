// src/App.jsx
import { RouterProvider } from "react-router";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import store from "./redux/store";
import router from "./router/router"; // 👈 Import centralized router [source: 9]

const App = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
    </Provider>
  );
};

export default App;