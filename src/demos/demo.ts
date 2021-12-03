import PasswordWidget from '../components/PasswordWidget'
export default {
  name: 'Demo',
  schema: {
    description: 'A simple form example.',
    type: 'object',
    required: ['firstName', 'lastName'],
    properties: {
      firstName: {
        type: 'string',
        title: 'firstName',
        default: 'Chuck',
        minLength: 10,
      },
      lastName: {
        type: 'string',
      },
      telephone: {
        type: 'string',
        minLength: 10,
      },
      staticArray: {
        type: 'array',
        title: 'staticArray',
        items: [
          {
            type: 'string',
            title: 'staticArray string',
            minLength: 3,
          },
          {
            type: 'number',
          },
        ],
      },
      singleTypeArray: {
        type: 'array',
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
      pass1: {
        type: 'string',
        minLength: 10,
        title: 'password',
      },
      pass2: {
        type: 'string',
        minLength: 10,
        title: 're try password',
      },
      pass3: {
        type: 'string',
        format: 'colorFormat',
        title: 'use color',
      },
      pass4: {
        type: 'string',
        title: 'use color2',
        test: true,
      },
    },
  },
  uiSchema: {
    properties: {
      pass1: {
        widget: PasswordWidget,
      },
      pass2: {
        color: 'red',
        height: '20px',
        display: 'flex',
      },
    },
  },
  // eslint-disable-next-line
  customValidate(data: any, errors: any): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        if (data.pass1 !== data.pass2) {
          errors.pass2.addError('密码必须相同')
        }
        resolve()
      }, 2000)
    })
  },
  default: {
    firstName: 'Chuck',
    lastName: 'Norris',
    age: 75,
    bio: 'Roundhouse kicking asses since 1940',
    password: 'noneed',
    singleTypeArray: [{ name: 'jokcy', age: 12 }],
  },
}
