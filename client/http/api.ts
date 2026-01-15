// src/http/api.ts
const API_URL = "http://localhost:3001/api/v1";

// src/http/api.ts - Add these interfaces and functions
export interface User {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  password?: string;
}

export interface ProductCategory {
  _id: string;
  name: string;
  image: string | any;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductColor {
  _id: string;
  name: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductSize {
  _id: string;
  name: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Product {
  _id: string;
  name: string;
  price: number;
  discountedPrice: number;
  description: string;
  tag: string;
  mainImage: string;
  hoverImage: string;
  stockCount: number;
  productCategoryId: ProductCategory | string;
  productColors: (ProductColor | string)[];
  productSizes: (ProductSize | string)[];
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface DisplayProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  mainImage: string;
  hoverImage: string;
  colors: string[];
  sizes: string[];
  hasTimer?: boolean;
  isNew?: boolean;
  description?: string;
  stockInfo?: string;
  isBestSeller?: boolean;
  images?: string[];
}

export interface CreateProductData {
  name: string;
  price: string | number;
  discountedPrice: string | number;
  description: string;
  tag: string;
  mainImage: string;
  hoverImage: string;
  stockCount: string | number;
  productCategoryId: string;
  productColors: string[];
  productSizes: string[];
}

export interface ApiResponse<T> {
  message: string;
  userList?: T[];
  user?: T;
  productList?: T[];
  productCategoryList?: T[];
  productColorList?: T[];
  productSizeList?: T[];
  product?: T;
  productCategory?: T;
  productColor?: T;
  productSize?: T;
}

export const convertToDisplayProduct = (product: Product): DisplayProduct => {
  // Calculate discount percentage if discountedPrice exists
  const discount =
    product.discountedPrice && product.discountedPrice !== product.price
      ? `-${Math.round(
          ((product.price - product.discountedPrice) / product.price) * 100
        )}%`
      : undefined;

  // Get color names from productColors array
  const colors = product.productColors.map((color) =>
    typeof color === "object" ? color.name : "Unknown"
  );

  // Get size names from productSizes array
  const sizes = product.productSizes.map((size) =>
    typeof size === "object" ? size.name : "Unknown"
  );

  // Determine if product is new (created within last 7 days)
  const isNew =
    new Date(product.createdAt) >
    new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  // Determine if product is a best seller (based on stock count or tag)
  const isBestSeller = product.tag === "best seller" || product.stockCount < 50;

  // Create stock info message
  const stockInfo =
    product.stockCount < 10
      ? `${product.stockCount}`
      : product.stockCount < 50
      ? `${product.stockCount}`
      : undefined;

  return {
    id: product._id,
    name: product.name,
    price: product.discountedPrice || product.price,
    originalPrice: product.discountedPrice ? product.price : undefined,
    discount,
    mainImage: product.mainImage,
    hoverImage: product.hoverImage,
    colors,
    sizes,
    hasTimer: product.tag === "sale",
    isNew,
    description: product.description,
    stockInfo: stockInfo
      ? `${stockInfo} people have this in their carts`
      : undefined,
    isBestSeller,
    images: [product.mainImage, product.hoverImage].filter(Boolean),
  };
};

export const api = {
  // Product endpoints
  async getProducts(): Promise<ApiResponse<Product>> {
    const response = await fetch(`${API_URL}/products/get-products`);
    return response.json();
  },

  async createProduct(
    productData: CreateProductData
  ): Promise<ApiResponse<Product>> {
    const response = await fetch(`${API_URL}/products/create-product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });
    return response.json();
  },

  async updateProduct(
    id: string,
    productData: Partial<CreateProductData>
  ): Promise<ApiResponse<Product>> {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    });
    return response.json();
  },

  async deleteProduct(id: string): Promise<ApiResponse<Product>> {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },

  // Category endpoints
  async getProductCategories(): Promise<ApiResponse<ProductCategory>> {
    const response = await fetch(`${API_URL}/products/get-product-categories`);
    return response.json();
  },

  async createProductCategory(categoryData: {
    name: string;
    image?: string;
  }): Promise<ApiResponse<ProductCategory>> {
    const response = await fetch(
      `${API_URL}/products/create-product-category`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      }
    );
    return response.json();
  },

  async updateProductCategory(
    id: string,
    categoryData: { name: string; image?: string }
  ): Promise<ApiResponse<ProductCategory>> {
    const response = await fetch(`${API_URL}/products/categories/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
    });
    return response.json();
  },

  async deleteProductCategory(
    id: string
  ): Promise<ApiResponse<ProductCategory>> {
    const response = await fetch(`${API_URL}/products/categories/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },

  // Color endpoints
  async getProductColors(): Promise<ApiResponse<ProductColor>> {
    const response = await fetch(`${API_URL}/products/get-product-colors`);
    return response.json();
  },

  async createProductColor(colorData: {
    name: string;
  }): Promise<ApiResponse<ProductColor>> {
    const response = await fetch(`${API_URL}/products/create-product-color`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(colorData),
    });
    return response.json();
  },

  async updateProductColor(
    id: string,
    colorData: { name: string }
  ): Promise<ApiResponse<ProductColor>> {
    const response = await fetch(`${API_URL}/products/colors/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(colorData),
    });
    return response.json();
  },

  async deleteProductColor(id: string): Promise<ApiResponse<ProductColor>> {
    const response = await fetch(`${API_URL}/products/colors/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },

  // Size endpoints
  async getProductSizes(): Promise<ApiResponse<ProductSize>> {
    const response = await fetch(`${API_URL}/products/get-product-sizes`);
    return response.json();
  },

  async createProductSize(sizeData: {
    name: string;
  }): Promise<ApiResponse<ProductSize>> {
    const response = await fetch(`${API_URL}/products/create-product-size`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sizeData),
    });
    return response.json();
  },

  async updateProductSize(
    id: string,
    sizeData: { name: string }
  ): Promise<ApiResponse<ProductSize>> {
    const response = await fetch(`${API_URL}/products/sizes/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(sizeData),
    });
    return response.json();
  },

  async deleteProductSize(id: string): Promise<ApiResponse<ProductSize>> {
    const response = await fetch(`${API_URL}/products/sizes/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },

  async getDisplayProducts(): Promise<DisplayProduct[]> {
    try {
      const response = await this.getProducts();
      if (response.productList) {
        return response.productList.map(convertToDisplayProduct);
      }
      return [];
    } catch (error) {
      console.error("Error getting display products:", error);
      return [];
    }
  },

  // User endpoints
  async getUsers(): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_URL}/auth/get-users`);
    return response.json();
  },

  async createUser(userData: CreateUserData): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  async updateUser(
    id: string,
    userData: UpdateUserData
  ): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_URL}/auth/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  async deleteUser(id: string): Promise<ApiResponse<User>> {
    const response = await fetch(`${API_URL}/auth/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },
};
