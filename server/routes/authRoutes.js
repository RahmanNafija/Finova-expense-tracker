const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");

const router = express.Router();

// ========================================
// SIGN UP
// ========================================

router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                message:
                    "Name, email and password are required"
            });
        }

        const cleanName = name.trim();
        const cleanEmail = email.toLowerCase().trim();

        // Password length
        if (password.length < 6) {
            return res.status(400).json({
                message:
                    "Password must be at least 6 characters"
            });
        }

        // Check existing user
        const existingUser = await User.findOne({
            email: cleanEmail
        });

        if (existingUser) {
            return res.status(409).json({
                message:
                    "An account with this email already exists"
            });
        }

        // Hash password
        const hashedPassword =
            await bcrypt.hash(password, 10);

        // Create user
        const user = new User({
            name: cleanName,
            email: cleanEmail,
            password: hashedPassword
        });

        const savedUser = await user.save();

        // Response
        return res.status(201).json({
            message:
                "Account created successfully",

            user: {
                id: savedUser._id,
                name: savedUser.name,
                email: savedUser.email
            }
        });

    } catch (error) {
        console.error(
            "Signup error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to create account"
        });
    }
});


// ========================================
// LOGIN
// ========================================

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Required fields
        if (!email || !password) {
            return res.status(400).json({
                message:
                    "Email and password are required"
            });
        }

        const cleanEmail =
            email.toLowerCase().trim();

        // Find user
        const user = await User.findOne({
            email: cleanEmail
        });

        if (!user) {
            return res.status(401).json({
                message:
                    "Invalid email or password"
            });
        }

        // Check password
        const isPasswordCorrect =
            await bcrypt.compare(
                password,
                user.password
            );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                message:
                    "Invalid email or password"
            });
        }

        // JWT secret check
        if (!process.env.JWT_SECRET) {
            console.error(
                "JWT_SECRET is missing"
            );

            return res.status(500).json({
                message:
                    "JWT secret is not configured"
            });
        }

        // Create JWT
        const token = jwt.sign(
            {
                userId: user._id
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "7d"
            }
        );

        // Successful login
        return res.status(200).json({
            message:
                "Login successful",

            token,

            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        console.error(
            "Login error:",
            error
        );

        return res.status(500).json({
            message:
                "Failed to login"
        });
    }
});


// ========================================
// FORGOT PASSWORD
// ========================================

router.post(
    "/forgot-password",
    async (req, res) => {
        try {
            const { email } = req.body;

            // Check email
            if (!email) {
                return res.status(400).json({
                    message:
                        "Email is required"
                });
            }

            const cleanEmail =
                email.toLowerCase().trim();

            // Find user
            const user =
                await User.findOne({
                    email: cleanEmail
                });

            if (!user) {
                return res.status(404).json({
                    message:
                        "No account found with this email."
                });
            }

            // Generate secure token
            const resetToken =
                crypto
                    .randomBytes(32)
                    .toString("hex");

            // Token expires after 15 minutes
            const resetTokenExpires =
                new Date(
                    Date.now() +
                    15 * 60 * 1000
                );

            // Save reset information
            user.resetPasswordToken =
                resetToken;

            user.resetPasswordExpires =
                resetTokenExpires;

            await user.save();

            // Development/testing only
            console.log(
                "Password reset token:",
                resetToken
            );

            return res.status(200).json({
                message:
                    "Password reset token generated successfully.",

                resetToken
            });

        } catch (error) {
            console.error(
                "Forgot password error:",
                error
            );

            return res.status(500).json({
                message:
                    "Failed to process password reset request"
            });
        }
    }
);


// ========================================
// RESET PASSWORD
// ========================================

router.post(
    "/reset-password",
    async (req, res) => {
        try {
            const {
                token,
                password
            } = req.body;

            // Required fields
            if (!token || !password) {
                return res.status(400).json({
                    message:
                        "Reset token and new password are required"
                });
            }

            // Password length
            if (password.length < 6) {
                return res.status(400).json({
                    message:
                        "Password must be at least 6 characters"
                });
            }

            // Find user with valid token
            const user =
                await User.findOne({
                    resetPasswordToken:
                        token,

                    resetPasswordExpires: {
                        $gt: new Date()
                    }
                });

            // Invalid / expired token
            if (!user) {
                return res.status(400).json({
                    message:
                        "Invalid or expired password reset token"
                });
            }

            // Hash new password
            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );

            // Update password
            user.password =
                hashedPassword;

            // Remove reset token
            user.resetPasswordToken = null;

            user.resetPasswordExpires = null;

            await user.save();

            return res.status(200).json({
                message:
                    "Password reset successfully"
            });

        } catch (error) {
            console.error(
                "Reset password error:",
                error
            );

            return res.status(500).json({
                message:
                    "Failed to reset password"
            });
        }
    }
);


// ========================================
// EXPORT ROUTER
// ========================================

module.exports = router;