import { getWidget } from '../theme'
import { defineComponent, computed } from 'vue'
import { FieldPropsDefine, CommonWidgetNames } from '../types'

export default defineComponent({
  props: FieldPropsDefine,
  setup(props) {
    const TextWeidgetRef = computed(() => {
      const widgetRef = getWidget(CommonWidgetNames.TextWidget, props)
      return widgetRef.value
    })
    const optionsRef = computed(() => {
      const { items, widget, properties, ...rest } = props.uiSchema
      return rest
    })
    return () => {
      const { errorSchema, ...rest } = props
      const TextWeidget = TextWeidgetRef.value
      return (
        <TextWeidget
          {...rest}
          styleOptions={optionsRef.value}
          errors={errorSchema.__errors}
        />
      )
    }
  },
})
