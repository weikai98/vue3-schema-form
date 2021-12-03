import { defineComponent } from 'vue'
import {
  CommonWidgetComponentDefine,
  CommonWidgetPropsDefine,
} from '../../lib/types'
import { withFormItem } from '../../lib/theme-default/FormItem'

const ColorWidget: CommonWidgetComponentDefine = withFormItem(
  defineComponent({
    name: 'ColorWidget',
    props: CommonWidgetPropsDefine,
    setup(props) {
      const handleChange = (e: any) => {
        const value = e.target.value
        e.target.value = props.value
        props.onChange(value)
      }

      return () => {
        return (
          <input
            type="color"
            value={props.value as any}
            onInput={handleChange}
          />
        )
      }
    },
  }),
)

export default ColorWidget
