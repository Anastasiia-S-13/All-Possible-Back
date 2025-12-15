export default {
  openapi: '3.0.0',
  info: {
    title: 'ToolNext API',
    version: '1.0.0',
    description: 'API documentation for users and tools management',
  },

  servers: [
    {
      url: `http://localhost:${process.env.PORT || 3000}`,
    },
  ],

  tags: [
    {
      name: 'Auth',
      description: 'Authorization routes',
    },
    {
      name: 'User',
      description: 'Operations with user: get current user, user by id',
    },
    {
      name: 'Tool',
      description: 'Operations with tools: get tools, create tool, delete tool',
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
      User: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string', format: 'email' },
          avatar: { type: 'string', format: 'url' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Category: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          title: { type: 'string' },
          description: { type: 'string' },
          keywords: { type: 'string' },
        },
      },
      Feedbacks: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          rate: { type: 'number' },
        },
      },
      Bookings: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          userId: { $ref: '#/components/schemas/User' },
          toolId: { $ref: '#/components/schemas/Tool' },
          firstName: { type: 'string' },
          lastName: { type: 'string' },
          phone: { type: 'string' },
          startDate: { type: 'string', format: 'date-time' },
          endDate: { type: 'string', format: 'date-time' },
          deliveryCity: { type: 'string' },
          novaPoshtaBranch: { type: 'string' },
          totalPrice: { type: 'number' },
          status: { type: 'string', enum: ['pending', 'confirmed'] },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
      Tool: {
        type: 'object',
        properties: {
          _id: { type: 'string' },
          owner: { $ref: '#/components/schemas/User' },
          category: { $ref: '#/components/schemas/Category' },
          name: { type: 'string' },
          description: { type: 'string' },
          pricePerDay: { type: 'number' },
          images: { type: 'string' },
          rating: { type: 'number' },
          specifications: {
            type: 'object',
            additionalProperties: { type: 'string' },
          },
          rentalTerms: { type: 'string' },
          bookedDates: {
            type: 'array',
            items: { $ref: '#/components/schemas/Bookings' },
          },
          feedbacks: {
            type: 'array',
            items: { $ref: '#/components/schemas/Feedbacks' },
          },
        },
      },
      CreateToolRequest: {
        type: 'object',
        required: [
          'name',
          'pricePerDay',
          'category',
          'description',
          'rentalTerms',
          'image',
        ],
        properties: {
          name: {
            type: 'string',
            minLength: 3,
            maxLength: 96,
            example: 'Мийка високого тиску Karcher',
          },

          pricePerDay: {
            type: 'number',
            minimum: 0,
            example: 250,
          },

          category: {
            type: 'string',
            description: 'Category ID',
            example: '6704d9c7f1a3b8c2d5e4f6a8',
          },

          description: {
            type: 'string',
            minLength: 20,
            maxLength: 2000,
            example: 'Потужна акумуляторна мийка для побутового використання',
          },

          rentalTerms: {
            type: 'string',
            minLength: 20,
            maxLength: 1000,
            example: 'Застава 2500 грн. Паспорт.',
          },

          specifications: {
            type: 'object',
            additionalProperties: { type: 'string' },
            example: {
              Тиск: '110 бар',
              Вага: '4.5 кг',
            },
          },

          image: {
            type: 'string',
            format: 'binary',
            description: 'Tool image',
          },
        },
      },
    },
  },
  paths: {
    '/auth/register': {
      post: {
        tags: ['Auth'],
        summary: 'Register a new user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  name: {
                    type: 'string',
                    minLength: 2,
                    maxLength: 32,
                    example: 'John Doe',
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'example@mail.com',
                  },
                  password: {
                    type: 'string',
                    format: 'password',
                    minLength: 8,
                    maxLength: 128,
                    example: 'strongPassword123',
                  },
                },
                required: ['name', 'email', 'password'],
              },
            },
          },
        },

        responses: {
          201: {
            description: 'New user registered successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: {
                      type: 'object',
                      $ref: '#/components/schemas/User',
                    },
                  },
                },
                example: {
                  user: {
                    _id: '609e129e8f1b2c0015b8b456',
                    name: 'John Doe',
                    email: 'example@mail.com',
                    avatar: 'http://example.com/avatar.jpg',
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                  },
                },
              },
            },
          },
          400: {
            description: 'Bad Request - User with this email already exists',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'User with this email already exists',
                    },
                  },
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Something went wrong',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login a user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: {
                    type: 'string',
                    format: 'email',
                    example: 'example@mail.com',
                  },
                  password: {
                    type: 'string',
                    format: 'password',
                    example: 'strongPassword123',
                  },
                },
                required: ['email', 'password'],
              },
            },
          },
        },

        responses: {
          200: {
            description: 'New user registered successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: {
                      type: 'object',
                      $ref: '#/components/schemas/User',
                    },
                  },
                },
                example: {
                  user: {
                    _id: '609e129e8f1b2c0015b8b456',
                    name: 'John Doe',
                    email: 'example@mail.com',
                    avatar: 'http://example.com/avatar.jpg',
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                  },
                },
              },
            },
          },
          401: {
            description: 'Wrong email or password',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'User with this email already exists',
                    },
                  },
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Something went wrong',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/auth/logout': {
      post: {
        tags: ['Auth'],
        summary: 'Loguot',
        security: [{ bearerAuth: [] }],
        responses: {
          204: { description: 'No message response' },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Something went wrong',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/auth/refresh': {
      post: {
        tags: ['Auth'],
        summary: 'Refresh an access token',
        requestBody: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['sessionId', 'refreshToken'],
                properties: {
                  sessionId: {
                    type: 'string',
                    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6Ikp',
                  },
                  refreshToken: {
                    type: 'string',
                    example: 'iIsInR5cCI6IkpXVCJ9.eyJpc3M',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Token refreshed',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Session refreshed successfully',
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Refresh error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example:
                        'Session not found | Invalid refresh token | Refresh token expired',
                    },
                  },
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Something went wrong',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/user': {
      get: {
        tags: ['User'],
        summary: 'Get info about current user',
        responses: {
          200: {
            description: 'User information',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: {
                      $ref: '#/components/schemas/User',
                    },
                  },
                },
                example: {
                  user: {
                    _id: '609e129e8f1b2c0015b8b456',
                    name: 'John Doe',
                    email: 'example@mail.com',
                    avatar: 'http://example.com/avatar.jpg',
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                  },
                },
              },
            },
          },
          401: {
            description: 'Not authenticated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Not authenticated',
                    },
                  },
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Something went wrong',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/user/{id}': {
      get: {
        tags: ['User'],
        summary: 'Get info about user by id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              example: '609e129e8f1b2c0015b8b456',
            },
            description: 'User id',
          },
        ],
        responses: {
          200: {
            description: 'User information',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    user: {
                      type: 'object',
                      $ref: '#/components/schemas/User',
                    },
                  },
                },
                example: {
                  user: {
                    _id: '609e129e8f1b2c0015b8b456',
                    name: 'John Doe',
                    email: 'example@mail.com',
                    avatar: 'http://example.com/avatar.jpg',
                    createdAt: '2023-01-01T00:00:00.000Z',
                    updatedAt: '2023-01-01T00:00:00.000Z',
                  },
                },
              },
            },
          },
          401: {
            description: 'Not authenticated',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Not authenticated',
                    },
                  },
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Something went wrong',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/tools': {
      get: {
        tags: ['Tool'],
        summary: 'Get all tools',
        parameters: [
          {
            in: 'query',
            name: 'page',
            schema: { type: 'integer', default: 1 },
            description: 'Page number',
          },
          {
            in: 'query',
            name: 'perPage',
            schema: { type: 'integer', default: 10 },
            description: 'Items per page',
          },
          {
            in: 'query',
            name: 'category',
            schema: { type: 'string' },
            description: 'Category id',
          },
          {
            in: 'query',
            name: 'search',
            schema: { type: 'string' },
            description: 'Search by text index',
          },
        ],
        responses: {
          200: {
            description: 'A list of tools with pagination details',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    page: { type: 'integer' },
                    perPage: { type: 'integer' },
                    totalItems: { type: 'integer' },
                    totalPages: { type: 'integer' },
                    tools: {
                      type: 'array',
                      $ref: '#/components/schemas/Tool',
                    },
                  },
                },
                example: {
                  tools: {
                    page: 1,
                    perPage: 10,
                    totalTools: 105,
                    totalPages: 11,
                    tools: [
                      {
                        _id: '692db3ffab59e437964311a2',
                        owner: '6881563901add19ee16fd014',
                        category: '6704d9c7f1a3b8c2d5e4f6a3',
                        name: 'Монтажна пила по металу Makita LC1230',
                        description:
                          "Монтажна пила Makita LC1230 для точного та чистого різання металу твердосплавним диском. На відміну від абразивних пил, ріже без іскор, пилу та запаху, а зріз залишається холодним та без задирок. Ідеальна для різання труб, профілів та кутників у цеху або на об'єкті. Економить час на подальшу обробку деталей.",
                        pricePerDay: 400,
                        images:
                          'https://ftp.goit.study/img/tools-next/692db3ffab59e437964311a2.webp',
                        rating: 5,
                        specifications: {
                          Потужність: '1750 Вт',
                          'Діаметр диска': '305 мм',
                          Оберти: '1300 об/хв',
                          'Глибина різу (90°)': '115 мм',
                          Вага: '19.3 кг',
                        },
                        rentalTerms: 'Застава 4000 грн. Самовивіз.',
                        bookedDates: [],
                        feedbacks: [],
                      },
                    ],
                  },
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Something went wrong',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/tools/{id}': {
      get: {
        tags: ['Tool'],
        summary: 'Get info about tool by id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              example: '692db3ffab59e437964311az1',
            },
            description: 'Tool id',
          },
        ],
        responses: {
          200: {
            description: 'Tool information',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    tool: {
                      type: 'object',
                      $ref: '#/components/schemas/Tool',
                    },
                  },
                },
                example: {
                  tool: {
                    _id: '692db3ffab59e437964311az1',
                    owner: 'John Doe',
                    category: '6704d9c7f1a3b8c2d5e4f6z1',
                    description: 'Tool description',
                    pricePerDay: 300,
                    images: 'https://example.com/img/example-image.webp',
                    rating: 5,
                    specifications: {
                      spec1: 'value',
                      spec2: 'value',
                    },
                    rentalTerms: 'Terms',
                    bookedDates: [],
                    feedbacks: [],
                  },
                },
              },
            },
          },
          400: {
            description: 'Tool not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Invalid tool id',
                    },
                  },
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Something went wrong',
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        tags: ['Tool'],
        summary: 'Create new tool',
        requestBody: {
          required: true,
          content: {
            'multipart/form-data': {
              schema: {
                $ref: '#/components/schemas/CreateToolRequest',
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Tool created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: 'components/schemas/Tool',
                },
                example: {
                  tool: {
                    _id: '692db3ffab59e437964311az1',
                    owner: 'John Doe',
                    category: '6704d9c7f1a3b8c2d5e4f6z1',
                    name: 'Мийка високого тиску Karcher',
                    description:
                      'Потужна акумуляторна мийка для побутового використання',
                    pricePerDay: 300,
                    images: 'https://example.com/img/example-image.webp',
                    rating: 0,
                    specifications: {
                      Тиск: '110 бар',
                      Вага: '4.5 кг',
                    },
                    rentalTerms: 'TerЗастава 2500 грн. Паспорт.ms',
                    bookedDates: [],
                    feedbacks: [],
                  },
                },
              },
            },
          },
          400: {
            description: 'Image is required',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Image is required',
                    },
                  },
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Something went wrong',
                    },
                  },
                },
              },
            },
          },
        },
      },
      delete: {
        tags: ['Tool'],
        summary: 'Delete tool by id',
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: {
              type: 'string',
              example: '692db3ffab59e437964311az1',
            },
            description: 'Tool id',
          },
        ],
        responses: {
          200: {
            description: 'Tool information',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Tool deleted successfully',
                    },
                  },
                },
              },
            },
          },
          404: {
            description: 'Tool not found',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Tool not found',
                    },
                  },
                },
              },
            },
          },
          403: {
            description: 'Not the owner',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Forbidden: not the owner',
                    },
                  },
                },
              },
            },
          },
          500: {
            description: 'Internal Server Error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Something went wrong',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  },
};
