import { useEffect, useState } from "react";
import UserController from "./models/user/user.controller.js";

function App() {
  const [users, setUsers] = useState([]);
  
  const [showModal, setShowModal] = useState(false);

  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const data = await UserController.getAll();
    setUsers(data || []);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "El nombre es obligatorio";

    if (!formData.email.trim()) {
      newErrors.email = "El correo es obligatorio";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Correo inválido";
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Debe tener 10 dígitos";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      if (editingUser) {
        await UserController.update({ ...formData, id: editingUser.id });
      } else {
        await UserController.create(formData);
      }
      await loadUsers();
      handleClose();
    } catch (err) {
      alert("Error al guardar: " + err.message);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      phone: user.phone,
    });
    
    setEditingUser(user);
    setErrors({});
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await UserController.delete(id);
      await loadUsers();
    } catch (err) {
      alert("Error al eliminar: " + err.message);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setEditingUser(null);
    setFormData({ name: "", email: "", phone: "" });
    setErrors({});
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a href="#" className="navbar-brand fw-bold text-primary">
            SGU-QMS-10C
          </a>
        </div>
      </nav>

      <div className="container mt-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="fw-semibold">Usuarios</h2>
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowModal(true);
              setEditingUser(null);
              setFormData({ name: "", email: "", phone: "" });
              setErrors({});
            }}
          >
            + Registrar Usuario
          </button>
        </div>

        <table className="table table-striped table-bordered align-middle text-center">
          <thead className="table-light">
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Teléfono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-muted">
                  No hay usuarios registrados
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => handleEdit(user)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(user.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content shadow">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  {editingUser ? "Editar Usuario" : "Registrar Usuario"}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={handleClose}
                ></button>
              </div>

              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre completo</label>
                  <input
                    type="text"
                    name="name"
                    className={`form-control ${errors.name ? "is-invalid" : ""}`}
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Ej. Juan Pérez"
                  />
                  {errors.name && (
                    <div className="invalid-feedback">{errors.name}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Correo electrónico</label>
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Ej. correo@ejemplo.com"
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="text"
                    name="phone"
                    className={`form-control ${errors.phone ? "is-invalid" : ""}`}
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="10 dígitos"
                  />
                  {errors.phone && (
                    <div className="invalid-feedback">{errors.phone}</div>
                  )}
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={handleClose}>
                  Cancelar
                </button>
                <button className="btn btn-primary" onClick={handleSave}>
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
