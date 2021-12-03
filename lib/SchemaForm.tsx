import {
  defineComponent,
  PropType,
  provide,
  Ref,
  watch,
  shallowRef,
  watchEffect,
  ref,
  computed,
} from 'vue'
import SchemaItem from './SchemaItem'
import {
  Schema,
  UISchema,
  CustomFormat,
  CustomKeyword,
  CommonWidgetComponentDefine,
} from './types'
import { SchemaFormContextKey } from './context'
import Ajv, { Options } from 'ajv'

import { validateFormData, ErrorSchema } from './validator'

interface ErrorResult {
  errors: any[]
  valid: boolean
}

interface ContextRef {
  doValidate: () => Promise<ErrorResult>
}
const defaultAjvOptions: Options = {
  allErrors: true,
  // jsonPointers: true,
}

export default defineComponent({
  props: {
    schema: {
      type: Object as PropType<Schema>,
      required: true,
    },
    value: {
      required: true,
    },
    onChange: {
      type: Function as PropType<(v: any) => void>,
      required: true,
    },
    contextRef: {
      type: Object as PropType<Ref<ContextRef> | undefined>,
    },
    ajvOptions: {
      type: Object as PropType<Options>,
    },
    customValidate: {
      type: Function as PropType<(data: any, error: any) => void>,
    },
    customFormats: {
      type: Array as PropType<CustomFormat[] | CustomFormat>,
    },
    customKeywords: {
      type: Array as PropType<CustomKeyword[] | CustomKeyword>,
    },
    locale: {
      type: String,
      default: 'zh',
    },
    uiSchema: {
      type: Object as PropType<UISchema>,
    },
  },
  setup(props) {
    const handleChange = (v: Event) => {
      props.onChange(v)
    }
    const validatorRef: Ref<Ajv.Ajv> = shallowRef() as any
    const errorSchemaRef: Ref<ErrorSchema> = shallowRef({})
    const validateIndex = ref(0)

    watchEffect(() => {
      validatorRef.value = new Ajv({
        ...defaultAjvOptions,
        ...props.ajvOptions,
      })
      if (props.customFormats) {
        const customFormats = Array.isArray(props.customFormats)
          ? props.customFormats
          : [props.customFormats]
        customFormats.forEach((f) => {
          validatorRef.value.addFormat(f.name, f.definition)
        })
      }

      if (props.customKeywords) {
        const customKeywords = Array.isArray(props.customKeywords)
          ? props.customKeywords
          : [props.customKeywords]
        customKeywords.forEach((f) => {
          validatorRef.value.addKeyword(f.name, f.deinition)
        })
      }
    })
    const validateResolveRef = ref()

    async function doValidate(resolve: (res: ErrorResult) => void) {
      console.log('start validate -------->')
      // 当value值发生变化，重新开始校验
      const index = (validateIndex.value += 1)

      const result = await validateFormData(
        validatorRef.value,
        props.value,
        props.schema,
        props.locale,
        props.customValidate,
      )
      // 如果不是最后一次变化校验，则直接返回
      if (index !== validateIndex.value) return
      console.log('end validate -------->')

      errorSchemaRef.value = result.errorSchema
      resolve(result)
    }

    watch(
      () => props.value,
      () => {
        if (validateResolveRef.value) {
          doValidate(validateResolveRef.value)
        }
      },
      { deep: true },
    )
    watch(
      () => props.contextRef,
      (newVal) => {
        if (newVal) {
          newVal.value = {
            doValidate() {
              return new Promise((resolve) => {
                validateResolveRef.value = resolve
                doValidate(resolve)
              })
            },
          }
        }
      },
      {
        immediate: true,
      },
    )

    const formatMapRef = computed(() => {
      if (props.customFormats) {
        const customFormats = Array.isArray(props.customFormats)
          ? props.customFormats
          : [props.customFormats]
        return customFormats.reduce((res, format) => {
          res[format.name] = format.component
          return res
        }, {} as { [key: string]: CommonWidgetComponentDefine })
      } else {
        return {}
      }
    })

    const transformSchemaRef = computed(() => {
      if (props.customKeywords) {
        const customFormats = Array.isArray(props.customKeywords)
          ? props.customKeywords
          : [props.customKeywords]
        return (schema: Schema) => {
          let newSchema = schema
          customFormats.forEach((k) => {
            if ((schema as any)[k.name]) {
              newSchema = k.transformSchema(schema)
            }
          })
          return newSchema
        }
      } else {
        return (schema: Schema) => schema
      }
    })

    const context = {
      SchemaItem,
      formatMapRef,
      transformSchemaRef,
    }
    provide(SchemaFormContextKey, context)

    return () => {
      const { schema, value, uiSchema } = props
      return (
        <SchemaItem
          schema={schema}
          rootSchema={schema}
          value={value}
          onChange={handleChange}
          uiSchema={uiSchema || {}}
          errorSchema={errorSchemaRef.value || {}}
        ></SchemaItem>
      )
    }
  },
})
