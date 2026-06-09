const express = require('express');
const router = express.Router();
const { SecurityQuestion } = require('../models');
const { validateToken } = require("../middleware/AuthMiddleware");

router.get('/check/:userId', validateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const existingQuestions = await SecurityQuestion.findOne({
            where: { user_id: userId },
        });

        if (existingQuestions) {
            return res.status(200).json({ questionsExist: true, questions: existingQuestions });
        } else {
            return res.status(200).json({ questionsExist: false });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/create', validateToken, async (req, res) => {
    const user_id = req.user.id;
    const { q1, q1a, q2, q2a, q3, q3a } = req.body;

    try {
        const securityQuestions = await SecurityQuestion.create({
            user_id,
            q1,
            q1a,
            q2,
            q2a,
            q3,
            q3a,
        });

        return res.status(200).json({ message: 'Security questions created successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/update', validateToken, async (req, res) => {
    const userId = req.user.id;
    const { q1, q1a, q2, q2a, q3, q3a } = req.body;

    try {
        const [updatedRows] = await SecurityQuestion.update(
            {
                q1,
                q1a,
                q2,
                q2a,
                q3,
                q3a,
            },
            {
                where: { user_id: userId },
            }
        );

        if (updatedRows === 0) {
            return res.status(404).json({ error: 'Security questions not found for the user' });
        }

        return res.status(200).json({ message: 'Security questions updated successfully' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.get('/get-questions', validateToken, async (req, res) => {
    const userId = req.user.id;

    try {
        const existingQuestions = await SecurityQuestion.findOne({
            attributes: ['q1', 'q1a', 'q2', 'q2a', 'q3', 'q3a',],
            where: { user_id: userId },
        });

        if (existingQuestions) {
            return res.status(200).json({ questions: existingQuestions });
        } else {
            return res.status(404).json({ error: 'Security questions not found for the user' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
