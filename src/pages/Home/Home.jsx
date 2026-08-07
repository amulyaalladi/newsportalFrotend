import {Link} from "react-router"
import { toast } from "react-toastify";
import NavBar from "../../components/common/NavBar";
import Hero from "../../components/home/Hero";
import BreakingNews from "../../components/home/BreakingNews";
import TrendingNews from "../../components/home/TrendingNews";
import Footer from "../../components/common/Footer";
import CategoryNews from "../../components/home/CategoryNews";
import Dashboard from "../../components/home/Dashboard";

const Home = () => {
  const handleToast = () => {
    toast.success("This is a success message!", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  return (
    <div>
      <NavBar />
      <Hero />
     
      <Dashboard/>
      <Footer />
    </div>
  );
};

export default Home;
