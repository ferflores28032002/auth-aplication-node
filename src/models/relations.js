import { User } from "./user.model.js";
import { Role } from "./role.model.js";
import { Permission } from "./permission.model.js";
import { Product } from "./products.model.js";

// Relaciones de usuarios, roles y permisos
User.belongsToMany(Role, { through: "UserRole" });
Role.belongsToMany(User, { through: "UserRole" });
Role.belongsToMany(Permission, { through: "RolePermission" });

// Establecer la relación entre User y Product
User.hasMany(Product, {
  foreignKey: "userId", // La clave foránea en la tabla Product que hace referencia al id de User
});
Product.belongsTo(User, {
  foreignKey: "userId", // La clave foránea en la tabla Product que hace referencia al id de User
});
