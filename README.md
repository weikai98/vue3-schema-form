# JSON Schema Form 功能及实现

## 系统功能

### 1. 通过 Schema 类型的 JSON 数据

#### 1. 生成的 Field 的类型

1. string 类型 input text
2. number 类型 input number
3. array 类型 区分类型 数组类型的 items 类型
   · 对象类型
   · 数组类型
   · 单类型 即 数组中都是同一个类型，enums
4. Object 类型 需要递归的去判断 每个键值对应的类型

### 2. 校验功能的核心是使用 AJV JSON Scheam validator 的校验功能，通过校验生成错误信息

```javascript
const Ajv = require('ajv')
const ajv = new Ajv({ allErrors: true })

const schema = {
  type: 'object',
  properties: {
    foo: { type: 'integer' },
    bar: { type: 'string' },
  },
  required: ['foo'],
  additionalProperties: false,
}

const validate = ajv.compile(schema)

const data = {
  foo: 1,
  bar: 'abc',
}

const valid = validate(data)
if (!valid) console.log(validate.errors)
```

3. 主题系统 theme 组件

   思想： 为什么要抽离 widget 组件类型打包成新的 theme 样式库？

   3.1 当组件样式及主题修改的时候，不需要再去修改核心代码,主题逻辑被抽离出去

```javascript
const NumberWeidgetRef = computed(() => {
  const widgetRef = getWidget(CommonWidgetNames.NumberWidget, props)
  return widgetRef.value
})
```

3.2 包裹组件 FormItem, label 与 input 该如何显示，如何组装？

通过高阶组件包裹 FormItem 与 widgetComponents 主题组件
修改主题或者 FormItem 不需要互相影响逻辑，减少耦合

```javascript
export function withFormItem(widgetComponents: any): any {
  return defineComponent({
    name: `Wrapped${widgetComponents.name}`,
    props: CommonWidgetPropsDefine,
    setup(props, { attrs, slots }) {
      return () => {
        return (
          <FormItem {...props}>
            <widgetComponents {...props} {...attrs} {...slots} />
          </FormItem>
        )
      }
    },
  })
}
```

## 用户自定义功能 uiSchema

4.1 自定义组件

例如：PasswordWidget

```javascript
  import { defineComponent } from 'vue'
  import {
    CommonWidgetComponentDefine,
    CommonWidgetPropsDefine,
  } from '../../lib/types'
  import { withFormItem } from '../../lib/theme-default/FormItem'

  const PasswordWidget: CommonWidgetComponentDefine = withFormItem(
    defineComponent({
      name: 'TextWidget',
      props: CommonWidgetPropsDefine,
      setup(props) {
        const handleChange = (e: Event) => {
          const target = e.target as HTMLInputElement
          props.onChange(target.value)
        }
        return () => {
          const { value } = props
          return <input type="password" value={value} onInput={handleChange} />
        }
      },
    }),
  )

```

使用 uiSchema 对应的键值去替换 widget

```javascript
  uiSchema: {
    properties: {
      pass1: {
        widget: PasswordWidget,
      }
    },
  },
```

### 自定义组件样式

```javascript

  uiSchema: {
    properties: {
      pass2: {
        color: 'red',
        height: '20px',
        display: 'flex',
      }
    },
  },
```

## 局限

1. 针对的是哪个组件的样式？目标不明确
2. 如果 FormItem 现在确定有 label 和 widget 两个组件样式需要动态修改，怎么设计

## 集成 AJV Schema Form 中的 addFormat 与 addKeyword

### 自定义 format 的自定义组件渲染

```javascript
  // 使用
  pass3: {
    type: 'string',
    format: 'colorFormat',
    title: 'use color',
  },

  // 定义
  import { CustomFormat } from '../../lib/types'
  import ColorWidget from '../components/ColorWidget'
  // import PasswordWidget from '../components/PasswordWidget'

  const colorFormat: CustomFormat = {
    name: 'colorFormat',
    definition: {
      type: 'string',
      validate: /^#[0-9A-Fa-f]{6}$/,
    },
    component: ColorWidget,
  }
  export default colorFormat

```

### 自定义校验, 在 Schema 中 创建新的校验字段

```javascript
// 使用
pass4: {
  type: 'string',
  title: 'use color2',
  test: true,
},

// 定义
import { CustomKeyword } from '../../lib/types'

const keyword: CustomKeyword = {
  name: 'test',
  deinition: {
    macro: () => {
      return {
        minLength: 10,
      }
    },
  },
  transformSchema(schema) {
    return {
      ...schema,
      minLength: 10,
    }
  },
}

export default keyword
```
