import Vue from 'vue'
import {
  Dialog,
  Popover,
  Input,
  Select,
  Option,
  Card,
  Form,
  FormItem,
  Button,
  DatePicker
} from 'element-ui'

export default class Element {
  static install () {
    Vue.use(Dialog)
    Vue.use(Popover)
    Vue.use(Input)
    Vue.use(Select)
    Vue.use(Option)
    Vue.use(Card)
    Vue.use(Form)
    Vue.use(FormItem)
    Vue.use(Button)
    Vue.use(DatePicker)
  }
}
