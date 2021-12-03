import { defineComponent, computed } from 'vue'
import { CommonWidgetComponentDefine, CommonWidgetPropsDefine } from '../types'
import { withFormItem } from './FormItem'

const NumberWidget: CommonWidgetComponentDefine = withFormItem(
  defineComponent({
    name: 'NumberWidget',
    props: CommonWidgetPropsDefine,
    setup(props) {
      const handleChange = (e: Event) => {
        const target = e.target as HTMLInputElement
        const value = target.value
        props.onChange(value)
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
            type="number"
            value={value}
            style={styleRef.value}
            onInput={handleChange}
          />
        )
      }
    },
  }),
)

export default NumberWidget
