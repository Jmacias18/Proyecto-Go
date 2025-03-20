import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import "../Styles/Login.css";
import logo from "../assets/gosafe_logo.png"; // Asegúrate de que la imagen esté en la carpeta correcta

function Login({ setUserInfo }) {
    const [correo, setCorreo] = useState('');
    const [contraseña, setContraseña] = useState('');
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validate = () => {
        const errors = {};
        if (!correo) {
            errors.correo = 'El correo electrónico es obligatorio';
        } else if (!/\S+@\S+\.\S+/.test(correo)) {
            errors.correo = 'El correo electrónico no es válido';
        }
        if (!contraseña) {
            errors.contraseña = 'La contraseña es obligatoria';
        }
        return errors;
    };

    const handleLogin = () => {
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        // Intentar iniciar sesión como administrador
        axios.post('https://api-gosafe.onrender.com/api/auth/login/admin', {
            correo,
            contraseña
        })
        .then(response => {
            // Manejar la respuesta del servidor para administrador
            console.log('Login successful as admin:', response.data);
            setUserInfo(response.data.user); // Almacenar la información del usuario en el estado
            navigate("/dashboard");
        })
        .catch(error => {
            // Si falla, intentar iniciar sesión como conductor
            console.error('Error logging in as admin:', error);
            axios.post('https://api-gosafe.onrender.com/api/auth/login/conductor', {
                correo,
                contraseña
            })
            .then(response => {
                // Manejar la respuesta del servidor para conductor
                console.log('Login successful as conductor:', response.data);
                setUserInfo(response.data.user); // Almacenar la información del usuario en el estado
                navigate("/dashboard");
            })
            .catch(error => {
                // Manejar errores
                console.error('Error logging in as conductor:', error);
                alert('Correo o contraseña incorrectos');
            });
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
                {errors.correo && <p className="error">{errors.correo}</p>}
                <input
                    type="password"
                    placeholder="Contraseña"
                    className="login-input"
                    value={contraseña}
                    onChange={(e) => setContraseña(e.target.value)}
                />
                {errors.contraseña && <p className="error">{errors.contraseña}</p>}
                <button onClick={handleLogin} className="login-button">Iniciar sesión</button>
            </div>
        </div>
    );
}

export default Login;