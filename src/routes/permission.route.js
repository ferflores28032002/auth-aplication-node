import express from "express";
import {
  getAllPermissions,
  createPermission,
  assignPermissionsToRole,
} from "../controllers/permission.controller.js";
import { createPermissionValidations } from "../validation/permission.validation.js";

const router = express.Router();

router.get("/", getAllPermissions);
router.post("/", createPermissionValidations, createPermission);
router.post("/assign/role", assignPermissionsToRole);

export default router;
