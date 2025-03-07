import React, { useEffect, useState } from 'react';
import { FaPen, FaSearch, FaPlus, FaTrashAlt } from "react-icons/fa";
import axiosInstance from '../axiosConfig';
import "../Styles/AdminConductor.css";

function AdminConductor() {
    const [usuarios, setUsuarios] = useState([]);
    const [editingUser, setEditingUser] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchConductores();
    }, []);

    const fetchConductores = () => {
        console.log('Fetching conductores...');
        axiosInstance.get('/conductores')
            .then(response => {
                console.log('Conductores fetched:', response.data);
                setUsuarios(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    };

    const handleEdit = (usuario) => {
        console.log('Editing user:', usuario);
        setEditingUser(usuario);
    };

    const handleSave = (event) => {
        event.preventDefault();
        const { id, nombre_completo, correo, telefono, activo } = editingUser;
        const dataToSend = { nombre_completo, correo, telefono, activo: activo !== undefined ? activo : 1 };
        console.log('Datos a enviar:', dataToSend); // Agregar console.log para depuración
        axiosInstance.put(`/conductores/${id}`, dataToSend)
            .then(response => {
                console.log('User updated:', response.data);
                setEditingUser(null);
                // Actualizar el estado de usuarios localmente
                setUsuarios(prevUsuarios => prevUsuarios.map(usuario =>
                    usuario.id === id ? { ...usuario, nombre_completo, correo, telefono, activo: 1 } : usuario
                ));
            })
            .catch(error => {
                console.error('Error updating user:', error);
                alert(`Error updating user: ${error.message}`);
            });
    };

    const handleDelete = (id) => {
        console.log('Deleting user:', id);
        axiosInstance.put(`/conductores/${id}`, { activo: 0 })
            .then(response => {
                console.log('User marked as inactive:', response.data);
                // Actualizar el estado de usuarios localmente
                setUsuarios(prevUsuarios => prevUsuarios.map(usuario =>
                    usuario.id === id ? { ...usuario, activo: 0 } : usuario
                ));
            })
            .catch(error => {
                console.error('Error marking user as inactive:', error);
                alert(`Error marking user as inactive: ${error.message}`);
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditingUser(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleCreateProfile = () => {
        setIsModalOpen(true);   // Aquí abre el modal
    };

    const closeModal = () => {
        setIsModalOpen(false); // Aquí cierra el modal
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const nuevoPerfil = Object.fromEntries(formData.entries());
        nuevoPerfil.rol = 2; // Asegurarse de que el rol sea 'conductor'
        nuevoPerfil.activo = 1; // Asegurarse de que el conductor esté activo
        console.log("Nuevo Perfil", nuevoPerfil);

        // Enviar los datos al servidor para crear un nuevo conductor
        axiosInstance.post('/conductores', nuevoPerfil)
            .then(response => {
                console.log('Perfil creado:', response.data); // Log de la respuesta del servidor
                // Actualizar la lista de usuarios con el nuevo conductor
                setUsuarios(prevUsuarios => [...prevUsuarios, { ...nuevoPerfil, id: response.data.id }]);
                closeModal();
            })
            .catch(error => {
                console.error('Error creating new profile:', error);
                alert(`Error creating new profile: ${error.message}`);
            });
    };

    const filteredUsuarios = usuarios.filter(usuario =>
        usuario.activo === 1 && (usuario.nombre_completo || '').toLowerCase().includes((searchTerm || '').toLowerCase())
    );

    return (
        <div className="container">
            <h1>Administrar Conductor</h1>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <FaSearch />
                <input
                    type="text"
                    placeholder="Buscar nombre"
                    className="inp"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <div className="listcontainer">
                <table className="tabla">
                    <thead>
                        <tr>
                            <th>Correo</th>
                            <th>Nombre Completo</th>
                            <th>Telefono</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsuarios.map((usuario) => (
                            <tr key={usuario.id}>
                                <td>{usuario.correo}</td>
                                <td>{usuario.nombre_completo}</td>
                                <td>{usuario.telefono}</td>
                                <td>{usuario.rol === 2 ? 'Conductor' : 'Otro Rol'}</td>
                                <td>
                                    <FaPen
                                        className="icon"
                                        onClick={() => handleEdit(usuario)}
                                    />
                                    <FaTrashAlt
                                        className="icon"
                                        onClick={() => handleDelete(usuario.id)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <button className="create-profile-button" onClick={handleCreateProfile}>
                <FaPlus /> Crear Perfil
            </button>

            {editingUser && (
                <div className="edit-container">
                    <h2>Editar Conductor</h2>
                    <form onSubmit={handleSave}>
                        <input
                            type="text"
                            name="nombre_completo"
                            value={editingUser.nombre_completo}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="correo"
                            value={editingUser.correo}
                            onChange={handleChange}
                        />
                        <input
                            type="text"
                            name="telefono"
                            value={editingUser.telefono}
                            onChange={handleChange}
                        />
                        <button type="submit">Guardar</button>
                        <button type="button" onClick={() => setEditingUser(null)}>Cancelar</button>
                    </form>
                </div>
            )}

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Agregar Nuevo Perfil</h2>
                        <form onSubmit={handleSubmit}>
                            <label>
                                Nombre:
                                <input type="text" name="nombre_completo" required />
                            </label>
                            <label>
                                Apellidos:
                                <input type="text" name="apellido" required />
                            </label>
                            <label>
                                Correo:
                                <input type="email" name="correo" required />
                            </label>
                            <label>
                                Telefono:
                                <input type="tel" name="telefono" required />
                            </label>
                            <label>
                                Contraseña:
                                <input type="password" name="contraseña" required />
                            </label>
                            <div className="modal-buttons">
                                <button type="button" onClick={closeModal}>
                                    Cancelar
                                </button>
                                <button type="submit">Guardar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminConductor;