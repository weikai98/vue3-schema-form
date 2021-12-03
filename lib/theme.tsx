import {
  computed,
  defineComponent,
  inject,
  PropType,
  provide,
  ref,
  ComputedRef,
  ExtractPropTypes,
} from 'vue'
import { useVJSFContext } from './context'
import {
  Theme,
  SelectionWidgetNames,
  CommonWidgetNames,
  UISchema,
  CommonWidgetComponentDefine,
  FieldPropsDefine,
} from './types'
import { isObject } from './utils'

const THEME_PROVIDER_KEY = Symbol()

const ThemeProvider = defineComponent({
  name: 'VJSFThemeProvider',
  props: {
    theme: {
      type: Object as PropType<Theme>,
      required: true,
    },
  },
  setup(props, { slots }) {
    const context = computed(() => props.theme)

    provide(THEME_PROVIDER_KEY, context)
    return () => slots.default && slots.default()
  },
})

export function getWidget<T extends CommonWidgetNames | SelectionWidgetNames>(
  name: T,
  props?: ExtractPropTypes<typeof FieldPropsDefine>,
) {
  const formatContext = useVJSFContext()
  if (props) {
    const { uiSchema, schema } = props
    if (uiSchema?.widget && isObject(uiSchema?.widget)) {
      return ref(uiSchema?.widget as CommonWidgetComponentDefine)
    }
    // format 组件自定义
    if (schema.format) {
      const formatMap = formatContext.formatMapRef.value
      if (formatMap[schema.format]) {
        return ref(formatMap[schema.format])
      }
    }
  }

  const context = inject<ComputedRef<Theme>>(THEME_PROVIDER_KEY)
  if (!context) {
    throw new Error('vjsf theme required')
  }
  const widgetRef = computed(() => {
    return context.value.widgets[name]
  })
  return widgetRef
}

export default ThemeProvider
