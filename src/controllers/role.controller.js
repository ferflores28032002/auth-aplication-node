import { defaultPermissions, defaultRoles } from "../helpers/defaults.data.js";
import { Permission } from "../models/permission.model.js";
import { Role } from "../models/role.model.js";
import { User } from "../models/user.model.js";

// Obtener todos los roles
export const getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      include: [
        {
          model: Permission,
          attributes: ["id", "name"],
          through: { attributes: [] },
        },
      ],
    });
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los roles" });
  }
};

export const createRole = async (req, res) => {
  try {
    const { name } = req.body;

    // Verificar si el rol ya existe
    const existingRole = await Role.findOne({ where: { name } });
    if (existingRole) {
      return res.status(409).json({ error: "El rol ya existe" });
    }

    const role = await Role.create({ name });

    // Asignar el permiso por defecto al rol
    const defaultPermission = await Permission.findOne({
      where: { name: defaultPermissions.DEFAULT },
    });
    if (defaultPermission) {
      await role.addPermission(defaultPermission); // Establecer la relación entre el rol y el permiso
      return res.json({
        message: "Rol creado y permiso por defecto asignado al rol",
      });
    } else {
      return res.json({
        message: "Rol creado, pero el permiso por defecto no existe",
      });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al crear el rol" });
  }
};

// Crear un rol por defecto
export const createDefaultRole = async () => {
  try {
    const [role, created] = await Role.findOrCreate({
      where: { name: defaultRoles.DEFAULT },
    });
  } catch (error) {
    console.log("Error al crear el rol por defecto:", error);
  }
};

export const assignRolesToUser = async (req, res) => {
  try {
    const { userId, roles } = req.body;
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const existingRoles = await user.getRoles();

    const rolesToAdd = [];
    const rolesAlreadyAssigned = [];

    for (const roleId of roles) {
      if (existingRoles.some((role) => role.id === roleId)) {
        rolesAlreadyAssigned.push(roleId);
      } else {
        rolesToAdd.push(roleId);
      }
    }

    if (rolesAlreadyAssigned.length > 0) {
      const message = `Los siguientes roles ya están asignados al usuario: ${rolesAlreadyAssigned.join(
        ", "
      )}`;
      return res.json({ message });
    }

    if (rolesToAdd.length === 0) {
      return res.json({
        message: "El usuario ya tiene asignados todos los roles proporcionados",
      });
    }

    const newRoles = await Role.findAll({
      where: { id: rolesToAdd },
    });

    await user.addRoles(newRoles);

    res.json({ message: "Roles asignados al usuario correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al asignar los roles al usuario" });
  }
};

// Eliminar un rol
export const deleteRole = async (req, res) => {
  const { id } = req.params;

  try {
    const role = await Role.findByPk(id);
    if (!role) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    await role.destroy();
    return res.status(200).json({ message: "Rol eliminado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al eliminar el rol" });
  }
};

// Restaurar un rol
export const restoreRole = async (req, res) => {
  const { id } = req.params;

  try {
    const role = await Role.findByPk(id, { paranoid: false });
    if (!role) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }

    await role.restore();
    return res.status(200).json({ message: "Rol restaurado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al restaurar el rol" });
  }
};

//Se asigna el permiso por defecto al rol por defecto
export const addDefaultPermissionToDefaultRole = async () => {
  try {
    const defaultRole = await Role.findOne({
      where: { name: defaultRoles.DEFAULT },
    });
    const defaultPermission = await Permission.findOne({
      where: { name: defaultPermissions.DEFAULT },
    });

    if (defaultRole && defaultPermission) {
      await defaultRole.addPermission(defaultPermission);
      console.log("Se agregó el permiso por defecto al rol por defecto.");
    } else {
      console.log("No se encontró el rol o el permiso por defecto.");
    }
  } catch (error) {
    console.log(
      "Error al agregar el permiso por defecto al rol por defecto:",
      error
    );
  }
};
