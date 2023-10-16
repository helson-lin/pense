class FilterManage {
  filterMap = {
      blur: 'filter: blur(20px);',
      mirror: 'transform: scaleX(-1);',
      reversal: 'transform: rotateX(180deg);',
      lowContrast: 'filter: contrast(90%);'
  }
  cssSet = new Set()
  cssMap = {}

  constructor (filterMap) {
      if (filterMap) {
          this.filterMap = filterMap
      }
  }

  getCssProperty (str)  {
      const [k, v] = str.replace(';', '').split(':')
      return {
        key: k,
        value: v
      }
  }

  /**
   * @description 选择滤镜
   * @param {string} key
   * @returns
   */
  setFilter (key) {
      if (!this.filterMap[key]) return
      const isExist = this.cssSet.has(key)
      const css = this.getCssProperty(this.filterMap[key])
      if (isExist) {
          // 取消
          const cssArray = this.cssMap[css.key] || []
          if (cssArray?.includes(css.value)) {
              this.cssMap[css.key] = cssArray.filter(i => i!== css.value)
              this.cssSet.delete(key)
          }
      } else {
          this.cssSet.add(key)
          const cssArray = this.cssMap[css.key] || []
          cssArray.push(css.value)
          this.cssMap[css.key] = cssArray
      }
  }

  getFilter () {
      return Object.entries(this.cssMap).map(([k, v]) => `${k}: ${v.join(' ')};`).join('')
  }
}
export default FilterManage
