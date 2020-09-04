let _Vue = null
export default class VueRouter {
  static install (Vue) {
    // 1、判断当前插件是否已经安装
    if (VueRouter.install.installed) {
      return
    }
    VueRouter.install.installed = true
    // 2、把Vue 构造函数记录到全局变量
    _Vue = Vue
    // 3、把创建Vue实例时候传入的router 对象注入到VUe实例
    // 混入
    _Vuemin({
      beforeCreate() {
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.$router
          this.$options.router.init()
        }
      },
    })
  }

  constructor (options) {
    this.options = options
    this.routerMap = {}
    this.data = _Vue.observable({
      current: '/'
    })
  }

  init () {
    this.createRouterMap()
    this.initComponents(_Vue)
    this.initEvent()
  }

  createRouterMap () {
    // 遍历所有的路由规则，把路由规则解析成键值对形式， 存储到routerMap对象中
    this.options.routes.forEach(route => {
      this.routerMap[route.path] = route.component
    })
  }

  initComponents (Vue) {
    Vue.component('router-link', {
      props: {
        to: String
      },
      render (h) {
        return h('a', {
          href: this.to
        }, [this.$slots.default])
      }
      // template: '<a :href="to"><slot></slot></a>'
    })
  }

  initEvent () {
    window.addEventListener('popstate', () => {
      this.data.current = window.location.pathname
    })
  }
}