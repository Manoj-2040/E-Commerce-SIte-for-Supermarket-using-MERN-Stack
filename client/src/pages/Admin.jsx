import React, { useState, useEffect } from "react";
import api from "../api";
import { useUser } from "@clerk/clerk-react";
import { Navigate } from "react-router-dom";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import "jspdf-autotable";
import "./Admin.css"; // Import dedicated Admin styling

const Admin = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const allowedAdminEmails = ["anashenrya.22aim@kongu.edu"]; // List of admin-approved emails

  // Wait until Clerk has finished loading user data
  if (!isLoaded) {
    return (
      <div className='admin-container'>
        <p>Loading...</p>
      </div>
    );
  }

  // Redirect if the user is not signed in
  if (!isSignedIn) {
    return <Navigate to='/auth' replace />;
  }

  // Extract the user's primary email address
  const userEmail = user.primaryEmailAddress
    ? user.primaryEmailAddress.emailAddress
    : "";

  // If the user's email is not in the allowed list, display an access denied message
  if (!allowedAdminEmails.includes(userEmail)) {
    return (
      <div className='admin-container'>
        <h2>Access Denied</h2>
        <p>
          You do not have the required admin privileges to access this page.
        </p>
      </div>
    );
  }

  // State for controlling which tab is visible ("products" or "orders")
  const [selectedTab, setSelectedTab] = useState("products");
  // State for products and orders
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  // State for editing a product
  const [editingProductId, setEditingProductId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // State for the new product form
  const [newProductData, setNewProductData] = useState({
    name: "",
    image: "",
    description: "",
    category: "",
    price: "",
    countInStock: "",
  });

  // Fetch products when the "products" tab is selected
  useEffect(() => {
    if (selectedTab === "products") {
      api
        .get("/products")
        .then((response) => setProducts(response.data))
        .catch((error) => console.error(error));
    }
  }, [selectedTab]);

  // Fetch orders when the "orders" tab is selected
  useEffect(() => {
    if (selectedTab === "orders") {
      api
        .get("/orders")
        .then((response) => setOrders(response.data))
        .catch((error) => console.error(error));
    }
  }, [selectedTab]);

  // Delete a product
  const handleDeleteProduct = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((prod) => prod._id !== id));
    } catch (error) {
      console.error(error);
      alert("Failed to delete product");
    }
  };

  // Prepare the edit form for a product
  const handleEditClick = (product) => {
    setEditingProductId(product._id);
    setEditFormData(product);
  };

  // Handle changes in the edit form
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Submit the updated product information
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put(`/products/${editingProductId}`, {
        ...editFormData,
        price: Number(editFormData.price),
        countInStock: Number(editFormData.countInStock),
      });
      setProducts(
        products.map((prod) =>
          prod._id === editingProductId ? response.data : prod
        )
      );
      setEditingProductId(null);
      setEditFormData({});
    } catch (error) {
      console.error(error);
      alert("Failed to update product");
    }
  };

  // Handle changes in the new product form
  const handleNewProductChange = (e) => {
    const { name, value } = e.target;
    setNewProductData((prev) => ({ ...prev, [name]: value }));
  };

  // Add a new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/products", {
        ...newProductData,
        price: Number(newProductData.price),
        countInStock: Number(newProductData.countInStock),
      });
      setProducts([...products, response.data]);
      setNewProductData({
        name: "",
        image: "",
        description: "",
        category: "",
        price: "",
        countInStock: "",
      });
      alert("Product added successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to add product");
    }
  };

  // Generate PDF Report from orders data with order item names
  const generateExcelReport = () => {
    const title = "NMART Orders Report";

    const tableColumn = [
      "Order ID",
      "User ID",
      "Payment Status",
      "Total Items",
      "Items",
    ];

    const tableRows = orders.map((order) => {
      const paidStatus = order.isPaid ? "Paid" : "Not Paid";
      const paidTime = order.isPaid
        ? `\n${new Date(order.paidAt || order.createdAt).toLocaleString()}`
        : "";

      const totalItems = order.orderItems.reduce(
        (sum, item) => sum + item.qty,
        0
      );

      const itemsList = order.orderItems
        .map((item) => {
          const productName = item.product ? item.product.name : "Deleted";
          return `${productName} × ${item.qty}`;
        })
        .join("\n");

      // Important: Format rows according to columns
      return {
        "Order ID": order._id,
        "User ID": order.userId,
        "Payment Status": `${paidStatus}${paidTime}`,
        "Total Items": totalItems,
        Items: itemsList,
      };
    });

    // Create a worksheet
    const worksheet = XLSX.utils.json_to_sheet(tableRows, {
      header: tableColumn,
    });

    // Optional: Adjust column widths (make it neat)
    const wscols = [
      { wch: 20 }, // Order ID
      { wch: 20 }, // User ID
      { wch: 30 }, // Payment Status
      { wch: 15 }, // Total Items
      { wch: 40 }, // Items
    ];
    worksheet["!cols"] = wscols;

    // Create a workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, title);

    // Write and trigger download
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "NMART_Orders_Report.xlsx");
  };

  return (
    <div className='admin-container'>
      <h2>Admin Dashboard</h2>
      <div className='admin-tabs'>
        <button
          className={selectedTab === "products" ? "active" : ""}
          onClick={() => setSelectedTab("products")}>
          Products
        </button>
        <button
          className={selectedTab === "orders" ? "active" : ""}
          onClick={() => setSelectedTab("orders")}>
          Orders
        </button>
      </div>

      {selectedTab === "products" && (
        <div className='admin-section'>
          <h3>Add New Product</h3>
          <form className='add-product-form' onSubmit={handleAddProduct}>
            <input
              type='text'
              name='name'
              placeholder='Name'
              value={newProductData.name}
              onChange={handleNewProductChange}
              required
            />
            <input
              type='text'
              name='image'
              placeholder='Image URL'
              value={newProductData.image}
              onChange={handleNewProductChange}
              required
            />
            <textarea
              name='description'
              placeholder='Description'
              value={newProductData.description}
              onChange={handleNewProductChange}
              required
            />
            <input
              type='text'
              name='category'
              placeholder='Category'
              value={newProductData.category}
              onChange={handleNewProductChange}
              required
            />
            <input
              type='number'
              step='0.01'
              name='price'
              placeholder='Price'
              value={newProductData.price}
              onChange={handleNewProductChange}
              required
            />
            <input
              type='number'
              name='countInStock'
              placeholder='Stock Count'
              value={newProductData.countInStock}
              onChange={handleNewProductChange}
              required
            />
            <button type='submit'>Add Product</button>
          </form>

          <h3>All Products</h3>
          {products.length === 0 ? (
            <p>No products available.</p>
          ) : (
            <ul className='admin-product-list'>
              {products.map((product) => (
                <li key={product._id} className='admin-product-item'>
                  {editingProductId === product._id ? (
                    <form className='edit-form' onSubmit={handleEditSubmit}>
                      <input
                        type='text'
                        name='name'
                        value={editFormData.name || ""}
                        onChange={handleEditChange}
                        required
                      />
                      <input
                        type='text'
                        name='image'
                        value={editFormData.image || ""}
                        onChange={handleEditChange}
                        required
                      />
                      <textarea
                        name='description'
                        value={editFormData.description || ""}
                        onChange={handleEditChange}
                        required
                      />
                      <input
                        type='text'
                        name='category'
                        value={editFormData.category || ""}
                        onChange={handleEditChange}
                        required
                      />
                      <input
                        type='number'
                        step='0.01'
                        name='price'
                        value={editFormData.price || ""}
                        onChange={handleEditChange}
                        required
                      />
                      <input
                        type='number'
                        name='countInStock'
                        value={editFormData.countInStock || ""}
                        onChange={handleEditChange}
                        required
                      />
                      <div className='form-buttons'>
                        <button type='submit'>Save</button>
                        <button
                          type='button'
                          onClick={() => setEditingProductId(null)}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className='product-info'>
                      <img src={product.image} alt={product.name} />
                      <div className='product-details'>
                        <h4>{product.name}</h4>
                        <p>{product.description}</p>
                        <p>Category: {product.category}</p>
                        <p>Price: Rs. {product.price}</p>
                        <p>Stock: {product.countInStock}</p>
                        <div className='action-buttons'>
                          <button onClick={() => handleEditClick(product)}>
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(product._id)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {selectedTab === "orders" && (
        <div className='admin-section' style={{ minHeight: "100vh" }}>
          <h3>All Orders</h3>
          <button
            onClick={generateExcelReport}
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              border: "none",
              borderRadius: "30px",
              color: "#fff",
              cursor: "pointer",
              marginBottom: "20px",
            }}>
            Generate Excel Report
          </button>
          {orders.length === 0 ? (
            <p style={{ color: "#ccc" }}>No orders available.</p>
          ) : (
            <ul className='admin-order-list'>
              {orders.map((order) => (
                <li key={order._id} className='admin-order-item'>
                  <p>
                    <strong>Order ID:</strong> {order._id}
                  </p>
                  <p>
                    <strong>User ID:</strong> {order.userId}
                  </p>
                  <p>
                    <strong>Paid:</strong>{" "}
                    {order.isPaid
                      ? `Yes (at ${new Date(order.createdAt).toLocaleString()})`
                      : "No"}
                  </p>
                  <div>
                    <strong>Items:</strong>
                    <ul>
                      {order.orderItems.map((item, idx) => (
                        <li key={idx}>
                          {item.qty} x{" "}
                          {item.product ? item.product.name : "Product Deleted"}
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Admin;
