
export const initialProducts = [
  {
    id: 1,
    name: "Beras Pandan Wangi 5kg",
    category: "Bahan Dapur",
    price: 78000,
    stock: 2,
    unit: "karung",
    min: 5,
  },
  {
    id: 2,
    name: "Ayam Broiler Segar",
    category: "Bahan Dapur",
    price: 38000,
    stock: 17,
    unit: "kg",
    min: 10,
  },
  {
    id: 3,
    name: "Sambal Botol Kemasan 150gr",
    category: "Makanan",
    price: 25000,
    stock: 3,
    unit: "botol",
    min: 15,
  },
  {
    id: 4,
    name: "Minyak Goreng Sawit 2L",
    category: "Bahan Dapur",
    price: 36000,
    stock: 2,
    unit: "pouch",
    min: 10,
  },
];

export function getSavedProducts() {
  const saved = localStorage.getItem("umkm_products");

  if (!saved) return initialProducts;

  const products = JSON.parse(saved);

  return products.map((product, index) => ({
    ...product,
    id: product.id ?? index + 1,
    price: product.price ?? initialProducts[index]?.price ?? 0,
    category:
      product.category ??
      initialProducts[index]?.category ??
      "Lainnya",
  }));
}

export function saveProducts(products) {
  localStorage.setItem("umkm_products", JSON.stringify(products));
}

export function getSavedOrders() {
  const saved = localStorage.getItem("umkm_orders");
  return saved ? JSON.parse(saved) : [];
}
