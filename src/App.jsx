import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./page/Home";
import AdminPage from "./page/AdminPage";
import MenuAdmin from "./page/MenuAdmin";
import Inventory from "./page/Inventory";
import AddMenu from "./page/AddMenu";
import UpdateMenu from "./page/UpdateMenu";
import MinumanPage from "./components/MinumanPage";
import MakananPage from "./components/MakananPage";
import DessertPage from "./components/DessertPage";
import Activity from "./page/ActivityPage";
import ReportPage from "./page/ReportPage";
import PrivatRoute from "./components/PrivatRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/AdminLogin" element={<AdminPage />} />
        <Route path="/minuman" element={<MinumanPage />} />
        <Route path="/makanan" element={<MakananPage />} />
        <Route path="/dessert" element={<DessertPage />} />
        <Route element={<PrivatRoute />}>
          <Route path="/activity" element={<Activity />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/update-post/:postId" element={<UpdateMenu />} />
          <Route path="/menuAdmin" element={<MenuAdmin />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/tambah-menu" element={<AddMenu />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
