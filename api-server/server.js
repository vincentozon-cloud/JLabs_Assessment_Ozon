const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 8000; 

app.use(cors());
app.use(express.json());

// Seeder data for evaluation as requested
const USER_SEEDER = {
    email: "admin@test.com",
    password: "password123"
};

// Requirement: LOGIN API URL: http://localhost:8000/api/login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (email === USER_SEEDER.email && password === USER_SEEDER.password) {
        console.log(`Successful login: ${email}`);
        return res.status(200).json({
            success: true,
            user: { email: email }
        });
    }

    console.log(`Failed login attempt for: ${email}`);
    return res.status(401).json({ success: false, message: "Invalid credentials" });
});

app.listen(PORT, () => {
    console.log(`[JLabs Assessment] Server is running on http://localhost:${PORT}`);
    console.log(`[Hint] Login with: ${USER_SEEDER.email} / ${USER_SEEDER.password}`);
});