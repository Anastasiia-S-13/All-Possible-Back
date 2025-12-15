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
      CreateBookingRequest: {
        type: 'object',
        required: [
          'toolId',
          'firstName',
          'lastName',
          'phone',
          'startDate',
          'endDate',
          'deliveryCity',
          'novaPoshtaBranch',
        ],
        properties: {
          toolId: {
            type: 'string',
            description: 'Tool ID',
            example: '692db3ffab59e437964311d4',
          },

          firstName: {
            type: 'string',
            example: 'Іван',
          },

          lastName: {
            type: 'string',
            example: 'Петренко',
          },

          phone: {
            type: 'string',
            example: '+380991234567',
          },

          startDate: {
            type: 'string',
            format: 'date-time',
            example: '2025-01-10T00:00:00.000Z',
          },

          endDate: {
            type: 'string',
            format: 'date-time',
            example: '2025-01-12T00:00:00.000Z',
          },

          deliveryCity: {
            type: 'string',
            example: 'Київ',
          },

          novaPoshtaBranch: {
            type: 'string',
            example: 'Відділення №12',
          },
        },
      },
      CreateBookingResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
            example: true,
          },
          message: {
            type: 'string',
            example: 'Успішне бронювання',
          },
          booked: {
            type: 'object',
            properties: {
              id: { type: 'string' },

              userId: { type: 'string' },

              tool: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                  pricePerDay: { type: 'number' },
                },
              },

              customerInfo: {
                type: 'object',
                properties: {
                  firstName: { type: 'string' },
                  lastName: { type: 'string' },
                  phone: { type: 'string' },
                },
              },

              rentalPeriod: {
                type: 'object',
                properties: {
                  startDate: { type: 'string', format: 'date-time' },
                  endDate: { type: 'string', format: 'date-time' },
                  days: { type: 'number' },
                },
              },

              delivery: {
                type: 'object',
                properties: {
                  city: { type: 'string' },
                  branch: { type: 'string' },
                },
              },

              totalPrice: { type: 'number' },

              status: {
                type: 'string',
                enum: ['pending', 'confirmed'],
              },

              createdAt: {
                type: 'string',
                format: 'date-time',
              },
            },
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
    '/user/{id}/tools': {
      get: {
        tags: ['User'],
        summary: 'Get info about user tools',
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
            description: 'List of user tools',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    tools: {
                      type: 'array',
                      $ref: '#/components/schemas/Tool',
                    },
                  },
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
      patch: {
        tags: ['Tool'],
        summary: 'Update tool',
        description:
          'Partially update tool fields. Only the owner can update the tool.',
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
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                minProperties: 1,
                properties: {
                  name: {
                    type: 'string',
                    minLength: 3,
                    maxLength: 96,
                  },
                  pricePerDay: {
                    type: 'number',
                    minimum: 0,
                  },
                  category: {
                    type: 'string',
                    description: 'Category ID',
                  },
                  description: {
                    type: 'string',
                    minLength: 20,
                    maxLength: 2000,
                  },
                  rentalTerms: {
                    type: 'string',
                    minLength: 20,
                    maxLength: 2000,
                  },
                  specifications: {
                    type: 'object',
                    additionalProperties: {
                      type: 'string',
                    },
                    example: {
                      Тиск: '110 бар',
                      Вага: '4.5 кг',
                    },
                  },
                  images: {
                    type: 'string',
                    format: 'uri',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Tool information',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/Tool',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Tool updated successfully',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Invalid tool id',
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
    '/bookings': {
      post: {
        tags: ['Bookings'],
        summary: 'Create booking',
        description: 'Create a booking for a tool',
        security: [{ bearerAuth: [] }],

        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/CreateBookingRequest',
              },
            },
          },
        },

        responses: {
          201: {
            description: 'Booking created successfully',
            content: {
              'application/json': {
                schema: {
                  $ref: '#/components/schemas/CreateBookingResponse',
                },
              },
            },
          },

          400: {
            description: 'Invalid data or price calculation error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Недійсний розрахунок загальної ціни',
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
                      example: 'Інструмент не знайдено',
                    },
                  },
                },
              },
            },
          },

          409: {
            description: 'Tool not available for selected dates',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example:
                        'Інструмент більше не доступний для вибраних дат',
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/categories': {
      get: {
        tags: ['Categories'],
        summary: 'Get list of categories',
        responses: {
          200: {
            description: 'List of categories',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    categories: {
                      type: 'array',
                      $ref: '#/components/schemas/Category',
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Not found categories',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Categories not found',
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
    '/feedbacks': {
      get: {
        tags: ['Feedbacks'],
        summary: 'get all feedbacks',
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
            schema: { type: 'integer', default: 3 },
            description: 'Items per page',
          },
        ],
        responses: {
          200: {
            description: 'List of feedbacks',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    page: { type: 'integer' },
                    perPage: { type: 'integer' },
                    totalFeedbacks: { type: 'integer' },
                    totalPages: { type: 'integer' },
                    feedbacks: {
                      type: 'array',
                      $ref: '#/components/schemas/Feedbacks',
                    },
                  },
                },
                example: {
                  tools: {
                    page: 1,
                    perPage: 3,
                    totalFeedbacks: 10,
                    totalPages: 10,
                    feedbacks: [
                      {
                        _id: '692db3ffab59e437964311a2',
                        name: 'John Doe',
                        description: 'Very good tool',
                        rate: 5,
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
      post: {
        summary: 'Create feedback for a tool',
        description:
          'Create feedback for a specific tool and recalculate tool and owner rating.',
        tags: ['Feedbacks'],
        security: [{ bearerAuth: [] }],
        parameters: [
          {
            name: 'toolId',
            in: 'path',
            required: true,
            description: 'Tool ID',
            schema: {
              type: 'string',
              example: '64e8a5f12c9a4a0012ab34cd',
            },
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'rate'],
                properties: {
                  name: {
                    type: 'string',
                    minLength: 2,
                    maxLength: 15,
                    example: 'Іван',
                  },
                  description: {
                    type: 'string',
                    maxLength: 100,
                    example: 'Чудовий інструмент, рекомендую!',
                  },
                  rate: {
                    type: 'number',
                    minimum: 0.5,
                    maximum: 5,
                    example: 4.5,
                  },
                },
              },
            },
          },
        },
        responses: {
          201: {
            description: 'Feedback created successfully',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    feedback: {
                      $ref: '#/components/schemas/Feedbacks',
                    },
                  },
                },
              },
            },
          },
          400: {
            description: 'Invalid toolId or validation error',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Invalid toolId or validation error',
                    },
                  },
                },
              },
            },
          },
          401: {
            description: 'Unauthorized',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: {
                      type: 'string',
                      example: 'Unauthorized',
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
