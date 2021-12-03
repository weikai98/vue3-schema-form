import { defineComponent, computed } from 'vue'
import { FieldPropsDefine, CommonWidgetNames } from '../types'
import { getWidget } from '../theme'

// 为什么不直接导入
// import NumberWeidget from '../theme-default/NumberWeidget'

export default defineComponent({
  props: FieldPropsDefine,
  setup(props) {
    const handleChange = (value: string) => {
      const v = isNaN(Number(value)) ? 0 : Number(value)
      props.onChange(v)
    }
    const NumberWeidgetRef = computed(() => {
      const widgetRef = getWidget(CommonWidgetNames.NumberWidget, props)
      return widgetRef.value
    })

    const optionsRef = computed(() => {
      const { items, widget, properties, ...rest } = props.uiSchema
      return rest
    })

    return () => {
      const { rootSchema, errorSchema, ...rest } = props
      const NumberWeidget = NumberWeidgetRef.value
      return (
        <NumberWeidget
          {...rest}
          styleOptions={optionsRef.value}
          errors={errorSchema.__errors}
          onChange={handleChange}
        />
      )
    }
  },
})
