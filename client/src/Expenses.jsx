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

  const categories = [
    "All",
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Other",
  ];

  // ========================================
  // FILTER EXPENSES
  // ========================================

  const filteredExpenses = useMemo(() => {
    return expenses.filter((expense) => {
      const title = expense.title || "";

      const matchesSearch = title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        category === "All" ||
        expense.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [expenses, search, category]);

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

    return new Date(date).toLocaleDateString(
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
             EXPENSE TABLE
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

            {filteredExpenses.map(
              (expense) => (

                <div
                  className="expense-row"
                  key={expense._id}
                >

                  {/* EXPENSE */}

                  <div className="expense-name">

                    <div className="expense-icon">
                      {getCategoryIcon(
                        expense.category
                      )}
                    </div>

                    <strong>
                      {expense.title}
                    </strong>

                  </div>


                  {/* CATEGORY */}

                  <span className="expense-category">
                    {expense.category}
                  </span>


                  {/* DATE */}

                  <span className="expense-date">
                    {formatDate(
                      expense.date
                    )}
                  </span>


                  {/* AMOUNT */}

                  <strong className="expense-amount">
                    -
                    {formatMoney(
                      Number(
                        expense.amount || 0
                      )
                    )}
                  </strong>


                  {/* ACTIONS */}

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

              )
            )}

          </div>

        )}

      </section>

    </div>
  );
}

export default Expenses;