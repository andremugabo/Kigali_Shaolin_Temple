const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const options = {
  definition: {
    openapi: '3.0.0',
    info: { title: 'Backend API', version: '1.0.0', description: 'Kigali Shaolin Temple  APIs' },
    servers: [
      { url: 'http://localhost:3005', description: 'Local development server' },
      { url: 'https://api.kst.rw', description: 'Production server' }
    ],
    components: {
      securitySchemes: { bearerAuth: { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' } },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./docs/swagger/*.js', './src/routes/*.js', './src/controllers/*.js'],
};

const specs = swaggerJsDoc(options);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
}

module.exports = setupSwagger;