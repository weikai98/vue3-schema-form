import { defineComponent, ref, watch, computed } from 'vue'
import {
  SelectionWidgetPropsDefine,
  SelectionWidgetComponentDefine,
} from '../types'
import { withFormItem } from './FormItem'

const SelectionWidget: SelectionWidgetComponentDefine = withFormItem(
  defineComponent({
    name: 'SelectionWidget',
    props: SelectionWidgetPropsDefine,
    setup(props) {
      const currentValueRef = ref(props.value)
      watch(currentValueRef, (newv) => {
        if (newv !== props.value) {
          props.onChange(newv)
        }
      })
      watch(
        () => props.value,
        (v) => {
          if (v !== currentValueRef.value) {
            currentValueRef.value = v
          }
        },
      )
      const styleRef = computed(() => {
        return {
          color: 'black',
          ...props.styleOptions,
        }
      })

      return () => {
        const { options } = props
        return (
          <select
            multiple={true}
            v-model={currentValueRef.value}
            style={styleRef.value}
          >
            {options.map((op) => (
              <option value={op.value}> {op.key}</option>
            ))}
          </select>
        )
      }
    },
  }),
)
export default SelectionWidget
