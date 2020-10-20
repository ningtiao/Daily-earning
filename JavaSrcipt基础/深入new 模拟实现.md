```js
function Otatu(name, age) {
  this.name = name;
  this.age = age;

  this.habit = "Games";
}
Otatu.prototype.strength = 60;

Otatu.prototype.sayYourName = function () {
  console.log("I am" + this.name);
};

var person = new Otatu("Kevin", 18);

console.log(person.name); // Kevin
console.log(person.habit); // Games
console.log(person.strength);

person.sayYourName(); // I am Kevin
```

### 第一版

```js
function objectFactory() {
  var obj = new Object();
  Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype;
  Constructor.apply(obj, arguments);
  return obj;
}
```

```js
function Otatu(name, age) {
  this.name = name;
  this.age = age;

  this.habit = "Games";
}
Otatu.prototype.strength = 60;

Otatu.prototype.sayYourName = function () {
  console.log("I am" + this.name);
};

function objectFactory() {
  var obj = new Object();
  Constructor = [].shift.call(arguments);
  obj.__proto__ = Constructor.prototype;
  Constructor.apply(obj, arguments);
  return obj;
}

var person = objectFactory(Otatu, "kevin", 18);

console.log(person.name); // Kevin
console.log(person.habit); // Games
console.log(person.strength); // 60

person.sayYourName(); // I am Kevin
```

### 返回值效果实现

```js
function student(name, age) {
  this.strength = 60;
  this.age = age;
  return {
    name: name,
    habit: "Games",
  };
}
```

### 第二版代码实现

```js
function objectFactory () {
  var obj = new Object()
  Constructor = [].shift().call(arguments)

  obj.__proto__ = Constructor.prototype;

  var res = Constructor.apply(obj, arguments)

  return typeof ret ==== 'object' ? ret : obj
}
```
