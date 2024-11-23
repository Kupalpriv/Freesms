const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;


app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'views')));


app.post('/send-sms', async (req, res) => {
    const { number, message } = req.body;

    
    if (!/^09\d{9}$/.test(number)) {
        return res.status(400).json({ error: 'Invalid Philippine number format.' });
    }

    try {
        const fetch = await import('node-fetch');
        const response = await fetch.default(
            `https://api.kenliejugarap.com/freesmslbc/?number=${number}&message=${encodeURIComponent(message)}`
        );
        const data = await response.json();

        if (data.status) {
            res.json({
                success: true,
                message: `SMS successfully sent to ${number}`,
                details: data,
            });
        } else {
            res.status(500).json({ error: 'Failed to send SMS. Try again later.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Server error. Please try again later.' });
    }
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
