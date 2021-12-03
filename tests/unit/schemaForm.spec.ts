import { mount } from '@vue/test-utils'
import SchemaForm, {
  // ObjectField,
  // ArrayField,
  // StringField,
  NumberField,
} from '../../lib'

describe('SchemaForm.vue', () => {
  it('should render correct number field', async () => {
    let value
    const wrapper = mount(SchemaForm, {
      props: {
        schema: {
          type: 'number',
        },
        value: value,
        onChange: (v: number) => {
          value = v
        },
      },
    })
    const numberField = wrapper.findComponent(NumberField)
    expect(numberField.exists()).toBeTruthy()

    const input = numberField.find('input')

    input.element.value = '123'

    input.trigger('input')
    expect(value).toEqual('123')
  })
})
