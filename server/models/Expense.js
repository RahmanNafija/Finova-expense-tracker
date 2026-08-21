const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
    {
        // ========================================
        // EXPENSE TITLE
        // ========================================

        title: {
            type: String,
            required: true,
            trim: true
        },

        // ========================================
        // AMOUNT
        // ========================================

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        // ========================================
        // CATEGORY
        // ========================================

        category: {
            type: String,
            required: true,
            enum: [
                "Food",
                "Transport",
                "Shopping",
                "Bills",
                "Entertainment",
                "Health",
                "Education",
                "Other"
            ]
        },

        // ========================================
        // DATE
        // ========================================

        date: {
            type: Date,
            required: true,
            default: Date.now
        },

        // ========================================
        // DESCRIPTION
        // ========================================

        description: {
            type: String,
            trim: true,
            default: ""
        },

        // ========================================
        // USER
        // ========================================

        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },

    {
        timestamps: true
    }
);

module.exports = mongoose.model("Expense", expenseSchema);