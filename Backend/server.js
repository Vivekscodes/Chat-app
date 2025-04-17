const express = require('express');
const app = express();
const cors = require('cors')
const dotenv = require('dotenv');
const connection = require('./config/db');
app.use(express.json())
app.use(cors())
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true, // If you're using cookies or auth headers
};

app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }))

const authRoutes = require('./Routes/auth.routes');
app.use('/auth', authRoutes);


app.get('/', (req, res) => {
    res.send('Hello World!')
})
app.listen(4000, () => {
    console.log('Server is running on port 4000')
})