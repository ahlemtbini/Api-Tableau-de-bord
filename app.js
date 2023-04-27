const express = require('express');
const createError = require('http-errors');
const morgan = require('morgan');
require('dotenv').config();

const cors = require("cors");
const path = require('path');
const fs = require("fs");
const { json } = require("express");
const userRoutes = require("./routes/user");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.get('/', async (req, res, next) => {
  res.send({ message: 'Ok api is working 🚀' });
});

app.use('/api/documents', express.static(path.join(__dirname, '/documents')));
app.use("/api", userRoutes);


app.use((req, res, next) => {
  createError.NotFound()
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({error: err.message || 'server error' })

});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));

