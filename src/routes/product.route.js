import express from "express";

import { authenticateToken } from "../middlewares/autenticateToken.js";
import { checkRoleAndPermission } from "./../middlewares/checkRolAndPermission.js";
import {
  defaultRoles,
  defaultPermissions,
} from "./../helpers/defaults.data.js";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
  updateProduct,
} from "../controllers/product.controller.js";

const router = express.Router();

// Obtener todos los productos
router.get(
  "/",
  authenticateToken,
  checkRoleAndPermission(
    [defaultRoles.ADMIN, defaultRoles.DEFAULT],
    [defaultPermissions.READ]
  ),
  getAllProducts
);

// Obtener un producto por su ID
router.get(
  "/:id",
  authenticateToken,
  checkRoleAndPermission(
    [defaultRoles.ADMIN, defaultRoles.DEFAULT],
    [defaultPermissions.READ]
  ),
  getProductById
);

// Crear un nuevo producto
router.post(
  "/",
  authenticateToken,
  checkRoleAndPermission(
    [defaultRoles.ADMIN, defaultRoles.DEFAULT],
    [defaultPermissions.CREATE]
  ),
  createProduct
);

// Actualizar un producto existente
router.put(
  "/:id",
  authenticateToken,
  checkRoleAndPermission(
    [defaultRoles.ADMIN, defaultRoles.DEFAULT],
    [defaultPermissions.UPDATE]
  ),
  updateProduct
);

// Eliminar un producto
router.delete(
  "/:id",
  authenticateToken,
  checkRoleAndPermission(
    [defaultRoles.ADMIN, defaultRoles.DEFAULT],
    [defaultPermissions.DELETE]
  ),
  deleteProduct
);

export default router;
