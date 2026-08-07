import { createBrowserRouter, RouterProvider } from "react-router";
import { ToastContainer } from "react-toastify";
//import { router } from "../src/router/router";
import { Provider } from "react-redux";
import store from "./redux/store";
import authLoader from './loaders/authLoader';
import { adminLoader, editorLoader, userLoader } from './loaders/roleLoader';
import EditorDashboard from "./pages/Editor/EditorDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Home from "./pages/Home/Home";
import Dashboard from "./components/home/Dashboard";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    loader: authLoader,
    hydrateFallbackElement: <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/login",
    element: <Login />
  },
   {
    path: "/dashboard",
    element: <Dashboard />,
    loader: userLoader,
    hydrateFallbackElement: <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
    loader: adminLoader,
    hydrateFallbackElement: <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  },
  {
    path: "/editor/dashboard",
    element: <EditorDashboard />,
    loader: EditorDashboard,
    hydrateFallbackElement: <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  }
])

const App = () => {
  return (
    <>
     <Provider store={store}>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
      </Provider>
    </>
  );
};

export default App;
