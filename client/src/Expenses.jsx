import { useMemo, useState } from "react";
import "./Expenses.css";

function Expenses({
  expenses,
  onBack,
  onEdit,
  onDelete,
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  // ========================================
  // CATEGORIES
  // ========================================

  const categories = [
    "All",
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
  // MAKE SURE EXPENSES IS AN ARRAY
  // ========================================

  const expenseList = useMemo(() => {
    if (Array.isArray(expenses)) {
      return expenses;
    }

    if (Array.isArray(expenses?.expenses)) {
      return expenses.expenses;
    }

    return [];
  }, [expenses]);

  // ========================================
  // FILTER EXPENSES
  // ========================================

  const filteredExpenses = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return expenseList.filter((expense) => {
      const title = String(expense.title || "").toLowerCase();

      const expenseCategory = String(
        expense.category || ""
      ).trim();

      // Search filter
      const matchesSearch =
        title.includes(searchText);

      // Category filter
      const matchesCategory =
        category === "All" ||
        expenseCategory === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [expenseList, search, category]);

  // ========================================
  // TOTAL
  // ========================================

  const total = filteredExpenses.reduce(
    (sum, expense) =>
      sum + Number(expense.amount || 0),
    0
  );

  // ========================================
  // FORMAT MONEY
  // ========================================

  const formatMoney = (amount) => {
    return `৳${Number(amount).toFixed(2)}`;
  };

  // ========================================
  // FORMAT DATE
  // ========================================

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    const formattedDate = new Date(date);

    if (isNaN(formattedDate.getTime())) {
      return "—";
    }

    return formattedDate.toLocaleDateString(
      "en-US",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ========================================
  // CATEGORY ICON
  // ========================================

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Food":
        return "🍴";

      case "Transport":
        return "🚗";

      case "Shopping":
        return "🛍️";

      case "Bills":
        return "🧾";

      case "Entertainment":
        return "🎮";

      case "Health":
        return "❤️";

      case "Education":
        return "📚";

      case "Other":
        return "•••";

      default:
        return "•••";
    }
  };

  // ========================================
  // UI
  // ========================================

  return (
    <div className="expenses-page">

      {/* ========================================
          HEADER
      ======================================== */}

      <header className="expenses-header">

        <button
          type="button"
          className="back-btn"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

        <h1>
          All Expenses
        </h1>

        <p>
          Manage and review your transactions
        </p>

      </header>


      {/* ========================================
          SUMMARY
      ======================================== */}

      <section className="expenses-summary">

        {/* SHOWING */}

        <div className="summary-card">

          <span>
            Showing
          </span>

          <strong>
            {filteredExpenses.length}
          </strong>

          <small>
            expenses
          </small>

        </div>


        {/* TOTAL */}

        <div className="summary-card">

          <span>
            Total
          </span>

          <strong>
            {formatMoney(total)}
          </strong>

          <small>
            filtered amount
          </small>

        </div>

      </section>


      {/* ========================================
          FILTER BAR
      ======================================== */}

      <section className="filter-bar">

        {/* SEARCH */}

        <div className="search-box">

          <span className="search-icon">
            🔍
          </span>

          <input
            type="text"
            placeholder="Search expenses..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />

        </div>


        {/* CATEGORY */}

        <div className="category-select-wrapper">

          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
            className="category-select"
          >

            {categories.map((item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            ))}

          </select>

        </div>

      </section>


      {/* ========================================
          EXPENSE TABLE
      ======================================== */}

      <section className="expenses-card">

        {filteredExpenses.length === 0 ? (

          /* ========================================
             EMPTY STATE
          ======================================== */

          <div className="no-expenses">

            <div className="empty-icon">
              🌱
            </div>

            <h2>
              No expenses found
            </h2>

            <p>
              Try changing your search or
              category filter.
            </p>

          </div>

        ) : (

          /* ========================================
             TABLE
          ======================================== */

          <div className="expense-table">

            {/* TABLE HEADER */}

            <div className="expense-table-header">

              <span>
                Expense
              </span>

              <span>
                Category
              </span>

              <span>
                Date
              </span>

              <span>
                Amount
              </span>

              <span>
                Actions
              </span>

            </div>


            {/* EXPENSE ROWS */}

            {filteredExpenses.map((expense) => {

              const expenseCategory =
                String(
                  expense.category || "Other"
                ).trim();

              return (
                <div
                  className="expense-row"
                  key={expense._id}
                >

                  {/* ========================================
                      EXPENSE
                  ======================================== */}

                  <div className="expense-name">

                    <div className="expense-icon">
                      {getCategoryIcon(
                        expenseCategory
                      )}
                    </div>

                    <strong>
                      {expense.title || "Untitled Expense"}
                    </strong>

                  </div>


                  {/* ========================================
                      CATEGORY
                  ======================================== */}

                  <span className="expense-category">
                    {expenseCategory}
                  </span>


                  {/* ========================================
                      DATE
                  ======================================== */}

                  <span className="expense-date">
                    {formatDate(
                      expense.date
                    )}
                  </span>


                  {/* ========================================
                      AMOUNT
                  ======================================== */}

                  <strong className="expense-amount">
                    -
                    {formatMoney(
                      Number(
                        expense.amount || 0
                      )
                    )}
                  </strong>


                  {/* ========================================
                      ACTIONS
                  ======================================== */}

                  <div className="expense-actions">

                    {/* EDIT */}

                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() =>
                        onEdit(expense)
                      }
                      title="Edit expense"
                    >
                      ✏️
                    </button>


                    {/* DELETE */}

                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() =>
                        onDelete(
                          expense._id
                        )
                      }
                      title="Delete expense"
                    >
                      🗑️
                    </button>

                  </div>

                </div>
              );
            })}

          </div>

        )}

      </section>

    </div>
  );
}

export default Expenses;