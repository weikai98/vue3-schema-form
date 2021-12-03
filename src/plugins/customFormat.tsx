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
