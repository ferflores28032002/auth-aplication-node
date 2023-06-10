import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

import { testConnection } from "./config/database.config.js";
import { createDefaultPermission } from "./controllers/permission.controller.js";
import {
  addDefaultPermissionToDefaultRole,
  createDefaultRole,
} from "./controllers/role.controller.js";
import appGlobal from "./routes/index.js";

// Configuración de las variables de entorno
dotenv.config();

const app = express();

// Permitimos acceso a la API desde cualquier origen
app.use(cors());
// Verificamos el registro de solicitudes realizadas
app.use(morgan());

// Configuramos los middlewares para permitir la entrada de datos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Probamos la conexión a la base de datos
testConnection();
// Crear el rol y permiso por defecto
createDefaultRole();
createDefaultPermission();
addDefaultPermissionToDefaultRole();

// Entrada global de todas las rutas de la aplicación
app.use("/api/v1/", appGlobal);

// Levantamos el servidor con express
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
