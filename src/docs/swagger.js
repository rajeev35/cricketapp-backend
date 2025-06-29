const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Cricket App API',
      version: '1.1.0',
      description: 'API documentation for the Cricket App',
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 5000}`, // adjust if needed
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        Match: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            format: { type: 'string' },
            date: { type: 'string', format: 'date-time' },
            location: { type: 'string' },
            owner: { type: 'string' },
            participants: {
              type: 'array',
              items: { type: 'string' },
            },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Invite: {
          type: 'object',
          properties: {
            _id:       { type: 'string' },
            match:     { type: 'string' },
            inviter:   { type: 'string' },
            invitee:   { type: 'string' },
            status:    { type: 'string', enum: ['pending','accepted','declined'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        TossResult: {
          type: 'object',
          properties: {
            matchId: { type: 'string' },
            result:  { type: 'string', enum: ['heads','tails'] },
            timestamp: { type: 'string', format: 'date-time' }
          },
        },
        Score: {
          type: 'object',
          properties: {
            matchId:   { type: 'string' },
            runs:      { type: 'integer' },
            wickets:   { type: 'integer' },
            overs:     { type: 'number' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
