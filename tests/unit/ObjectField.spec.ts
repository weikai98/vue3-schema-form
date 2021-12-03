import { mount } from '@vue/test-utils'
import SchemaForm, {
  // ObjectField,
  // ArrayField,
  StringField,
  NumberField,
} from '../../lib'

describe('ObjectField.vue', () => {
  it('should render correct number field and string field', async () => {
    let value = { name: '', age: 0 }
    const wrapper = mount(SchemaForm, {
      props: {
        schema: {
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
        value: value,
        onChange: (v: any) => {
          value = v
        },
      },
    })
    const numberField = wrapper.findComponent(NumberField)
    const stringField = wrapper.findComponent(StringField)

    expect(numberField.exists()).toBeTruthy()
    expect(stringField.exists()).toBeTruthy()
  })

  it('should render correct value', async () => {
    let value = { name: '', age: 0 }
    const wrapper = mount(SchemaForm, {
      props: {
        schema: {
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
        value: value,
        onChange: (v: any) => {
          value = v
        },
      },
    })
    const numberField = wrapper.findComponent(NumberField)
    const stringField = wrapper.findComponent(StringField)

    await stringField.props('onChange')('1')
    expect(value.name).toBe('1')
    await numberField.props('onChange')(18)
    expect(value.age).toBe(18)
  })
})
