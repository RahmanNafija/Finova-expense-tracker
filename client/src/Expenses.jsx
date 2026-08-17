import { useMemo, useState } from "react";
import "./Expenses.css";

function Expenses({
  expenses,
  onBack,
  onEdit,
  onDelete,
}) {
  const [search, setSearch] =
    useState("");

  const [category, setCategory] =
    useState("All");

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
  // FILTER
  // ========================================

  const filteredExpenses =
    useMemo(() => {
      return expenses.filter(
        (expense) => {
          const matchesSearch =
            expense.title
              .toLowerCase()
              .includes(
                search.toLowerCase()
              );

          const matchesCategory =
            category === "All" ||
            expense.category ===
              category;

          return (
            matchesSearch &&
            matchesCategory
          );
        }
      );
    }, [
      expenses,
      search,
      category,
    ]);

  // ========================================
  // TOTAL
  // ========================================

  const total =
    filteredExpenses.reduce(
      (sum, expense) =>
        sum +
        Number(
          expense.amount
        ),
      0
    );

  // ========================================
  // FORMAT MONEY
  // ========================================

  const formatMoney = (
    amount
  ) => {
    return `৳${amount.toFixed(
      2
    )}`;
  };

  // ========================================
  // FORMAT DATE
  // ========================================

  const formatDate = (
    date
  ) => {
    return new Date(
      date
    ).toLocaleDateString(
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

  const getCategoryIcon = (
    category
  ) => {
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

      default:
        return "•••";
    }
  };

  // ========================================
  // UI
  // ========================================

  return (
    <div className="expenses-page">

      {/* HEADER */}

      <header className="expenses-header">

        <button
          className="back-btn"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>

        <h1>
          All Expenses
        </h1>

        <p>
          Manage and review
          your transactions
        </p>

      </header>


      {/* SUMMARY */}

      <section className="expenses-summary">

        <div>

          <span>
            Showing
          </span>

          <strong>
            {
              filteredExpenses.length
            }
          </strong>

          <small>
            expenses
          </small>

        </div>


        <div>

          <span>
            Total
          </span>

          <strong>
            {formatMoney(
              total
            )}
          </strong>

          <small>
            filtered amount
          </small>

        </div>

      </section>


      {/* FILTER */}

      <section className="filter-bar">

        <div className="search-box">

          <span>
            🔍
          </span>

          <input
            type="text"
            placeholder="Search expenses..."
            value={search}
            onChange={(e) =>
              setSearch(
                e.target.value
              )
            }
          />

        </div>


        <select
          value={category}
          onChange={(e) =>
            setCategory(
              e.target.value
            )
          }
        >

          {categories.map(
            (item) => (
              <option
                key={item}
                value={item}
              >
                {item}
              </option>
            )
          )}

        </select>

      </section>


      {/* EXPENSES */}

      <section className="expenses-card">

        {filteredExpenses.length ===
        0 ? (

          <div className="no-expenses">

            <div>
              🌱
            </div>

            <h2>
              No expenses found
            </h2>

            <p>
              Try changing your
              search or category
              filter.
            </p>

          </div>

        ) : (

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


            {/* ROWS */}

            {filteredExpenses.map(
              (expense) => (

                <div
                  className="expense-row"
                  key={
                    expense._id
                  }
                >

                  <div className="expense-name">

                    <div className="expense-icon">
                      {getCategoryIcon(
                        expense.category
                      )}
                    </div>

                    <strong>
                      {
                        expense.title
                      }
                    </strong>

                  </div>


                  <span className="expense-category">
                    {
                      expense.category
                    }
                  </span>


                  <span className="expense-date">
                    {formatDate(
                      expense.date
                    )}
                  </span>


                  <strong className="expense-amount">
                    -
                    {formatMoney(
                      Number(
                        expense.amount
                      )
                    )}
                  </strong>


                  <div className="expense-actions">

                    <button
                      className="edit-btn"
                      onClick={() =>
                        onEdit(
                          expense
                        )
                      }
                      title="Edit expense"
                    >
                      ✏️
                    </button>

                    <button
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