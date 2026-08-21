import { useEffect, useState } from "react";
import "./App.css";

import AddExpense from "./AddExpense";
import EditExpense from "./EditExpense";
import Expenses from "./Expenses";

const API_URL = "https://finova-expense-tracker.onrender.com";

function Dashboard({ user, onLogout }) {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [deletingId, setDeletingId] = useState(null);

  const [showAddExpense, setShowAddExpense] =
    useState(false);

  const [editingExpense, setEditingExpense] =
    useState(null);

  // ========================================
  // SHOW ALL EXPENSES PAGE
  // ========================================

  const [showAllExpenses, setShowAllExpenses] =
    useState(false);

  // ========================================
  // FETCH EXPENSES
  // ========================================

  const fetchExpenses = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      if (!token) {
        console.error(
          "No login token found."
        );

        return;
      }

      const response = await fetch(
        API_URL,
        {
          method: "GET",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to fetch expenses"
        );
      }

      setExpenses(data);

    } catch (error) {
      console.error(
        "Error fetching expenses:",
        error
      );

    } finally {
      setLoading(false);
    }
  };

  // ========================================
  // LOAD EXPENSES
  // ========================================

  useEffect(() => {
    fetchExpenses();
  }, []);

  // ========================================
  // ADD EXPENSE
  // ========================================

  const handleExpenseAdded = (
    newExpense
  ) => {
    setExpenses(
      (previousExpenses) => [
        newExpense,
        ...previousExpenses,
      ]
    );

    setShowAddExpense(false);
  };

  // ========================================
  // EDIT EXPENSE
  // ========================================

  const handleExpenseUpdated = (
    updatedExpense
  ) => {
    setExpenses(
      (previousExpenses) =>
        previousExpenses.map(
          (expense) =>
            expense._id ===
            updatedExpense._id
              ? updatedExpense
              : expense
        )
    );

    setEditingExpense(null);
  };

  // ========================================
  // DELETE EXPENSE
  // ========================================

  const handleDeleteExpense = async (
    expenseId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this expense?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(expenseId);

      const token =
        localStorage.getItem("token");

      if (!token) {
        throw new Error(
          "You are not logged in."
        );
      }

      const response = await fetch(
        `${API_URL}/${expenseId}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete expense"
        );
      }

      setExpenses(
        (previousExpenses) =>
          previousExpenses.filter(
            (expense) =>
              expense._id !== expenseId
          )
      );

    } catch (error) {
      console.error(
        "Delete expense error:",
        error
      );

      alert(
        error.message ||
          "Something went wrong while deleting the expense."
      );

    } finally {
      setDeletingId(null);
    }
  };

  // ========================================
  // IF ALL EXPENSES PAGE IS OPEN
  // ========================================

  if (showAllExpenses) {
    return (
      <Expenses
        expenses={expenses}

        onBack={() =>
          setShowAllExpenses(false)
        }

        onEdit={(expense) => {
          setEditingExpense(expense);
          setShowAllExpenses(false);
        }}

        onDelete={handleDeleteExpense}

        onAddExpense={() =>
          setShowAddExpense(true)
        }

        user={user}

        onLogout={onLogout}
      />
    );
  }

  // ========================================
  // CALCULATIONS
  // ========================================

  const totalSpent =
    expenses.reduce(
      (total, expense) =>
        total +
        Number(expense.amount),
      0
    );

  const currentDate =
    new Date();

  const monthlyExpenses =
    expenses.filter(
      (expense) => {
        const expenseDate =
          new Date(
            expense.date
          );

        return (
          expenseDate.getMonth() ===
            currentDate.getMonth() &&
          expenseDate.getFullYear() ===
            currentDate.getFullYear()
        );
      }
    );

  const monthlySpending =
    monthlyExpenses.reduce(
      (total, expense) =>
        total +
        Number(expense.amount),
      0
    );

  const recentExpenses =
    [...expenses]
      .sort(
        (a, b) =>
          new Date(b.date) -
          new Date(a.date)
      )
      .slice(0, 5);

  // ========================================
  // CATEGORIES
  // ========================================

  const categories = [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Other",
  ];

  const categoryTotals =
    categories.map(
      (category) => {
        const total =
          expenses
            .filter(
              (expense) =>
                expense.category ===
                category
            )
            .reduce(
              (sum, expense) =>
                sum +
                Number(
                  expense.amount
                ),
              0
            );

        return {
          name: category,
          total,
        };
      }
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
  // DASHBOARD UI
  // ========================================

  return (
    <div className="app">

      {/* HEADER */}

      <header className="header">

        <div className="brand">

          <div className="brand-icon">
            S
          </div>

          <div>
            <h2>
              Finova
            </h2>

            <span>
              Smart Finance,
              Better Future
            </span>
          </div>

        </div>

        <div className="header-right">

          <span>
            Hi, {user.name}
          </span>

          <button
            className="logout-btn"
            onClick={
              onLogout
            }
          >
            Logout
          </button>

          <button
            className="add-expense-btn"
            onClick={() =>
              setShowAddExpense(
                true
              )
            }
          >
            + Add Expense
          </button>

        </div>

      </header>


      {/* MAIN */}

      <main className="dashboard">

        {/* WELCOME */}

        <section className="welcome-section">

          <div>

            <p className="welcome-text">
              WELCOME BACK ✨
            </p>

            <h1>
              Here's your
              financial
              overview 👋
            </h1>

            <p className="subtitle">
              Track your
              spending, save
              smarter, and
              achieve your
              financial goals.
            </p>

          </div>

          <div className="date-badge">

            📅{" "}

            {currentDate.toLocaleDateString(
              "en-US",
              {
                month:
                  "long",
                year:
                  "numeric",
              }
            )}

          </div>

        </section>


        {/* STATS */}

        <section className="stats-grid">

          <div className="stat-card">

            <div className="stat-icon green">
              💳
            </div>

            <div className="stat-content">

              <span>
                Total Spent
              </span>

              <h2>
                {loading
                  ? "Loading..."
                  : formatMoney(
                      totalSpent
                    )}
              </h2>

              <small>
                All time
              </small>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon blue">
              📈
            </div>

            <div className="stat-content">

              <span>
                Monthly Spending
              </span>

              <h2>
                {loading
                  ? "Loading..."
                  : formatMoney(
                      monthlySpending
                    )}
              </h2>

              <small>
                Current month
              </small>

            </div>

          </div>


          <div className="stat-card">

            <div className="stat-icon purple">
              🧾
            </div>

            <div className="stat-content">

              <span>
                Transactions
              </span>

              <h2>
                {loading
                  ? "..."
                  : expenses.length}
              </h2>

              <small>
                Recorded expenses
              </small>

            </div>

          </div>

        </section>


        {/* CONTENT */}

        <section className="content-grid">

          {/* RECENT EXPENSES */}

          <div className="panel recent-panel">

            <div className="panel-header">

              <div>

                <h2>
                  Recent Expenses
                </h2>

                <p>
                  Your latest
                  transactions
                </p>

              </div>

              <button
                className="view-all"
                onClick={() =>
                  setShowAllExpenses(
                    true
                  )
                }
              >
                View all →
              </button>

            </div>


            {loading ? (

              <div className="empty-state">
                Loading
                expenses...
              </div>

            ) : recentExpenses.length ===
              0 ? (

              <div className="empty-state">

                <div className="empty-icon">
                  🌱
                </div>

                <h3>
                  No expenses yet
                </h3>

                <p>
                  Add your first
                  expense and
                  start keeping
                  track of where
                  your money goes.
                </p>

              </div>

            ) : (

              <div className="expense-list">

                {recentExpenses.map(
                  (expense) => (

                    <div
                      className="expense-item"
                      key={
                        expense._id
                      }
                    >

                      <div className="expense-left">

                        <div className="category-icon">
                          {getCategoryIcon(
                            expense.category
                          )}
                        </div>

                        <div>

                          <h3>
                            {
                              expense.title
                            }
                          </h3>

                          <p>
                            {
                              expense.category
                            }
                            {" • "}
                            {formatDate(
                              expense.date
                            )}
                          </p>

                        </div>

                      </div>


                      <div className="expense-right">

                        <strong>
                          -
                          {formatMoney(
                            Number(
                              expense.amount
                            )
                          )}
                        </strong>

                        <button
                          className="edit-expense-btn"
                          onClick={() =>
                            setEditingExpense(
                              expense
                            )
                          }
                          title="Edit expense"
                        >
                          ✏️
                        </button>

                        <button
                          className="delete-expense-btn"
                          onClick={() =>
                            handleDeleteExpense(
                              expense._id
                            )
                          }
                          disabled={
                            deletingId ===
                            expense._id
                          }
                          title="Delete expense"
                        >
                          {deletingId ===
                          expense._id
                            ? "..."
                            : "🗑️"}
                        </button>

                      </div>

                    </div>

                  )
                )}

              </div>

            )}

          </div>


          {/* CATEGORIES */}

          <div className="panel categories-panel">

            <div className="panel-header">

              <div>

                <h2>
                  Spending
                  Categories
                </h2>

                <p>
                  Where your
                  money goes
                </p>

              </div>

            </div>

            <div className="category-list">

              {categoryTotals.map(
                (category) => (

                  <div
                    className="category-item"
                    key={
                      category.name
                    }
                  >

                    <div className="category-left">

                      <div className="category-icon">
                        {getCategoryIcon(
                          category.name
                        )}
                      </div>

                      <span>
                        {
                          category.name
                        }
                      </span>

                    </div>

                    <strong>
                      {formatMoney(
                        category.total
                      )}
                    </strong>

                  </div>

                )
              )}

            </div>

          </div>

        </section>

      </main>


      {/* ADD EXPENSE */}

      {showAddExpense && (
        <AddExpense
          onExpenseAdded={
            handleExpenseAdded
          }
          onClose={() =>
            setShowAddExpense(
              false
            )
          }
        />
      )}


      {/* EDIT EXPENSE */}

      {editingExpense && (
        <EditExpense
          expense={
            editingExpense
          }

          onExpenseUpdated={
            handleExpenseUpdated
          }

          onClose={() =>
            setEditingExpense(
              null
            )
          }
        />
      )}

    </div>
  );
}

export default Dashboard;