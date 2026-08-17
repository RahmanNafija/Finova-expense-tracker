import { useState } from "react";
import "./AddExpense.css";

const API_URL = "http://localhost:5000/api/expenses";

function AddExpense({ onExpenseAdded, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    amount: "",
    category: "Food",
    date: "",
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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

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
      const response = await fetch(API_URL, {
        method: "POST",

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
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add expense."
        );
      }

      console.log(
        "Expense added successfully:",
        data
      );

      onExpenseAdded(data);

      onClose();

    } catch (error) {

      console.error(
        "Add expense error:",
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

  return (
    <div className="expense-overlay">

      <div className="expense-modal">

        {/* HEADER */}

        <div className="expense-modal-header">

          <div>

            <h2>
              Add Expense
            </h2>

            <p>
              Record a new transaction
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

              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}

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
                ? "Saving..."
                : "Save Expense"}

            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddExpense;