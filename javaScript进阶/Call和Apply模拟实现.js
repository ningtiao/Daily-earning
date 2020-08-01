// call例子
var foo = {
  value: 1
}

function bar() {
  console.log(this.value)
}

bar.call(foo)

// call改变了this的指向,指向到foo

// bar 函数执行了

// 模拟实现第一步
var foo = {
  value: 1,
  bar: function() {
    console.log(this.value);
  }
}

foo.bar()


Function.prototype.myCall = function(context) {
  context.fn = this
  context.fn()
  delete context.fn();
}

// 测试一下
var foo = {
  value: 1
}

function bar() {
  console.log(this.value)
}

bar.myCall(foo)
// 第二版
Function.prototype.myCall = function(context) {
  context.fn = this;
  var args = [];

  for (var i = 1, len = arguments.length;i< len;i++) {
    args.push('arguments['+ i + ']')
  }
  eval('context.fn('+ args +')');
  delete context.fn
}