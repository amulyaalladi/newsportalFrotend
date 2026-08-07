import { Provider } from "react-redux";
import { RouterProvider } from "react-router";
import { ToastContainer } from "react-toastify";
import { store } from "./redux/store";
import { router } from "./router/router";

const App = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </Provider>
  );
};

export default App;
