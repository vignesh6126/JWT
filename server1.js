const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();
app.use(express.json());

const posts = [
    { name: "vignesh", title: "welcome vignesh" },
    { name: "Bittu", title: "welcome Bittu" },
    {name:"bittu",title:"welcome bittu"},
    {name:"chanti",title:"welcome chanti"}
];

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token not provided' });

    jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token is not valid' });
        }
        req.user = user;
        next();
    });
};

app.post('/login', (req, res) => {
    const username = req.body.username;
    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    const user = { name: username };
    const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN, { expiresIn: '1h' });

    res.json({ accessToken });
});

app.use(authenticateToken);

app.get('/posts', (req, res) => {
    const userPosts = posts.filter(post => post.name === req.user.name);
    res.json(userPosts);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
