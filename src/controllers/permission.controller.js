import { defaultPermissions } from "../helpers/defaults.data.js";
import { Permission } from "../models/permission.model.js";
import { Role } from "../models/role.model.js";

// Obtener todos los permisos
export const getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.findAll();
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los permisos" });
  }
};

export const createPermission = async (req, res) => {
  try {
    const { name } = req.body;
    // Verificar si el permiso ya existe
    const existingPermission = await Permission.findOne({ where: { name } });
    if (existingPermission) {
      return res.status(409).json({ error: "El permiso ya existe" });
    }

    const permission = await Permission.create({ name });
    res.json(permission);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el permiso" });
  }
};

// Crear un permiso por defecto
export const createDefaultPermission = async () => {
  try {
    const [permission, created] = await Permission.findOrCreate({
      where: { name: defaultPermissions.DEFAULT },
    });

    if (created) {
      console.log("Se creó el permiso por defecto.");
    } else {
      console.log("El permiso por defecto ya existe.");
    }
  } catch (error) {
    console.log("Error al crear el permiso por defecto:", error);
  }
};

export const assignPermissionsToRole = async (req, res) => {
  try {
    const { roleId, permissions } = req.body;
    const role = await Role.findByPk(roleId);

    if (!role) {
      return res.status(404).json({ error: "Rol no encontrado" });
    }

    const existingPermissions = await role.getPermissions();

    const permissionsToAdd = [];
    const permissionsAlreadyAssigned = [];

    for (const permissionId of permissions) {
      if (
        existingPermissions.some((permission) => permission.id === permissionId)
      ) {
        permissionsAlreadyAssigned.push(permissionId);
      } else {
        permissionsToAdd.push(permissionId);
      }
    }

    if (permissionsAlreadyAssigned.length > 0) {
      const message = `Los siguientes permisos ya están asignados al rol: ${permissionsAlreadyAssigned.join(
        ", "
      )}`;
      return res.json({ message });
    }

    if (permissionsToAdd.length === 0) {
      return res.json({
        message: "El rol ya tiene asignados todos los permisos proporcionados",
      });
    }

    const newPermissions = await Permission.findAll({
      where: { id: permissionsToAdd },
    });

    await role.addPermissions(newPermissions);

    res.json({ message: "Permisos asignados al rol correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al asignar los permisos al rol" });
  }
};

// Eliminar un permiso
export const deletePermission = async (req, res) => {
  const { id } = req.params;

  try {
    const permission = await Permission.findByPk(id);
    if (!permission) {
      return res.status(404).json({ message: "Permiso no encontrado" });
    }

    await permission.destroy();
    return res.status(200).json({ message: "Permiso eliminado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al eliminar el permiso" });
  }
};

// Restaurar un permiso
export const restorePermission = async (req, res) => {
  const { id } = req.params;

  try {
    const permission = await Permission.findByPk(id, { paranoid: false });
    if (!permission) {
      return res.status(404).json({ message: "Permiso no encontrado" });
    }

    await permission.restore();
    return res
      .status(200)
      .json({ message: "Permiso restaurado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al restaurar el permiso" });
  }
};
