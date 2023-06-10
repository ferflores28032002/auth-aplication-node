import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Role } from "../models/role.model.js";
import { Permission } from "../models/permission.model.js";

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Extrae el token del encabezado "Authorization"

  if (!token) {
    return res
      .status(401)
      .json({ error: "Token de autenticación no proporcionado" });
  }

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await User.findOne({
      where: { id: decodedToken.userId },
      include: [
        {
          model: Role,
          attributes: ["id", "name"],
          include: [
            {
              model: Permission,
              attributes: ["id", "name"],
              through: { attributes: [] }, // Evita incluir los campos adicionales de la tabla intermedia
            },
          ],
          through: { attributes: [] }, // Evita incluir los campos adicionales de la tabla intermedia
        },
      ],
      attributes: [
        "id",
        "username",
        "email",
        "fullName",
        "createdAt",
        "updatedAt",
      ],
      raw: false, // Cambia a false para obtener los resultados en formato de objetos anidados
    });

    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    // Adjunta el usuario a la solicitud para su uso posterior
    req.user = user;

    next(); // Continúa con la siguiente función de middleware
  } catch (error) {
    console.error("Error al verificar el token de autenticación:", error);
    return res.status(401).json({ error: "No autorizado" });
  }
};
