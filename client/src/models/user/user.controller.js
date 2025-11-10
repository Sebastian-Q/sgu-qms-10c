const UserController = {};
const ENV = import.meta.env;

const API_URL = `http://${ENV.VITE_API_HOST}:${ENV.VITE_API_PORT}${ENV.VITE_API_BASE}`;

UserController.getAll = async () => {
    try {
        const res = await fetch(API_URL, {
            method: "GET",
            headers: { "Accept": "application/json" },
        });

        if (!res.ok) throw new Error(`Error al obtener usuarios: ${res.status}`);
        const data = await res.json();
        return data.data;
    } catch (error) {
        console.error("Error en getAll:", error);
        return [];
    }
};

UserController.getById = async (id) => {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "GET",
            headers: { "Accept": "application/json" },
        });

        if (!res.ok) throw new Error(`Error al obtener usuario: ${res.status}`);
        const data = await res.json();
        return data.data;
    } catch (error) {
        console.error("Error en getById:", error);
        return null;
    }
};

UserController.create = async (user) => {
    try {
        const res = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(user),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error al crear usuario");
        return data.data;
    } catch (error) {
        console.error("Error en create:", error);
        throw error;
    }
};

UserController.update = async (user) => {
    try {
        const res = await fetch(API_URL, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json",
            },
            body: JSON.stringify(user),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error al actualizar usuario");
        return data.data;
    } catch (error) {
        console.error("Error en update:", error);
        throw error;
    }
};

UserController.delete = async (id) => {
    try {
        const res = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
            headers: { "Accept": "application/json" },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error al eliminar usuario");
        return data.message || "Usuario eliminado correctamente";
    } catch (error) {
        console.error("Error en delete:", error);
        throw error;
    }
};

export default UserController;
