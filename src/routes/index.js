import express from "express";

import userRoute from "./user.route.js";
import rolRoute from "./rol.route.js";
import permissionRoute from "./permission.route.js";
import productRoute from "./product.route.js";

const app = express();

app.use("/users", userRoute);
app.use("/roles", rolRoute);
app.use("/permissions", permissionRoute);
app.use("/products", productRoute);

export default app;
