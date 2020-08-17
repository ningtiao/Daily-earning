class MobilePhoneFactory {
  createOS () {
    throw new Error('抽象工厂方法不允许直接调用,你需要将我重写！')
  }
  createHardWare () {
    throw new Error('抽象工厂方法不允许直接调用,你需要将我重写')
  }
}

class FakeStarFactory extends MobilePhoneFactory {
  createOS() {
    return new AndroidOS()
  }
  createHardWare () {
    return new QualcommHardWare()
  }
}

// 定义操作系统这类产品的抽象产品类
class OS {
  controlHardWare () {
    throw new Error('抽象产品方法不允许直接调用,你需要将我重写')
  }
}

// 定义具体操作系统的具体产品类
class AndroidOS extends OS {
  controlHardWare () {
    console.log('我会用安卓的方式去操作硬件')
  }
}

class AppleOS extends OS {
  controlHardWare () {
    console.log('我会用🍎的方式去操作硬件')
  }
}

// 定义收集硬件这类产品的抽象产品类
class HardWare {
  operateByOrder () {
    throw new Error('抽象产品方法直接调用,你需要将我重写')
  }
}

// 定义具体硬件的具体产品类
class QualcommHardWare extends HardWare {
  operateByOrder () {
    console.log('我会用高通的方式运转')
  }
}

class Miware extends HardWare {
  operateByorder () {
    console.log('我会用小米的方式去运转')
  }
}

// 这是我的收集
const myPhone = new FakeStarFactory()
// 让他拥有操作系统
const myOS = myphone.createOS()
// 让他拥有硬件
const myHardWare = myPhone.createHardWare()

// 启动操作系统(输出‘我会用安卓的方式去操作硬件’)
myOS.controlHardWare()
// 唤醒硬件(输出‘我会用高通的方式去运转’)
myHardWare.operateByOrder()