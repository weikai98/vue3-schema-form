import { defineComponent, computed } from 'vue'
import { CommonWidgetComponentDefine, CommonWidgetPropsDefine } from '../types'
import { withFormItem } from './FormItem'

const TextWidget: CommonWidgetComponentDefine = withFormItem(
  defineComponent({
    name: 'TextWidget',
    props: CommonWidgetPropsDefine,
    setup(props) {
      const handleChange = (e: Event) => {
        const target = e.target as HTMLInputElement
        props.onChange(target.value)
      }

      const styleRef = computed(() => {
        return {
          color: 'black',
          ...props.styleOptions,
        }
      })
      return () => {
        const { value } = props
        return (
          <input
            type="text"
            value={value}
            style={styleRef.value}
            onInput={handleChange}
          />
        )
      }
    },
  }),
)

export default TextWidget
