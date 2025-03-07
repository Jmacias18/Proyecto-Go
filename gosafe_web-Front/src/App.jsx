import { Routes, Route, Navigate } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Sidebar from "./components/Sidebar";
import AdminConductor from "./pages/AdminConductor";
import AdminPasajero from "./pages/AdminPasajero";
import Vehiculos from "./pages/Vehiculos";
import ViajesPasajero from "./pages/ViajesPasajero";
import HistorialConductor from "./pages/HistorialConductor";  // Importa el nuevo componente
import { useState } from "react";

function App() {
  const [userInfo, setUserInfo] = useState(null);

  return (
    <Routes>
      {/* Página principal */}
      <Route path="/" element={<Homepage />} />

      {/* Página de Login */}
      <Route path="/login" element={<Login setUserInfo={setUserInfo} />} />

      {/* Dashboard con barra lateral */}
      <Route path="/dashboard/*" element={<LayoutWithSidebar userInfo={userInfo} />}>  {/* Añade el asterisco */}
        <Route index element={<Dashboard />} />
        <Route path="conductores" element={<AdminConductor />} />
        <Route path="pasajeros" element={<AdminPasajero />} />
        <Route path="vehiculos" element={<Vehiculos />} />
        <Route path="viajes_pasajero" element={<ViajesPasajero />} />
        <Route path="historial-conductor" element={<HistorialConductor />} />  {/* Añade la nueva ruta */}
      </Route>

      {/* Redirección si la ruta no existe */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

// Layout que incluye la barra lateral
function LayoutWithSidebar({ userInfo }) {
  return (
    <div style={{ display: "flex",  backgroundColor:"#e1e9f0" }}>
      <Sidebar userInfo={userInfo} />
      <div style={{ flex: 1, padding: "20px" }}>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="conductores" element={<AdminConductor />} />
          <Route path="pasajeros" element={<AdminPasajero />} />
          <Route path="vehiculos" element={<Vehiculos />} />
          <Route path="viajes_pasajero" element={<ViajesPasajero />} />
          <Route path="historial-conductor" element={<HistorialConductor />} />  {/* Añade la nueva ruta */}
        </Routes>
      </div>
    </div>
  );
}

export default App;