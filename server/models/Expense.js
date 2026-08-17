const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true
        },

        amount: {
            type: Number,
            required: true,
            min: 0
        },

        category: {
            type: String,
            required: true,
            enum: [
                "Food",
                "Transport",
                "Shopping",
                "Bills",
                "Entertainment",
                "Other"
            ]
        },

        date: {
            type: Date,
            required: true,
            default: Date.now
        },

        description: {
            type: String,
            trim: true,
            default: ""
        },

        // User who owns this expense
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