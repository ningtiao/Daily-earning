### 几种前端储存以及它们之间的区别

- cookies： HTML5 之前本地储存的主要方式，大小只有 4k，HTTP 请求头会自动带上 cookie，兼容性好
- localStorage：HTML5 新特性，持久性存储，即使页面关闭也不会被清除，以键值对的方式存储，大小为 5M
- sessionStorage：HTML5 新特性，操作及大小同 localStorage，和 localStorage 的区别在于 sessionStorage 在选项卡(页面)被关闭时即清除，且不同选项卡之间的 sessionStorage 不互通
- IndexedDB： NoSQL 型数据库，类比 MongoDB，使用键值对进行储存，异步操作数据库，支持事务，储存空间可以在 250MB 以上，但是 IndexedDB 受同源策略限制
- Web SQL：是在浏览器上模拟的关系型数据库，开发者可以通过 SQL 语句来操作 Web SQL，是 HTML5 以外一套独立的规范，兼容性差

### HTML5 在标签、属性、存储、API 上的新特性

- 标签：新增语义化标签（aside / figure / section / header / footer / nav 等），增加多媒体标签 video 和 audio，使得样式和结构更加分离
- 属性：增强表单，主要是增强了 input 的 type 属性；meta 增加 charset 以设置字符集；script 增加 async 以异步加载脚本
- 存储：增加 localStorage、sessionStorage 和 indexedDB，引入了 application cache 对 web 和应用进行缓存
- API：增加拖放 API、地理定位、SVG 绘图、canvas 绘图、Web Worker、WebSocket
