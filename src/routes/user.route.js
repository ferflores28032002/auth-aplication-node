import express from "express";

import {
  loginUserValidations,
  registerUserValidations,
} from "../validation/user.validation.js";
import {
  deleteUser,
  getUsersWithRolesAndPermissions,
  loginUser,
  registerUser,
  restoreUser,
} from "../controllers/user.controller.js";
import "../models/relations.js";
import { authenticateToken } from "../middlewares/autenticateToken.js";
import { checkRoleAndPermission } from "./../middlewares/checkRolAndPermission.js";
import {
  defaultRoles,
  defaultPermissions,
} from "./../helpers/defaults.data.js";

const router = express.Router();

// Ruta para obtener la lista de usuarios con roles y permisos
router.get(
  "/",
  authenticateToken,
  checkRoleAndPermission([defaultRoles.ADMIN], [defaultPermissions.READ]),
  getUsersWithRolesAndPermissions
);

// Ruta para registrar un usuario
router.post("/", registerUserValidations, registerUser);

// Ruta para iniciar sesión
router.post("/login", loginUserValidations, loginUser);

router.delete(
  "/:id",
  checkRoleAndPermission(
    [defaultRoles.ADMIN, defaultRoles.DEFAULT],
    [defaultPermissions.DELETE]
  ),
  deleteUser
);

router.put("/:id", restoreUser);

export default router;
