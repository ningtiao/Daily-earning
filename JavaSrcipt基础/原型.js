function Person () {} // 构造函数

var person = new Person(); // new 创建了一个实例对象
person.name = '大白菜';

console.log(person.name) // 大白菜

// 每个函数都有一个prototype 属性，就是我们经常在各种例子中看到的那个 prototype 比如：

function Person () {

}

Person.prototype.name = '大白菜'

var Person1 = new Person();
var Person2 = new Person();

console.log(Person1.name) // 大白菜
console.log(Person2.name) // 大白菜

// 其实，函数的 prototype 属性指向了一个对象，这个对象正是调用该构造函数而创建的实例的原型，也就是这个例子中的 person1 和 person2 的原型。

// 那么原型是什么？
// 每一个JavaScript 对象 null 除外在创建的时候就会与之关联另一个对象，这个对象就是原型，
// 每一个对象都会从原型继承属性。

// __proto__

// 这是每一个JavaScript对象(除了 null )都具有的一个属性，叫__proto__，这个属性会指向该对象的原型。

function Person() {

}

var person = new Person();

console.log(person.__proto__ === Person.prototype); // true


Coustructor

// 每一个原型都有一个constructor 属性指向关联的构造函数
function Person () {

}

console.log(Person === Person.prototype.constructor) // true

function Person () {}

var Person = new Person();

console.log(person.__proto__ == Person.prototype) // true
console.log(Person.prototype.constructor == Person) // true

console.log(Object.getPrototypeOf(person) === Person.prototype) // true