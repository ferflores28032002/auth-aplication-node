import { body } from "express-validator";

// Validaciones para la creación de un permiso
export const createPermissionValidations = [
  body("name").notEmpty().withMessage("El nombre del permiso es obligatorio"),
];
