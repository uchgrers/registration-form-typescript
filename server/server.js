const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = express();
const port = 8000;
const clientOrigin = 'http://localhost:3000';

const JWT_SECRET = "jwt_secret";
let users = [];

app.use(cors({
    origin: clientOrigin,
    credentials: true
}));

app.use(bodyParser.json());
app.use(cookieParser());

const createResponse = (statusCode, messages = [], userData = {}) => ({ statusCode, messages, userData });

app.post('/registrationFormApi/auth', async (req, res) => {
    const { type, email, password } = req.body;

    if (type === 'register') {
        if (users.find(u => u.email === email)) {
            return res.send(createResponse(1, ['Email is already taken']));
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = {
            userId: users.length + 1,
            email,
            password: hashedPassword,
            isAuth: true
        };
        users.push(newUser);

        const token = jwt.sign({ userId: newUser.userId, email: newUser.email }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 3600000
        });

        res.send(createResponse(0, [], {
            userId: newUser.userId,
            email: newUser.email,
            isAuth: true,
            users: users.map(user => ({ userId: user.userId, email: user.email, isAuth: user.isAuth}))
        }));
    }

    else if (type === 'login') {
        const user = users.find(u => u.email === email);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.send(createResponse(1, ['Invalid email or password']));
        }

        const token = jwt.sign({ userId: user.userId, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

        res.cookie('auth_token', token, {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
            maxAge: 3600000
        });

        res.send(createResponse(0, [], {
            userId: user.userId,
            email: user.email,
            isAuth: true,
            users: users.map(user => ({ userId: user.userId, email: user.email, isAuth: user.isAuth}))
        }));
    }
});

app.post('/registrationFormApi/logout', (req, res) => {
    const user = users.find(u => u.userId === req.body.userId)
    user.isAuth = false
    res.clearCookie('auth_token');
    res.json({ message: 'Logout successful' });
});

app.get('/registrationFormApi/users', (req, res) => {
    const token = req.cookies.auth_token;

    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const currentUser = users.find(u => u.userId === decoded.userId);

        if (!currentUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.send({
            message: "Users fetched successfully",
            user: { userId: currentUser.userId, email: currentUser.email },
            users: users.map(user => ({ userId: user.userId, email: user.email }))
        });
    } catch (error) {
        res.status(403).json({ message: "Invalid token" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});