// src/app/admin/sizes/page.tsx
"use client";
import { useState, useEffect } from "react";
import { Plus, X, Edit2, Trash2 } from "lucide-react";
import { api, ProductSize } from "@/http/api";

export default function SizesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit">("create");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [sizes, setSizes] = useState<ProductSize[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({ name: "" });

  useEffect(() => {
    fetchSizes();
  }, []);

  const fetchSizes = async () => {
    try {
      setLoading(true);
      const response = await api.getProductSizes();
      if (response.productSizeList) {
        setSizes(response.productSizeList);
      }
    } catch (error) {
      console.error("Error fetching sizes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ name: e.target.value });
  };

  const openCreateModal = () => {
    setModalType("create");
    setEditingId(null);
    setFormData({ name: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (size: ProductSize) => {
    setModalType("edit");
    setEditingId(size._id);
    setFormData({ name: size.name });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (modalType === "create") {
        const response = await api.createProductSize(formData);
        if (response.message.includes("successfully")) {
          await fetchSizes();
          alert("Size created successfully!");
        } else {
          alert(response.message);
        }
      } else if (editingId) {
        const response = await api.updateProductSize(editingId, formData);
        if (response.message.includes("successfully")) {
          await fetchSizes();
          alert("Size updated successfully!");
        } else {
          alert(response.message);
        }
      }
      setIsModalOpen(false);
      setFormData({ name: "" });
    } catch (error) {
      console.error("Error saving size:", error);
      alert("Error saving size");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this size?")) return;

    try {
      const response = await api.deleteProductSize(id);
      if (response.message.includes("successfully")) {
        await fetchSizes();
        alert("Size deleted successfully!");
      } else {
        alert(response.message);
      }
    } catch (error) {
      console.error("Error deleting size:", error);
      alert("Error deleting size");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Common size categories
  const sizeCategories = {
    clothing: ["XS", "S", "M", "L", "XL", "XXL", "XXXL"],
    shoes: ["6", "7", "8", "9", "10", "11", "12", "13"],
    numeric: ["28", "30", "32", "34", "36", "38", "40", "42", "44"],
    oneSize: ["One Size"],
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
        <h2 className="text-3xl font-bold text-gray-900">Product Sizes</h2>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={20} />
          Create Size
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Size
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Created
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Updated
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sizes.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  No sizes found
                </td>
              </tr>
            ) : (
              sizes.map((size) => {
                // Determine size category
                let sizeCategory = "Custom";
                if (sizeCategories.clothing.includes(size.name))
                  sizeCategory = "Clothing";
                else if (sizeCategories.shoes.includes(size.name))
                  sizeCategory = "Shoes";
                else if (sizeCategories.numeric.includes(size.name))
                  sizeCategory = "Numeric";
                else if (sizeCategories.oneSize.includes(size.name))
                  sizeCategory = "One Size";

                return (
                  <tr key={size._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {size.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {sizeCategory}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          size.isDeleted
                            ? "bg-red-100 text-red-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {size.isDeleted ? "Deleted" : "Active"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(size.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(size.updatedAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => openEditModal(size)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(size._id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalType === "create" ? "Create Size" : "Edit Size"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Size Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., S, M, L, XL, 10, 32, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Enter a size identifier (e.g., S, M, L, 10, 32, One Size)
                </p>
              </div>

              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Common Sizes:
                </h4>
                <div className="grid grid-cols-4 gap-2">
                  {sizeCategories.clothing.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setFormData({ name: size })}
                      className={`px-2 py-1 text-xs rounded-md transition-colors ${
                        formData.name === size
                          ? "bg-blue-100 text-blue-800 border border-blue-300"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                  {sizeCategories.shoes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setFormData({ name: size })}
                      className={`px-2 py-1 text-xs rounded-md transition-colors ${
                        formData.name === size
                          ? "bg-blue-100 text-blue-800 border border-blue-300"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                  {sizeCategories.numeric.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setFormData({ name: size })}
                      className={`px-2 py-1 text-xs rounded-md transition-colors ${
                        formData.name === size
                          ? "bg-blue-100 text-blue-800 border border-blue-300"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                  {sizeCategories.oneSize.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setFormData({ name: size })}
                      className={`px-2 py-1 text-xs rounded-md transition-colors ${
                        formData.name === size
                          ? "bg-blue-100 text-blue-800 border border-blue-300"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 mt-6">
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
