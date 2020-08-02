### 关于this的总结
- 沿着作用域向上找最近的一个`function`,看这个`function`最终是怎样支持的
- this的指向取决于所属`function`的调用方式,而不是定义
- function调用一般分为以下几种情况

1. 作为函数调用,即: foo()
  - 指向全局对象,注意严格模式问题
2. 作为方法调用,即: foo.bar() / foo.bar.baz()
  - 指向最终调用这个方法的对象
3. 作为构造函数调用,即: new Foo()
  - 指向一个新对象Foo()
4. 特殊作用域, 即: foo.call() / foo.apply()
  - 参数指定成员

谢天谢地,以后再无this问题...