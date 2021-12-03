import { inject, InjectionKey, Ref } from 'vue'
import { CommonFieldType, CommonWidgetComponentDefine, Schema } from './types'

interface ContextType {
  SchemaItem: CommonFieldType
  formatMapRef: Ref<{ [key: string]: CommonWidgetComponentDefine }>
  transformSchemaRef: Ref<(s: Schema) => Schema>
}

export const SchemaFormContextKey: InjectionKey<ContextType> = Symbol()

export function useVJSFContext(): ContextType {
  const context = inject(SchemaFormContextKey)

  if (!context) {
    throw Error('SchemaForm needed')
  }

  return context
}
