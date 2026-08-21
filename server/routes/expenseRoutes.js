const express = require("express");
const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// ALLOWED CATEGORIES
// ========================================

const allowedCategories = [
    "Food",
    "Transport",
    "Shopping",
    "Bills",
    "Entertainment",
    "Health",
    "Education",
    "Other"
];

// ========================================
// CREATE EXPENSE
// ========================================

router.post("/", authMiddleware, async (req, res) => {
    try {
        const {
            title,
            amount,
            category,
            date,
            description
        } = req.body;

        // -------------------------------
        // VALIDATION
        // -------------------------------

        if (!title || !title.trim()) {
            return res.status(400).json({
                message: "Expense title is required"
            });
        }

        if (
            amount === undefined ||
            amount === null ||
            Number(amount) <= 0
        ) {
            return res.status(400).json({
                message: "Please enter a valid amount"
            });
        }

        if (!category) {
            return res.status(400).json({
                message: "Category is required"
            });
        }

        if (!allowedCategories.includes(category)) {
            return res.status(400).json({
                message: "Invalid expense category"
            });
        }

        if (!date) {
            return res.status(400).json({
                message: "Date is required"
            });
        }

        // -------------------------------
        // CREATE EXPENSE
        // -------------------------------

        const expense = new Expense({
            title: title.trim(),
            amount: Number(amount),
            category,
            date,
            description: description || "",
            user: req.userId
        });

        const savedExpense = await expense.save();

        // -------------------------------
        // RESPONSE
        // -------------------------------

        res.status(201).json({
            message: "Expense created successfully",
            expense: savedExpense
        });

    } catch (error) {

        console.error(
            "Create expense error:",
            error
        );

        res.status(400).json({
            message: "Failed to create expense",
            error: error.message
        });
    }
});


// ========================================
// GET ALL EXPENSES
// ========================================

router.get("/", authMiddleware, async (req, res) => {
    try {

        const expenses = await Expense
            .find({
                user: req.userId
            })
            .sort({
                date: -1
            });

        res.status(200).json({
            expenses
        });

    } catch (error) {

        console.error(
            "Get expenses error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch expenses",
            error: error.message
        });
    }
});


// ========================================
// GET ONE EXPENSE
// ========================================

router.get("/:id", authMiddleware, async (req, res) => {
    try {

        const expense = await Expense.findOne({
            _id: req.params.id,
            user: req.userId
        });

        if (!expense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.status(200).json({
            expense
        });

    } catch (error) {

        console.error(
            "Get expense error:",
            error
        );

        res.status(500).json({
            message: "Failed to fetch expense",
            error: error.message
        });
    }
});


// ========================================
// UPDATE EXPENSE
// ========================================

router.put("/:id", authMiddleware, async (req, res) => {
    try {

        const {
            title,
            amount,
            category,
            date,
            description
        } = req.body;

        // -------------------------------
        // VALIDATION
        // -------------------------------

        if (title !== undefined && !title.trim()) {
            return res.status(400).json({
                message: "Expense title is required"
            });
        }

        if (
            amount !== undefined &&
            (amount === "" || Number(amount) <= 0)
        ) {
            return res.status(400).json({
                message: "Please enter a valid amount"
            });
        }

        if (
            category !== undefined &&
            !allowedCategories.includes(category)
        ) {
            return res.status(400).json({
                message: "Invalid expense category"
            });
        }

        // -------------------------------
        // PREPARE UPDATE
        // -------------------------------

        const updateData = {};

        if (title !== undefined) {
            updateData.title = title.trim();
        }

        if (amount !== undefined) {
            updateData.amount = Number(amount);
        }

        if (category !== undefined) {
            updateData.category = category;
        }

        if (date !== undefined) {
            updateData.date = date;
        }

        if (description !== undefined) {
            updateData.description = description;
        }

        // -------------------------------
        // UPDATE
        // -------------------------------

        const updatedExpense =
            await Expense.findOneAndUpdate(
                {
                    _id: req.params.id,
                    user: req.userId
                },
                updateData,
                {
                    new: true,
                    runValidators: true
                }
            );

        if (!updatedExpense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        // -------------------------------
        // RESPONSE
        // -------------------------------

        res.status(200).json({
            message: "Expense updated successfully",
            expense: updatedExpense
        });

    } catch (error) {

        console.error(
            "Update expense error:",
            error
        );

        res.status(400).json({
            message: "Failed to update expense",
            error: error.message
        });
    }
});


// ========================================
// DELETE EXPENSE
// ========================================

router.delete("/:id", authMiddleware, async (req, res) => {
    try {

        const deletedExpense =
            await Expense.findOneAndDelete({
                _id: req.params.id,
                user: req.userId
            });

        if (!deletedExpense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.status(200).json({
            message: "Expense deleted successfully",
            expense: deletedExpense
        });

    } catch (error) {

        console.error(
            "Delete expense error:",
            error
        );

        res.status(500).json({
            message: "Failed to delete expense",
            error: error.message
        });
    }
});


module.exports = router;