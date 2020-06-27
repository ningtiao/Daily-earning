function Otaku(name, age) {
  this.name = name;
  this.age = age;
  this.habit = 'Games'
}

Otaku.prototype.strength = 60;
Otaku.prototype.sayYourName = function() {
  console.log('I am' + this.name)
}

var person = new Otaku('kevin', '18');
console.log(person.name) // Kevin
console.log(person.habit) // Games
console.log(person.strength) // 60
person.sayYourName()

// 第一版
function objectFactory() {
  var obj = new Object(),
  Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype;
  Constructor.apply(obj, arguments);
  return obj
}




function Otaku(name, age) {
  this.name = name;
  this.age = age;
  this.habit = 'Games';
}

Otaku.prototype.strength = 60;

Otaku.prototype.sayYourName =  function() {
  console.log('I am' + this.name)
}

function objectFactory() {
  var obj = new Object,
  Constructor = [].shift.call(arguments)
  obj.__proto__ = Constructor.prototype
  Constructor.apply(obj, arguments)
  return obj
}

var person = objectFactory(Otaku, 'Kevin', '18')
console.log(person.name);
console.log(person.habit);
console.log(person.strength);

person.sayYourName()


// 有构造函数返回值
function Otaku(name, age) {
  this.strength = 60;
  this.age = age;
  return {
    name: name,
    habit: 'Games';
  }
}
var person = new Otaku('Kevin', '18');
console.log(person.name);
console.log(person.habit);
console.log(person.strength);
console.log(person.age);

// 第二版
function objectFactory() {
  var obj = new Object(),
  Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype;

  var ret = Constructor.apply(obj, arguments)
  return typeof ret === 'object' ? ret : obj
}

function objectFactory () {
  var obj = Object.create(null)
  Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype;

  let ret = Constructor.apply(obj, arguments)
  return typeof ret === 'object' ? ret : obj
}


function objectFactory() {

  var obj = new Object(),//从Object.prototype上克隆一个对象

  Constructor = [].shift.call(arguments);//取得外部传入的构造器

  var F = function(){};
  F.prototype = Constructor.prototype;
  obj=new F();//指向正确的原型

  var ret = Constructor.apply(obj, arguments);//借用外部传入的构造器给obj设置属性

  return typeof r
};

function objectFactory() {
  var obj = Object.create(null),
  Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype;
  var ret = Constructor.apply(obj, arguments)
  return typeof ret === 'object' ? ret: obj
}

// 第三版

Function.prototype.call2 = function(context) {
  context.fn = this;
  var args = []

  for (var i = 1, len = arguments.length;i < len;i++) {
    args.push('arguments['+ i +']')
  }
  var result = eval('context.fn('+ args +')')

  delete context.fn
  return result
}

// apply的模拟实现

Function.prototype.myApply = function(context) {
  var context = Object(context) || window;
  context.fn = this;

  var result;
  if (!arr) {
    result = context.fn();
  } else {
    var args = [];
    for (var i = 1, len = arguments.length;i < len;i++) {
      args.push('arr['+ i +']');
    }
    result = eval('context.fn('+ args +')')
  }
  delete context.fn;
  return result
}