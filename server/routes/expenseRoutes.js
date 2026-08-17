const express = require("express");
const Expense = require("../models/Expense");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();


// ========================================
// CREATE EXPENSE
// ========================================

router.post("/", authMiddleware, async (req, res) => {
    try {
        const { title, amount, category, date, description } = req.body;

        const expense = new Expense({
            title,
            amount,
            category,
            date,
            description,
            user: req.userId
        });

        const savedExpense = await expense.save();

        res.status(201).json(savedExpense);

    } catch (error) {

        console.error("Create expense error:", error);

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
            .find({ user: req.userId })
            .sort({ date: -1 });

        res.status(200).json(expenses);

    } catch (error) {

        console.error("Get expenses error:", error);

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

        res.status(200).json(expense);

    } catch (error) {

        console.error("Get expense error:", error);

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

        const updatedExpense = await Expense.findOneAndUpdate(
            {
                _id: req.params.id,
                user: req.userId
            },
            req.body,
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

        res.status(200).json(updatedExpense);

    } catch (error) {

        console.error("Update expense error:", error);

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

        const deletedExpense = await Expense.findOneAndDelete({
            _id: req.params.id,
            user: req.userId
        });

        if (!deletedExpense) {
            return res.status(404).json({
                message: "Expense not found"
            });
        }

        res.status(200).json({
            message: "Expense deleted successfully"
        });

    } catch (error) {

        console.error("Delete expense error:", error);

        res.status(500).json({
            message: "Failed to delete expense",
            error: error.message
        });
    }
});


module.exports = router;