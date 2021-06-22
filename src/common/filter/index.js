import dateFormat from "./dateFormat"

const filters = {
  dateFormat,
}

export default {
  install(Vue) {
    Object.keys(filters).forEach((key) => {
      Vue.filter(key, filters[key])
    })
  }
}