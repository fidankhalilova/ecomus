// src/app/admin/products/page.tsx
"use client";
import { useState, useEffect } from "react";
import { Plus, X, Edit2, Trash2, Check } from "lucide-react";
import {
  api,
  Product,
  ProductCategory,
  ProductColor,
  ProductSize,
  CreateProductData,
} from "@/http/api";

export default function AdminProductsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<string | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [colors, setColors] = useState<ProductColor[]>([]);
  const [sizes, setSizes] = useState<ProductSize[]>([]);

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState<CreateProductData>({
    name: "",
    price: "",
    discountedPrice: "",
    description: "",
    tag: "",
    mainImage: "",
    hoverImage: "",
    stockCount: "",
    productCategoryId: "",
    // Changed from single to array
    productColors: [],
    productSizes: [],
  });

  // State for selected colors and sizes in form
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        fetchProducts(),
        fetchCategories(),
        fetchColors(),
        fetchSizes(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await api.getProducts();
      if (response.productList) {
        setProducts(response.productList);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.getProductCategories();
      if (response.productCategoryList) {
        setCategories(
          response.productCategoryList.filter((cat) => !cat.isDeleted)
        );
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchColors = async () => {
    try {
      const response = await api.getProductColors();
      if (response.productColorList) {
        setColors(
          response.productColorList.filter((color) => !color.isDeleted)
        );
      }
    } catch (error) {
      console.error("Error fetching colors:", error);
    }
  };

  const fetchSizes = async () => {
    try {
      const response = await api.getProductSizes();
      if (response.productSizeList) {
        setSizes(response.productSizeList.filter((size) => !size.isDeleted));
      }
    } catch (error) {
      console.error("Error fetching sizes:", error);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle color selection
  const handleColorSelect = (colorId: string) => {
    setSelectedColors((prev) => {
      if (prev.includes(colorId)) {
        return prev.filter((id) => id !== colorId);
      } else {
        return [...prev, colorId];
      }
    });
  };

  // Handle size selection
  const handleSizeSelect = (sizeId: string) => {
    setSelectedSizes((prev) => {
      if (prev.includes(sizeId)) {
        return prev.filter((id) => id !== sizeId);
      } else {
        return [...prev, sizeId];
      }
    });
  };

  // Select all colors
  const selectAllColors = () => {
    setSelectedColors(colors.map((color) => color._id));
  };

  // Clear all colors
  const clearAllColors = () => {
    setSelectedColors([]);
  };

  // Select all sizes
  const selectAllSizes = () => {
    setSelectedSizes(sizes.map((size) => size._id));
  };

  // Clear all sizes
  const clearAllSizes = () => {
    setSelectedSizes([]);
  };

  const openCreateModal = () => {
    setModalType("create");
    setEditingId(null);
    setFormData({
      name: "",
      price: "",
      discountedPrice: "",
      description: "",
      tag: "",
      mainImage: "",
      hoverImage: "",
      stockCount: "",
      productCategoryId: categories[0]?._id || "",
      productColors: [],
      productSizes: [],
    });
    setSelectedColors([]);
    setSelectedSizes([]);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setModalType("edit");
    setEditingId(product._id);

    // Extract IDs from populated objects or strings
    const categoryId =
      typeof product.productCategoryId === "object"
        ? product.productCategoryId._id
        : product.productCategoryId;

    // Extract color IDs (handle both array of objects and array of strings)
    const colorIds = product.productColors.map((color) =>
      typeof color === "object" ? color._id : color
    );

    // Extract size IDs (handle both array of objects and array of strings)
    const sizeIds = product.productSizes.map((size) =>
      typeof size === "object" ? size._id : size
    );

    setFormData({
      name: product.name,
      price: product.price.toString(),
      discountedPrice: product.discountedPrice?.toString() || "",
      description: product.description,
      tag: product.tag,
      mainImage: product.mainImage,
      hoverImage: product.hoverImage,
      stockCount: product.stockCount.toString(),
      productCategoryId: categoryId,
      productColors: colorIds,
      productSizes: sizeIds,
    });

    setSelectedColors(colorIds);
    setSelectedSizes(sizeIds);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate that at least one color and one size are selected
      if (selectedColors.length === 0) {
        alert("Please select at least one color");
        return;
      }
      if (selectedSizes.length === 0) {
        alert("Please select at least one size");
        return;
      }

      const productData: CreateProductData = {
        ...formData,
        price: parseFloat(formData.price as string),
        discountedPrice: formData.discountedPrice
          ? parseFloat(formData.discountedPrice as string)
          : parseFloat(formData.price as string),
        stockCount: parseInt(formData.stockCount as string),
        tag: formData.tag || "new",
        // Add selected colors and sizes
        productColors: selectedColors,
        productSizes: selectedSizes,
      };

      if (modalType === "create") {
        const response = await api.createProduct(productData);
        if (response.message.includes("successfully")) {
          await fetchProducts();
          alert("Product created successfully!");
        } else {
          alert(response.message);
        }
      } else if (editingId) {
        const response = await api.updateProduct(editingId, productData);
        if (response.message.includes("successfully")) {
          await fetchProducts();
          alert("Product updated successfully!");
        } else {
          alert(response.message);
        }
      }

      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving product:", error);
      alert("Error saving product");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const response = await api.deleteProduct(id);
      if (response.message.includes("successfully")) {
        await fetchProducts();
        alert("Product deleted successfully!");
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Helper function to get names from relations array
  const getRelationNames = (
    relations: (ProductCategory | ProductColor | ProductSize | string)[]
  ) => {
    return relations
      .map((relation) => {
        if (typeof relation === "object" && relation !== null) {
          return relation.name;
        }
        return relation;
      })
      .join(", ");
  };

  // Function to get color code
  const getColorCode = (colorName: string) => {
    const colorMap: { [key: string]: string } = {
      red: "#dc2626",
      blue: "#2563eb",
      green: "#16a34a",
      yellow: "#ca8a04",
      purple: "#9333ea",
      pink: "#db2777",
      orange: "#ea580c",
      black: "#000000",
      white: "#ffffff",
      gray: "#6b7280",
      brown: "#92400e",
      navy: "#1e3a8a",
      teal: "#0d9488",
    };

    const lowerName = colorName.toLowerCase();
    return colorMap[lowerName] || "#6b7280";
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-900">Products</h2>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Create Product
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Colors
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Sizes
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Stock
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                  No products found
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {product.name}
                    </div>
                    <div className="text-xs text-gray-500 truncate max-w-xs">
                      {product.description}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      ${product.discountedPrice.toFixed(2)}
                    </div>
                    {product.discountedPrice &&
                      product.discountedPrice !== product.price && (
                        <div className="text-xs text-red-600 line-through">
                          ${product.price.toFixed(2)}
                        </div>
                      )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {typeof product.productCategoryId === "object"
                      ? product.productCategoryId.name
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {product.productColors.map((color, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-md"
                        >
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{
                              backgroundColor: getColorCode(
                                typeof color === "object"
                                  ? color.name
                                  : "Unknown"
                              ),
                            }}
                          />
                          <span className="text-xs text-gray-700">
                            {typeof color === "object" ? color.name : "N/A"}
                          </span>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {product.productSizes.map((size, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md"
                        >
                          {typeof size === "object" ? size.name : "N/A"}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        product.stockCount > 50
                          ? "bg-green-100 text-green-800"
                          : product.stockCount > 10
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {product.stockCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(product.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => openEditModal(product)}
                      className="text-blue-600 hover:text-blue-900 mr-3"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalType === "create" ? "Create Product" : "Edit Product"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Discounted Price
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      name="discountedPrice"
                      value={formData.discountedPrice}
                      onChange={handleInputChange}
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Count *
                    </label>
                    <input
                      type="number"
                      name="stockCount"
                      value={formData.stockCount}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category *
                    </label>
                    <select
                      name="productCategoryId"
                      value={formData.productCategoryId}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category._id} value={category._id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Main Image URL *
                    </label>
                    <input
                      type="url"
                      name="mainImage"
                      value={formData.mainImage}
                      onChange={handleInputChange}
                      required
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Hover Image URL *
                    </label>
                    <input
                      type="url"
                      name="hoverImage"
                      value={formData.hoverImage}
                      onChange={handleInputChange}
                      required
                      placeholder="https://example.com/hover-image.jpg"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tag
                    </label>
                    <select
                      name="tag"
                      value={formData.tag}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select tag</option>
                      <option value="new">New</option>
                      <option value="sale">Sale</option>
                      <option value="best seller">Best Seller</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Colors Selection */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Colors * (Select multiple)
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={selectAllColors}
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={clearAllColors}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {colors.map((color) => (
                    <div
                      key={color._id}
                      onClick={() => handleColorSelect(color._id)}
                      className={`flex items-center gap-2 p-2 border rounded-md cursor-pointer transition-colors ${
                        selectedColors.includes(color._id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="relative">
                        <div
                          className="w-6 h-6 rounded-full border border-gray-300"
                          style={{ backgroundColor: getColorCode(color.name) }}
                        />
                        {selectedColors.includes(color._id) && (
                          <Check
                            size={12}
                            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white"
                          />
                        )}
                      </div>
                      <span className="text-sm">{color.name}</span>
                    </div>
                  ))}
                </div>
                {selectedColors.length > 0 && (
                  <p className="mt-2 text-sm text-gray-500">
                    Selected: {selectedColors.length} color(s)
                  </p>
                )}
              </div>

              {/* Sizes Selection */}
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Sizes * (Select multiple)
                  </label>
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={selectAllSizes}
                      className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={clearAllSizes}
                      className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                    >
                      Clear All
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {sizes.map((size) => (
                    <div
                      key={size._id}
                      onClick={() => handleSizeSelect(size._id)}
                      className={`flex items-center justify-center p-2 border rounded-md cursor-pointer transition-colors ${
                        selectedSizes.includes(size._id)
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{size.name}</span>
                        {selectedSizes.includes(size._id) && (
                          <Check size={14} className="text-blue-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {selectedSizes.length > 0 && (
                  <p className="mt-2 text-sm text-gray-500">
                    Selected: {selectedSizes.length} size(s)
                  </p>
                )}
              </div>

              <div className="flex gap-3 mt-6 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  {modalType === "create" ? "Create" : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
