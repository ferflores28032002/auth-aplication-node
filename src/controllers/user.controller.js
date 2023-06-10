import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { Role } from "../models/role.model.js";
import { User } from "../models/user.model.js";
import { Permission } from "../models/permission.model.js";
import { defaultRoles } from "../helpers/defaults.data.js";

export const getUsersWithRolesAndPermissions = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["username", "isActive", "password"] },
      include: [
        {
          model: Role,
          attributes: ["id", "name"],
          through: { attributes: [] },
          include: [
            {
              model: Permission,
              attributes: ["id", "name"],
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "Error al obtener los usuarios con roles y permisos" });
  }
};

export const registerUser = async (req, res) => {
  const { username, email, password, fullName } = req.body;

  try {
    // Verificar si el usuario ya existe en la base de datos
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "El usuario con email ya existe" });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario en la base de datos
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      fullName,
    });

    // Asignar el rol por defecto al usuario
    const defaultRole = await Role.findOne({
      where: { name: defaultRoles.DEFAULT },
    });
    if (defaultRole) {
      await user.addRole(defaultRole); // Establecer la relación entre el usuario y el rol
      return res.status(201).json({
        message:
          "Usuario registrado exitosamente. Se le asignó el rol por defecto",
        user,
      });
    } else {
      return res.status(500).json({
        message:
          "Error al registrar el usuario. No se encontró el rol por defecto",
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al registrar el usuario" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Buscar el usuario en la base de datos
    const user = await User.findOne({
      where: { email },
      attributes: ["email", "fullName", "username", "id", "password"],
    });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    // Verificar la contraseña
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    // Generar el token JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, {
      expiresIn: process.env.JWT_EXPIRATION_TOKEN,
    });

    // Filtrar el objeto usuario para excluir la propiedad "password"
    const filteredUser = { ...user.toJSON(), password: undefined };

    return res.status(200).json({ user: filteredUser, token });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al iniciar sesión" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    await user.destroy();

    return res.status(200).json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al eliminar el usuario" });
  }
};

export const restoreUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id, { paranoid: false });

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!user.deletedAt) {
      return res.status(400).json({ message: "El usuario no está eliminado" });
    }

    await user.restore();

    return res
      .status(200)
      .json({ message: "Usuario restaurado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al restaurar el usuario" });
  }
};
