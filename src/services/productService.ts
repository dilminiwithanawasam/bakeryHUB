import prisma from '../config/db';

export const getAllProducts = async () => {
  return await prisma.products.findMany({
    where: { is_active: true },
    orderBy: { product_name: 'asc' }
  });
};

export const createProduct = async (data: any) => {
  return await prisma.products.create({
    data: {
      product_name: data.product_name,
      description: data.description,
      category: data.category,
      base_price: data.base_price, // Ensure this is passed as Decimal or number
      shelf_life_days: parseInt(data.shelf_life_days),
      measurement_type: data.measurement_type, // "PCS", "KG", etc.
      is_active: true
    }
  });
};