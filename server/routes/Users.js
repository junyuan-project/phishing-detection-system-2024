const express = require('express');
const router = express.Router();
const { Users } = require("../models");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');
const { validateToken } = require("../middleware/AuthMiddleware");
const { sign } = require("jsonwebtoken");

router.post("/", async (req, res) => {
    try {
        const { username, email, phoneNum, password, confirmPass, role } = req.body;

        // Check if password and confirmPass match
        if (password !== confirmPass) {
            return res.status(400).json({ error: "Password and confirm password do not match." });
        }

        const existingUser = await Users.findOne({ where: { email: email.trim().toLowerCase() } });

        if (existingUser) {
            return res.status(400).json({ error: "Email already exists." });
        }


        // Hash the password
        const hash = await bcrypt.hash(password, 10);

        // Custom prefix for user_id
        const userPrefix = 'U';

        // Generate a unique user_id using uuidv4 and concatenate with custom prefix
        const fullUserId = `${userPrefix}${uuidv4()}`;

        // Truncate the user_id to 8 characters (excluding the custom prefix)
        const truncatedUserId = fullUserId.substring(0, 5 + userPrefix.length);

        // Create a new user
        await Users.create({
            user_id: truncatedUserId,
            username: username,
            email: email,
            phoneNumber: phoneNum,
            password: hash,
            role: role,
        });
        res.status(201).json({ message: "User created successfully." });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ where: { email: email } });

        if (!user) {
            return res.json({ error: "User doesn't exist" });
        }

        bcrypt.compare(password, user.password).then((match) => {
            if (!match) {
                return res.json({ error: "Wrong email and password combination" });
            } else {
                const accessToken = sign({ email: user.email, id: user.user_id, role: user.role }, "importantsecret");
                return res.json({ token: accessToken, email: email, user_id: user.user_id });
            }
        });
    } catch (error) {
        console.error("Error during login:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get('/auth', validateToken, (req, res) => {
    res.json(req.user);
});

router.get('/user', validateToken, async (req, res) => {
    try {
        const user = await Users.findOne({ where: { user_id: req.user.id } });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const userData = {
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
        };

        res.json(userData);
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put("/edit", validateToken, async (req, res) => {
    try {
        const { username, email, phoneNum } = req.body;

        // Find the user by user_id
        const user = await Users.findOne({ where: { user_id: req.user.id } });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Update user information
        user.username = username || user.username;
        user.email = email || user.email;
        user.phoneNumber = phoneNum || user.phoneNumber;

        // Save the updated user information
        await user.save();

        res.json({ message: "User information updated successfully." });
    } catch (error) {
        console.error("Error updating user information:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put("/change-password", validateToken, async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmNewPassword } = req.body;

        // Find the user by user_id
        const user = await Users.findOne({ where: { user_id: req.user.id } });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if current password is correct
        const isMatch = await bcrypt.compare(currentPassword, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: "Current password is incorrect." });
        }

        // Check if new password and confirmNewPassword match
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ error: "New password and confirm password do not match." });
        }

        // Hash the new password
        const hash = await bcrypt.hash(newPassword, 10);

        // Update user password
        user.password = hash;

        // Save the updated user password
        await user.save();

        res.json({ message: "Password changed successfully." });
    } catch (error) {
        console.error("Error changing password:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.post("/admin-login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ where: { email: email } });

        if (!user) {
            return res.json({ error: "Wrong credentials" });
        }

        // Check if the user has the 'admin' role
        if (user.role !== 'Admin') {
            return res.json({ error: "Wrong credentials" });
        }

        bcrypt.compare(password, user.password).then((match) => {
            if (!match) {
                return res.json({ error: "Wrong email and password combination" });
            } else {
                // Generate an access token with the user's email and role
                const accessToken = sign({ email: user.email, id: user.user_id, role: user.role }, "importantsecret");

                return res.json({ token: accessToken, email: email, user_id: user.user_id });
            }
        });
    } catch (error) {
        console.error("Error during admin login:", error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});

router.get("/all", validateToken, async (req, res) => {
    try {
        if (req.user.role !== 'Admin') {
            return res.status(403).json({ error: "Unauthorized access" });
        }

        // Fetch users with the role 'User' from the database
        const userRole = 'User';
        const users = await Users.findAll({
            where: {
                role: userRole,
            },
        });

        const userDataArray = users.map(user => ({
            id: user.id,
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));

        res.json(userDataArray);
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.put("/edit/:userId", validateToken, async (req, res) => {
    try {
        const userId = req.params.userId;
        const { username, phoneNumber } = req.body;

        // Find the user by user_id
        const user = await Users.findOne({ where: { user_id: userId } });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the user making the request is the owner of the profile or an admin
        if (req.user.role !== 'Admin' && req.user.id !== user.user_id) {
            return res.status(403).json({ error: "Unauthorized access. You can only edit your own profile." });
        }

        // Update user information
        user.username = username || user.username;
        user.phoneNumber = phoneNumber || user.phoneNumber;

        // Save the updated user information
        await user.save();

        res.json({ message: "User information updated successfully." });
    } catch (error) {
        console.error("Error updating user information:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

router.delete("/delete/:userId", validateToken, async (req, res) => {
    try {
        const userId = req.params.userId;

        // Find the user by user_id
        const user = await Users.findOne({ where: { user_id: userId } });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Check if the user making the request is the owner of the profile or an admin
        if (req.user.role !== 'Admin' && req.user.id !== user.user_id) {
            return res.status(403).json({ error: "Unauthorized access. You can only delete your own profile." });
        }

        // Delete the user
        await user.destroy();

        res.json({ message: "User deleted successfully." });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
module.exports = router;