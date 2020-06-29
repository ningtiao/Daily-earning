

// call方法在使用一个指定的this值和run干戈指定的参数值得前提下调用某个函数或方法

var foo = {
    value: 1
}

function bar() {
    console.log(this.value)
}

bar.call(foo)
// call 改变了this的指向, 指向到foo
// bar 函数执行了

// 模拟实现第一步

var foo = {
    value: 1,
    bar: function () {
        console.log(this.value)
    }
}
foo.bar()

// 思路 1 将函数设为对象的属性 2 执行该函数 3 删除该函数 

foo.fn = bar
foo.fn()
delete foo.fn

Function.prototype.call2 = function(context) {
    // 首先要获取调用call的函数, 用this可以获取
    context.fn = this
    context.fn()
    delete context.fn()
}

var foo = {
    value: 1
}

function bar() {
    console.log(this.value)
}

bar.call2(foo) // 输出1

// 模拟实现第二部

var foo = {
    value: 1
}

function bar(name, age) {
    console.log(this.name)
    console.log(this.age)

    console.log(this.value)
}

bar.call(foo, '大白菜', 18)

// 注意: 传入的参数并不确定, 这可咋办
// 可以从arguments对象中取值, 去除第二个到最后一个参数, 然后放到数组里

// 比如这样: 

// 以上个例子为例，此时的arguments为：
// arguments = {
//      0: foo,
//      1: 'kevin',
//      2: 18,
//      length: 3
// }
// 因为arguments是类数组对象，所以可以用for循环

var args = [];
for(var i = 1, len = arguments.length; i < len; i++) {
    args.push('arguments[' + i + ']');
}

Function.prototype.call2 = function(context) {
    context.fn = this
    var args =  []
    for (var i =1,len = arguments.length;i<len;i++) {
        args.push('argumens['+i+']');
    }
    eval('context.fn('+args+')');
    delete context.fn
}

var foo = {
    value: 1
}

function bar(name, age) {
    console.log(name)
    console.log(age)
    console.log(this.value)
}
bar.call2(foo, 'kein', 18)