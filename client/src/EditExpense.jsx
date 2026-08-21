import { useState } from "react";
import "./AddExpense.css";

const API_URL = "https://finova-expense-tracker.onrender.com";

function EditExpense({ expense, onExpenseUpdated, onClose }) {
  const [formData, setFormData] = useState({
    title: expense.title || "",
    amount: expense.amount || "",
    category: expense.category || "Food",
    date: expense.date
      ? new Date(expense.date).toISOString().split("T")[0]
      : "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Other",
  ];

  // ========================================
  // HANDLE INPUT
  // ========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  // ========================================
  // UPDATE EXPENSE
  // ========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // Validation
    if (
      !formData.title ||
      !formData.amount ||
      !formData.category ||
      !formData.date
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (Number(formData.amount) <= 0) {
      setError("Amount must be greater than 0.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      setError("You are not logged in. Please log in again.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/${expense._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            title: formData.title,
            amount: Number(formData.amount),
            category: formData.category,
            date: formData.date,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update expense."
        );
      }

      console.log(
        "Expense updated successfully:",
        data
      );

      // Send updated expense to Dashboard
      onExpenseUpdated(data);

      // Close modal
      onClose();

    } catch (error) {
      console.error(
        "Update expense error:",
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
    <div className="expense-overlay">

      <div className="expense-modal">

        {/* HEADER */}

        <div className="expense-modal-header">

          <div>

            <h2>
              Edit Expense
            </h2>

            <p>
              Update your transaction details
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

        {/* ERROR */}

        {error && (
          <div className="expense-error">
            ⚠️ {error}
          </div>
        )}

        {/* FORM */}

        <form
          className="expense-form"
          onSubmit={handleSubmit}
        >

          {/* TITLE */}

          <div className="form-group">

            <label>
              Expense title
            </label>

            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Lunch"
            />

          </div>

          {/* AMOUNT */}

          <div className="form-group">

            <label>
              Amount
            </label>

            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              placeholder="e.g. 500"
              min="0"
              step="0.01"
            />

          </div>

          {/* CATEGORY */}

          <div className="form-group">

            <label>
              Category
            </label>

            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >

              {categories.map(
                (category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                )
              )}

            </select>

          </div>

          {/* DATE */}

          <div className="form-group">

            <label>
              Date
            </label>

            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />

          </div>

          {/* BUTTONS */}

          <div className="expense-actions">

            <button
              type="button"
              className="cancel-btn"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="save-expense-btn"
              disabled={loading}
            >
              {loading
                ? "Updating..."
                : "Save Changes"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default EditExpense;