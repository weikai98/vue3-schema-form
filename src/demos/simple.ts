export default {
  name: 'Simple',
  schema: {
    description: 'A simple form example.',
    type: 'object',
    properties: {
      staticArray: {
        type: 'array',
        title: 'staticArray',
        items: [
          {
            type: 'string',
            title: 'string',
          },
          {
            type: 'number',
            title: 'number',
          },
        ],
      },
      singleTypeArray: {
        type: 'array',
        title: 'singleTypeArray',
        items: {
          type: 'object',
          properties: {
            name: {
              type: 'string',
            },
            age: {
              type: 'number',
            },
          },
        },
      },
      multiSelectArray: {
        title: 'multiSelectArray',
        type: 'array',
        items: {
          type: 'string',
          enum: ['123', '456', '789'],
        },
      },
    },
  },
  uiSchema: {
    title: 'A registration form',
    properties: {
      firstName: {
        title: 'First name',
      },
      lastName: {
        title: 'Last name',
      },
      telephone: {
        title: 'Telephone',
      },
    },
  },
  default: {
    // firstName: 'Chuck',
    // lastName: 'Norris',
    // age: 75,
    // bio: 'Roundhouse kicking asses since 1940',
    // password: 'noneed',
    staticArray: [1, 2],
    singleTypeArray: [{ name: 'jokcy', age: 12 }],
  },
}
