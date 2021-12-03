import { defineComponent, PropType, computed } from 'vue'
import { FieldPropsDefine, Schema, SelectionWidgetNames } from '../types'
import { useVJSFContext } from '../context'
import { createUseStyles } from 'vue-jss'

import { getWidget } from '../theme'
// import SelectionWeidget from '../theme-default/SelectionWidget'

const useStyles = createUseStyles({
  container: {
    border: '1px solid #eee',
  },
  actions: {
    background: '#eee',
    padding: 10,
    textAlign: 'right',
  },
  action: {
    '& + &': {
      marginLeft: 10,
    },
  },
  content: {
    padding: 10,
  },
})

const ArrayItemWrapper = defineComponent({
  props: {
    onAdd: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    onDelete: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    onUp: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    onDown: {
      type: Function as PropType<(index: number) => void>,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
  setup(props, { slots }) {
    const classesRef = useStyles()
    const handleAdd = () => props.onAdd(props.index)
    const handleDelete = () => props.onDelete(props.index)
    const handleUp = () => props.onUp(props.index)
    const handleDown = () => props.onDown(props.index)
    return () => {
      const classes = classesRef.value
      return (
        <div class={classes.container}>
          <div class={classes.actions}>
            <button class={classes.action} onClick={handleAdd}>
              新增
            </button>
            <button class={classes.action} onClick={handleDelete}>
              删除
            </button>
            <button class={classes.action} onClick={handleUp}>
              上移
            </button>
            <button class={classes.action} onClick={handleDown}>
              下移
            </button>
          </div>
          <div class={classes.content}>{slots.default && slots.default()}</div>
        </div>
      )
    }
  },
})

export default defineComponent({
  props: FieldPropsDefine,
  setup(props) {
    const context = useVJSFContext()

    const handleArrayItemChange = (v: any, i: number) => {
      const valueArr = Array.isArray(props.value) ? props.value : []
      valueArr[i] = v
      props.onChange(valueArr)
    }

    const handleAdd = (index: number) => {
      const { value } = props
      const arr = Array.isArray(value) ? value : []

      arr.splice(index + 1, 0, {})

      props.onChange(arr)
    }

    const handleDelete = (index: number) => {
      const { value } = props
      const arr = Array.isArray(value) ? value : []

      arr.splice(index, 1)

      props.onChange(arr)
    }

    const handleUp = (index: number) => {
      if (index === 0) return
      const { value } = props
      const arr = Array.isArray(value) ? value : []

      const item = arr.splice(index, 1)
      arr.splice(index - 1, 0, item[0])

      props.onChange(arr)
    }

    const handleDown = (index: number) => {
      const { value } = props
      const arr = Array.isArray(value) ? value : []

      if (index === arr.length - 1) return

      const item = arr.splice(index, 1)
      arr.splice(index + 1, 0, item[0])

      props.onChange(arr)
    }

    // 样式
    const optionsRef = computed(() => {
      const { items, widget, properties, ...rest } = props.uiSchema
      return rest
    })

    const SelectionWeidgetRef = computed(() => {
      const widgetRef = getWidget(SelectionWidgetNames.SelectionWidget, props)
      return widgetRef.value
    })

    return () => {
      const { schema, rootSchema, value, errorSchema, uiSchema } = props
      const SchemaItem = context.SchemaItem

      const isMultiType = Array.isArray(schema.items)
      const isSelect = schema.items && (schema.items as Schema).enum
      const arr = Array.isArray(value) ? value : []

      if (isMultiType) {
        const items = schema.items as Schema[]
        return items.map((v, i) => {
          const uis = uiSchema.items
          const us = (Array.isArray(uis) ? uis[i] : uis) || {}
          return (
            <SchemaItem
              schema={v}
              key={i}
              value={arr[i]}
              rootSchema={rootSchema}
              errorSchema={errorSchema[i] || {}}
              uiSchema={us}
              onChange={(e) => handleArrayItemChange(e, i)}
            />
          )
        })
      } else if (!isSelect) {
        const items = schema.items as Schema

        return arr.map((v, index) => {
          //
          const uis = uiSchema.items

          return (
            <ArrayItemWrapper
              index={index}
              onAdd={handleAdd}
              onDelete={handleDelete}
              onDown={handleDown}
              onUp={handleUp}
            >
              <SchemaItem
                schema={items}
                value={v}
                key={index}
                rootSchema={rootSchema}
                errorSchema={errorSchema[index] || {}}
                uiSchema={uis || {}}
                onChange={(v: any) => handleArrayItemChange(v, index)}
              />
            </ArrayItemWrapper>
          )
        })
      } else {
        const SelectionWeidget = SelectionWeidgetRef.value
        const enums = (schema.items as Schema).enum
        const options =
          enums?.map((e) => ({
            key: e,
            value: e,
          })) || []
        return (
          <SelectionWeidget
            options={options}
            styleOptions={optionsRef.value}
            errors={errorSchema.__errors}
            {...props}
          />
        )
      }
    }
  },
})
