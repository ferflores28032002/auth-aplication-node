import express from "express";

import { createRoleValidations } from "./../validation/rol.validation.js";
import {
  getAllRoles,
  createRole,
  assignRolesToUser,
} from "../controllers/role.controller.js";

const router = express.Router();

router.get("/", getAllRoles);
router.post("/", createRoleValidations, createRole);
router.post("/assing/user", assignRolesToUser);
router.post("/", createRoleValidations, createRole);

export default router;
