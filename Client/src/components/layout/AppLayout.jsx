import { Outlet } from "react-router-dom";
import ToastViewport from "../common/ToastViewport";
import Footer from "./Footer";
import Navbar from "./Navbar";

const AppLayout = () => (
  <div className="app-shell">
    <Navbar />
    <ToastViewport />
    <main className="page-wrap">
      <Outlet />
    </main>
    <Footer />
  </div>
);

export default AppLayout;
