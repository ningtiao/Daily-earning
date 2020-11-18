function Person (name) {
  console.log('my name is ' + name)
}

Person.prototype.sayName = function () {
  console.log(this.name)
}

function Student (name, grade) {
  Person.call(this, name)
  this.grade = grade
}

Student.prototype = Object.create(Person.prototype)
Student.prototype.constructor = Student

Student.prototype.sayMyGreade = function () {
  console.log(this.grade)
}