


###

### 什么是 TypeScript
* TypeScript 是 JavaScript 的一个超集，主要提供了类型系统和对 ES6 的支持
const num: number = 123 // xxx: number表示声明一个number类型



* 声明一个函数的参数类型(number以及any)和返回值(void)
```
function fn (arg1: number, arg2: any) : void {
}
fn(num, [1, 2, 3, 4])
```
   

* 声明一个接口

```
interface IPerson {
    name: string // IPerson需要包含一个name属性，类型是string
    age: number // IPerson需要包含一个age属性，类型是number
    family: string[] // IPerson需要包含一个family属性，类型是数组，数组里面都是string类型的数据
    sex?: '男' | '女' // IPerson可选一个sex属性，值为'男'或者'女'或者undefined
}
```

* 使用IPerson接口定义一个对象，如果对象不符合IPerson的定义，编译器会飘红报错

```
const person: IPerson = {
    name: '大白菜',
    age: 25,
    family: ['foo', 'bar']
}
```

* type类似interface，以下写法等同用interface声明IPerson

```
type IPerson2 = {
    name: string
    age: number
    family: string[]
    sex?: '男' | '女'
}
// 因此可以直接定义过来
const person2: IPerson2 = person
```


* 一般情况下，ts需要编译成js才能运行。可通过babel编译

1. 应用场景
```
interface Args {
    name: string,
    age: string
}

function Foo (arg1: string, arg2: 'a' | 'b', arg3: Args) {

}

Foo('sss', 'a', {
    name: '小明',
    age: '25'
})
```
### TS的优点及不足
* TS的优点及不足
* 清晰的函数参数/接口属性, 增加了代码可读性和可维护性
* 静态类型检查
*  生成api文档
* 增强了编辑器和 IDE 的功能，包括代码补全、接口提示、跳转到定义、重构等
* 可以在编译阶段就发现大部分错误，这总比在运行时候出错好
* 配合现代编辑器,各种提示
* 活跃的社区
### 缺点 
* 有一定的学习成本，需要理解接口（Interfaces）、泛型（Generics）、类（Classes）、枚举类型（Enums）等不是很熟悉的概念
* 可能和一些库结合的不是很完美
* 集成到构建流程需要一些工作量