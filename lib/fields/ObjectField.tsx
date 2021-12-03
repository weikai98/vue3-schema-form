import { defineComponent, computed } from 'vue'
import { FieldPropsDefine } from '../types'
import { useVJSFContext } from '../context'
import { isObject } from '../utils'

export default defineComponent({
  props: FieldPropsDefine,
  setup(props) {
    const context = useVJSFContext()
    const handleChange = (key: string, v: any) => {
      const value: any = isObject(props.value) ? props.value : {}

      value[key] = v
      props.onChange(value)
    }

    return () => {
      const { schema, rootSchema, value, errorSchema, uiSchema } = props
      const SchemaItem = context.SchemaItem
      const properties = schema.properties || {}
      const currentValue: any = isObject(value) ? value : {}
      return Object.keys(properties).map((key) => {
        const uiS = uiSchema.properties ? uiSchema.properties[key] || {} : {}
        return (
          <SchemaItem
            schema={properties[key]}
            value={currentValue[key]}
            rootSchema={rootSchema}
            errorSchema={errorSchema[key] || {}}
            uiSchema={uiS}
            onChange={(v) => handleChange(key, v)}
          />
        )
      })
    }
  },
})
