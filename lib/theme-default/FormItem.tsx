import { defineComponent, DefineComponent } from 'vue'
import { CommonWidgetPropsDefine, Schema } from '../types'

import { createUseStyles } from 'vue-jss'

const useStyles = createUseStyles({
  container: {},
  label: {
    display: 'block',
    color: '#777',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    margin: '5px 0',
    padding: 0,
    paddingLeft: 20,
  },
})

const FormItem = defineComponent({
  name: 'FormItem',
  props: CommonWidgetPropsDefine,
  setup(props, { slots }) {
    const classesRef = useStyles()
    return () => {
      const { schema, errors } = props
      const classes = classesRef.value
      const title = (schema as Schema).title
      return (
        <div class={classes.container}>
          <label class={classes.label}>{title}</label>
          {slots.default && slots.default()}
          <ul class={classes.errorText}>
            {errors?.map((err) => (
              <li>{err}</li>
            ))}
          </ul>
        </div>
      )
    }
  },
})

export default FormItem

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
