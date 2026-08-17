const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const expenseRoutes = require("./routes/expenseRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;


// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());
app.use(express.json());


// ========================================
// HOME ROUTE
// ========================================

app.get("/", (req, res) => {
    res.json({
        message: "Expense Tracker API is running!"
    });
});


// ========================================
// EXPENSE API ROUTES
// ========================================

app.use("/api/expenses", expenseRoutes);
app.use("/api/auth", authRoutes);

// ========================================
// CONNECT TO MONGODB
// ========================================

mongoose
    .connect(MONGO_URI)
    .then(() => {

        console.log("MongoDB connected successfully!");

        app.listen(PORT, () => {
            console.log(
                `Server running on http://localhost:${PORT}`
            );
        });

    })
    .catch((error) => {

        console.error(
            "MongoDB connection failed:",
            error.message
        );

    });