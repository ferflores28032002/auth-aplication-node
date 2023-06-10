import { DataTypes } from "sequelize";

import sequelize from "../config/database.config.js";

export const Product = sequelize.define(
  "Product",
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
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
  },
  {
    paranoid: true, // Habilita el borrado lógico
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
  }
);
