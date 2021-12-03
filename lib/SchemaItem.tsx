import { defineComponent, computed } from 'vue'
import { FieldPropsDefine, SchemaTypes } from './types'
import StringField from './fields/StringField'
import NumberField from './fields/NumberField'
import ArrayField from './fields/ArrayField'
import ObjectField from './fields/ObjectField'
import { retrieveSchema } from './utils'
import { useVJSFContext } from './context'

export default defineComponent({
  props: FieldPropsDefine,
  setup(props) {
    // 解析不同类型的FieldItem
    const context = useVJSFContext()
    const retrievedSchemaRef = computed(() => {
      const { schema, rootSchema, value } = props
      return context.transformSchemaRef.value(
        retrieveSchema(schema, rootSchema, value),
      )
    })
    return () => {
      const { schema } = props

      const retrievedSchema = retrievedSchemaRef.value

      const type = schema.type
      let Components
      switch (type) {
        case SchemaTypes.STRING:
          Components = StringField
          break
        case SchemaTypes.NUMBER:
          Components = NumberField
          break
        case SchemaTypes.OBJECT:
          Components = ObjectField
          break
        case SchemaTypes.ARRAY:
          Components = ArrayField
          break
        default:
          Components = StringField
          break
      }
      return <Components {...props} schema={retrievedSchema} />
    }
  },
})
