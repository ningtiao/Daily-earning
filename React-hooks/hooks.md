### useState 的介绍和多状态声明

以前函数式组件

```js
import React, { Component } from "react";
export default class Example extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 1,
    };
  }

  render() {
    return (
      <div>
        <p>You clicked {this.state.count}</p>
        <button
          onClick={() => this.setState({ count: this.state.count + 1 })}
        ></button>
      </div>
    );
  }
}
```

使用 useState

```js
import React, { useState } from "react";

function Example() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(count + 1)}>setCount</button>
      <button onClick={() => setCount((count) => count + 1)}>setCount</button>
    </div>
  );
}

export default Example;
```

多状态声明

```js
import React, { useState } from "react";

function Example() {
  const [age, setAge] = useState(18);
  const [sex, setSex] = useState("男");
  const [work, setWork] = useState("前端");
  return (
    <div>
      <p>大白菜今年{age}岁</p>
      <p>性别：{sex}</p>
      <p>工作是 {work}</p>
    </div>
  );
}

export default Example;
```
