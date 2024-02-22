const express = require('express');
const bodyParser = require('body-parser');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const createError = require('http-errors');
const morgan = require('morgan');
require('dotenv').config();
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { json } = require('express');
const userRoutes = require('./routes/user');

const app = express();

// Define Swagger options
const options = {
  definition: {
    openapi: '3.0.0', // Specify the OpenAPI version
    info: {
      title: 'Documentation', // Specify the title of your API
      version: '1.0.0', // Specify the version of your API
      description: "Documentation de l'API FleetRisk qui retourne les données du dashboard",
    },
  },
  // Paths to files containing OpenAPI definitions
  apis: ['./routes/user.js'],
};

const specs = swaggerJsdoc(options);

app.use('/api-docs-fleetrisk', swaggerUi.serve, swaggerUi.setup(specs, {
  customSiteTitle: "Documentation API FleetRisk",
}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan('dev'));

app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
);

app.get('/', async (req, res, next) => {
  res.send({ message: 'Ok api is working 🚀' });
});

app.use('/documents', express.static(path.join(__dirname, '/documents')));
app.use('/', userRoutes);

app.use((req, res, next) => {
  createError.NotFound();
});

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message || 'server error' });
});

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
