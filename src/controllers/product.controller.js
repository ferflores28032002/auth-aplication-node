import { Product } from "../models/products.model.js";
import { User } from "../models/user.model.js";

// Crear un producto
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, stock } = req.body;

    const product = await Product.create({
      name,
      price,
      description,
      stock,
      userId: req.user.id, // Asignar el id del usuario que crea el producto
    });

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al crear el producto" });
  }
};

// Obtener todos los productos
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll({
      include: [
        {
          model: User,
          attributes: ["email", "id", "fullName"],
        },
      ],
    });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener los productos" });
  }
};

// Obtener un producto por su ID
export const getProductById = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener el producto" });
  }
};

// Actualizar un producto
export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, description, stock } = req.body;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    product.name = name;
    product.price = price;
    product.description = description;
    product.stock = stock;

    await product.save();

    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
};

// Eliminar un producto
export const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByPk(id);
    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    await product.destroy();
    return res
      .status(200)
      .json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error al eliminar el producto" });
  }
};
