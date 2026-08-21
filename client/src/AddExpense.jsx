import { useState } from "react";
import "./Expenses.css";

const API_URL = "http://localhost:5000/api/expenses";

function AddExpense({ onClose, onExpenseAdded, editingExpense }) {
  const [formData, setFormData] = useState({
    title: editingExpense?.title || "",
    amount: editingExpense?.amount || "",
    category: editingExpense?.category || "Food",
    date: editingExpense?.date
      ? editingExpense.date.split("T")[0]
      : "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ========================================
  // HANDLE INPUT CHANGE
  // ========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  // ========================================
  // SUBMIT
  // ========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // Basic validation
    if (!formData.title.trim()) {
      setError("Expense title is required.");
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (!formData.date) {
      setError("Please select a date.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      const url = editingExpense
        ? `${API_URL}/${editingExpense._id}`
        : API_URL;

      const method = editingExpense ? "PUT" : "POST";

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          title: formData.title.trim(),
          amount: Number(formData.amount),
          category: formData.category,
          date: formData.date,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save expense."
        );
      }

      // Send newly created/updated expense
      if (onExpenseAdded) {
        onExpenseAdded(data.expense || data);
      }

      // Close modal
      onClose();

    } catch (error) {
      console.error(
        "Save expense error:",
        error
      );

      setError(
        error.message ||
          "Something went wrong. Please try again."
      );

    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // UI
  // ========================================

  return (
    <div
      className="expense-overlay"
      onClick={onClose}
    >

      <div
        className="expense-modal"
        onClick={(event) =>
          event.stopPropagation()
        }
      >

        {/* ================= HEADER ================= */}

        <div className="expense-modal-header">

          <div>
            <h2>
              {editingExpense
                ? "Edit Expense"
                : "Add Expense"}
            </h2>

            <p>
              {editingExpense
                ? "Update your transaction"
                : "Record a new transaction"}
            </p>
          </div>

          <button
            type="button"
            className="close-btn"
            onClick={onClose}
          >
            ×
          </button>

        </div>


        {/* ================= ERROR ================= */}

        {error && (
          <div className="expense-error">
            ⚠️ {error}
          </div>
        )}


        {/* ================= FORM ================= */}

        <form
          className="expense-form"
          onSubmit={handleSubmit}
        >

          {/* TITLE */}

          <div className="expense-form-group">

            <label htmlFor="expense-title">
              Expense title
            </label>

            <input
              id="expense-title"
              type="text"
              name="title"
              placeholder="e.g. Lunch"
              value={formData.title}
              onChange={handleChange}
              autoComplete="off"
            />

          </div>


          {/* AMOUNT */}

          <div className="expense-form-group">

            <label htmlFor="expense-amount">
              Amount
            </label>

            <input
              id="expense-amount"
              type="number"
              name="amount"
              placeholder="e.g. 500"
              value={formData.amount}
              onChange={handleChange}
              min="0"
              step="0.01"
            />

          </div>

{/* CATEGORY */}

<div className="expense-form-group">

  <label htmlFor="expense-category">
    Category
  </label>

  <div className="expense-select-wrapper">

    <select
      id="expense-category"
      name="category"
      value={formData.category}
      onChange={handleChange}
    >
      <option value="Food">
        Food
      </option>

      <option value="Transport">
        Transport
      </option>

      <option value="Shopping">
        Shopping
      </option>

      <option value="Bills">
        Bills
      </option>

      <option value="Entertainment">
        Entertainment
      </option>

      <option value="Health">
        Health
      </option>

      <option value="Education">
        Education
      </option>

      <option value="Other">
        Other
      </option>
    </select>

  </div>

</div>


          {/* DATE */}

          <div className="expense-form-group">

            <label htmlFor="expense-date">
              Date
            </label>

            <input
              id="expense-date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />

          </div>


          {/* ACTIONS */}

          <div className="expense-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-expense-btn"
              disabled={loading}
            >

              {loading
                ? "Saving..."
                : editingExpense
                ? "Update Expense"
                : "Save Expense"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddExpense;