import { useState } from "react";
import "./Expenses.css";

const API_URL =
  "https://finova-expense-tracker.onrender.com/api/expenses";

function AddExpense({
  onClose,
  onExpenseAdded,
  editingExpense,
}) {
  // ========================================
  // CATEGORY LIST
  // ========================================

  const categories = [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Health",
    "Education",
    "Other",
  ];

  // ========================================
  // INITIAL FORM DATA
  // ========================================

  const [formData, setFormData] = useState({
    title: editingExpense?.title || "",

    amount:
      editingExpense?.amount !== undefined
        ? editingExpense.amount
        : "",

    category:
      editingExpense?.category &&
      categories.includes(editingExpense.category)
        ? editingExpense.category
        : "Food",

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
  // SUBMIT FORM
  // ========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // ========================================
    // TITLE VALIDATION
    // ========================================

    const trimmedTitle = formData.title.trim();

    if (!trimmedTitle) {
      setError("Expense title is required.");
      return;
    }

    // ========================================
    // AMOUNT VALIDATION
    // ========================================

    const numericAmount = Number(formData.amount);

    if (
      formData.amount === "" ||
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      setError("Please enter a valid amount.");
      return;
    }

    // ========================================
    // CATEGORY VALIDATION
    // ========================================

    if (!categories.includes(formData.category)) {
      setError("Please select a valid category.");
      return;
    }

    // ========================================
    // DATE VALIDATION
    // ========================================

    if (!formData.date) {
      setError("Please select a date.");
      return;
    }

    // ========================================
    // START LOADING
    // ========================================

    setLoading(true);

    try {
      // ========================================
      // GET LOGIN TOKEN
      // ========================================

      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "Your session has expired. Please login again."
        );
      }

      // ========================================
      // CREATE OR UPDATE
      // ========================================

      const isEditing = Boolean(editingExpense);

      const url = isEditing
        ? `${API_URL}/${editingExpense._id}`
        : API_URL;

      const method = isEditing
        ? "PUT"
        : "POST";

      // ========================================
      // SEND REQUEST
      // ========================================

      const response = await fetch(url, {
        method,

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          title: trimmedTitle,
          amount: numericAmount,
          category: formData.category,
          date: formData.date,
        }),
      });

      // ========================================
      // READ RESPONSE SAFELY
      // ========================================

      const contentType =
        response.headers.get("content-type") || "";

      let data;

      if (
        contentType.includes(
          "application/json"
        )
      ) {
        data = await response.json();
      } else {
        const text = await response.text();

        console.error(
          "Server returned non-JSON response:",
          text
        );

        throw new Error(
          "Server returned an invalid response. Please try again."
        );
      }

      // ========================================
      // HANDLE API ERROR
      // ========================================

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to save expense."
        );
      }

      // ========================================
      // GET SAVED EXPENSE
      // ========================================

      const savedExpense =
        data.expense || data;

      // ========================================
      // SEND EXPENSE TO PARENT
      // ========================================

      if (onExpenseAdded) {
        onExpenseAdded(savedExpense);
      }

      // ========================================
      // CLOSE MODAL
      // ========================================

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

        {/* ========================================
            HEADER
        ======================================== */}

        <div className="expense-modal-header">

          <div>

            <h2>
              {editingExpense
                ? "Edit Expense"
                : "Add Expense"}
            </h2>

            <p>
              {editingExpense
                ? "Update your transaction details"
                : "Record a new transaction"}
            </p>

          </div>

          <button
            type="button"
            className="close-btn"
            onClick={onClose}
            disabled={loading}
            aria-label="Close"
          >
            ×
          </button>

        </div>


        {/* ========================================
            ERROR
        ======================================== */}

        {error && (
          <div className="expense-error">
            ⚠️ {error}
          </div>
        )}


        {/* ========================================
            FORM
        ======================================== */}

        <form
          className="expense-form"
          onSubmit={handleSubmit}
        >

          {/* ========================================
              EXPENSE TITLE
          ======================================== */}

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
              disabled={loading}
            />

          </div>


          {/* ========================================
              AMOUNT
          ======================================== */}

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
              min="0.01"
              step="0.01"
              disabled={loading}
            />

          </div>


          {/* ========================================
              CATEGORY
          ======================================== */}

          <div className="expense-form-group">

            <label htmlFor="expense-category">
              Category
            </label>

            <div className="expense-select-wrapper">

              <select
                id="expense-category"
                name="category"
                className="expense-category-select"
                value={formData.category}
                onChange={handleChange}
                disabled={loading}
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

          </div>


          {/* ========================================
              DATE
          ======================================== */}

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
              disabled={loading}
            />

          </div>


          {/* ========================================
              ACTION BUTTONS
          ======================================== */}

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
                ? "Save Changes"
                : "Save Expense"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default AddExpense;