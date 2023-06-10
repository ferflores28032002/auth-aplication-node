import { body } from "express-validator";

// Validaciones para la creación de un rol
export const createRoleValidations = [
  body("name").notEmpty().withMessage("El nombre del rol es obligatorio"),
];

export const assignPermissionsToRoleValidations = [
  body("roleId")
    .notEmpty()
    .withMessage("El ID del rol es obligatorio")
    .isInt()
    .withMessage("El ID del rol debe ser un número entero"),
  body("permissionIds")
    .isArray({ min: 1 })
    .withMessage("Debe proporcionar al menos un ID de permiso")
    .custom((value) => {
      for (let id of value) {
        if (!Number.isInteger(id)) {
          throw new Error("Los IDs de permisos deben ser números enteros");
        }
      }
      return true;
    }),
];
