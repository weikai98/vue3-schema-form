import { defineComponent } from 'vue'
import {
  CommonWidgetComponentDefine,
  CommonWidgetPropsDefine,
} from '../../lib/types'
import { withFormItem } from '../../lib/theme-default/FormItem'

const PasswordWidget: CommonWidgetComponentDefine = withFormItem(
  defineComponent({
    name: 'TextWidget',
    props: CommonWidgetPropsDefine,
    setup(props) {
      const handleChange = (e: Event) => {
        const target = e.target as HTMLInputElement
        props.onChange(target.value)
      }
      return () => {
        const { value } = props
        return <input type="password" value={value} onInput={handleChange} />
      }
    },
  }),
)

export default PasswordWidget
