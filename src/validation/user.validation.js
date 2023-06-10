import { body } from "express-validator";

// Validaciones para el registro de usuario
export const registerUserValidations = [
  body("username")
    .notEmpty()
    .withMessage("El nombre de usuario es obligatorio"),
  body("email")
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("El email no es válido"),
  body("password")
    .notEmpty()
    .withMessage("La contraseña es obligatoria")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
  body("fullName").notEmpty().withMessage("El nombre completo es obligatorio"),
];

// Validaciones para el inicio de sesión
export const loginUserValidations = [
  body("email")
    .notEmpty()
    .withMessage("El email es obligatorio")
    .isEmail()
    .withMessage("El email no es válido"),
  body("password").notEmpty().withMessage("La contraseña es obligatoria"),
];
