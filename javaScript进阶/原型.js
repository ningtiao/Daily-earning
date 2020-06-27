function Person() {}

Person.prototype.name = 'Kevin'

var person1 = new Person()

var person2 = new Person()
console.log(person1.name)
console.log(person2.name)