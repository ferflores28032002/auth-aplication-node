import { DataTypes } from "sequelize";

import sequelize from "./../config/database.config.js";

export const Role = sequelize.define(
  "Role",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    paranoid: true, // Habilita el borrado lógico
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
  }
);
