import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "../Styles/Login.css";
import logo from "../assets/gosafe_logo.png"; // Asegúrate de que la imagen esté en la carpeta correcta

function Login({ setUserInfo }) {
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [role, setRole] = useState('admin'); // 'admin' o 'conductor'
    const navigate = useNavigate();

    const handleLogin = () => {
        const loginEndpoint = role === 'admin' ? '/auth/login/admin' : '/auth/login/conductor';
        axios.post(`https://api-gosafe.onrender.com/api${loginEndpoint}`, {
            correo,
            contraseña
        })
        .then(response => {
            // Manejar la respuesta del servidor
            console.log('Login successful:', response.data);
            setUserInfo(response.data.user); // Almacenar la información del usuario en el estado
            navigate("/dashboard");
        })
        .catch(error => {
            // Manejar errores
            console.error('Error logging in:', error);
        });
    };

    return (
        <div className="login-container">
            <img src={logo} alt="Logo" className="login-logo" />
            <div className="login-form">
                <h2>Iniciar sesión</h2>
                <input
                    type="email"
                    placeholder="Correo electrónico"
                    className="login-input"
                    value={correo}
                    onChange={(e) => setCorreo(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    className="login-input"
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                />
                <select
                    className="login-input"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                >
                    <option value="admin">Administrador</option>
                    <option value="conductor">Conductor</option>
                </select>
                <button onClick={handleLogin} className="login-button">Iniciar sesión</button>
            </div>
        </div>
    );
}

export default Login;