import dotenv from "dotenv";
import { Sequelize } from "sequelize";

dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
  }
);

export const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log(`Conexion exitosa ala base de datos ${process.env.DB_NAME}`);
    sequelize.sync({ force: false });
  } catch (error) {
    console.error(
      `Error al conectar ala base de datos ${process.env.DB_NAME}`,
      error
    );
  }
};

export default sequelize;
