import { PropType, defineComponent, DefineComponent } from 'vue'
import { ErrorSchema } from './validator'
import { FormatDefinition, KeywordDefinition, CompilationContext } from 'ajv'

export enum SchemaTypes {
  'NUMBER' = 'number',
  'INTEGER' = 'integer',
  'STRING' = 'string',
  'OBJECT' = 'object',
  'ARRAY' = 'array',
  'BOOLEAN' = 'boolean',
}

type SchemaRef = { $ref: string }

// type Schema = any
export interface Schema {
  type?: SchemaTypes | string
  const?: any
  format?: string

  title?: string
  default?: any

  properties?: {
    [key: string]: Schema
  }
  items?: Schema | Schema[] | SchemaRef
  uniqueItems?: any
  dependencies?: {
    [key: string]: string[] | Schema | SchemaRef
  }
  oneOf?: Schema[]
  anyOf?: Schema[]
  allOf?: Schema[]
  // TODO: uiSchema
  // vjsf?: VueJsonSchemaConfig
  required?: string[]
  enum?: any[]
  enumNames?: any[]
  enumKeyValue?: any[]
  additionalProperties?: any
  additionalItems?: Schema

  minLength?: number
  maxLength?: number
  minimun?: number
  maximum?: number
  multipleOf?: number
  exclusiveMaximum?: number
  exclusiveMinimum?: number
}

export const FieldPropsDefine = {
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
  rootSchema: {
    type: Object as PropType<Schema>,
  },
  errorSchema: {
    type: Object as PropType<ErrorSchema>,
    required: true,
  },
  uiSchema: {
    type: Object as PropType<UISchema>,
    required: true,
  },
} as const

export const TypeHelperComponent = defineComponent({
  props: FieldPropsDefine,
})

export type CommonFieldType = typeof TypeHelperComponent

export const CommonWidgetPropsDefine = {
  value: {},
  onChange: {
    type: Function as PropType<(v: any) => void>,
    required: true,
  },
  errors: {
    type: Array as PropType<string[]>,
  },
  schema: {
    type: Object as PropType<Schema>,
    required: true,
  },
  styleOptions: {
    type: Object as PropType<{ [keys: string]: any }>,
  },
} as const

export const SelectionWidgetPropsDefine = {
  ...CommonWidgetPropsDefine,
  options: {
    type: Array as PropType<
      {
        key: string
        value: any
      }[]
    >,
    required: true,
  },
} as const

export type CommonWidgetComponentDefine = DefineComponent<
  typeof CommonWidgetPropsDefine
>

export type SelectionWidgetComponentDefine = DefineComponent<
  typeof SelectionWidgetPropsDefine
>
export type WidgetComponentDefine =
  | SelectionWidgetComponentDefine
  | CommonWidgetComponentDefine

export enum SelectionWidgetNames {
  SelectionWidget = 'SelectionWidget',
}

export enum CommonWidgetNames {
  TextWidget = 'TextWidget',
  NumberWidget = 'NumberWidget',
}

export interface Widgets {
  [SelectionWidgetNames.SelectionWidget]: SelectionWidgetComponentDefine
  [CommonWidgetNames.NumberWidget]: CommonWidgetComponentDefine
  [CommonWidgetNames.TextWidget]: CommonWidgetComponentDefine
}

export interface Theme {
  widgets: Widgets
}

// UISchema中其他样式
export type UISchema = {
  // 组件应该是个  或者 组件类型
  widget?: string | CommonWidgetComponentDefine
  // 对象类型
  properties?: {
    [key: string]: any
  }
  // array 类型应该是单类型 或者数组组合类型
  items?: UISchema | UISchema[]
} & {
  [key: string]: any
}

export interface CustomFormat {
  name: string
  definition: FormatDefinition
  component: CommonWidgetComponentDefine
}

interface VjsfKeywordDefinition {
  type?: string | Array<string>
  async?: boolean
  $data?: boolean
  errors?: boolean | string
  metaSchema?: Record<string, any>
  // schema: false makes validate not to expect schema (ValidateFunction)
  schema?: boolean
  statements?: boolean
  dependencies?: Array<string>
  modifying?: boolean
  valid?: boolean
  // one and only one of the following properties should be present
  macro: (
    schema: any,
    parentSchema: Record<string, any>,
    it: CompilationContext,
  ) => Record<string, any> | boolean
}

export interface CustomKeyword {
  name: string
  deinition: VjsfKeywordDefinition
  transformSchema: (originSchema: Schema) => Schema
}

// type getTypes<T, K extends keyof T, C extends keyof T[K]> = T[K][C]

// type a = getTypes<Theme, 'widget', keyof Theme['widget']>

// type Book={
//   name: string,
//   age:number
// }
// type R<T> =T  typeof keyof Book
