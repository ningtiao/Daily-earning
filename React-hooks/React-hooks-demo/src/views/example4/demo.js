import React, { Component } from 'react'

function FriendStatus (props) {
  const [isOnline, setIsOnline] = useState(null);
  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    
  })
}




// export default class Example extends Component {
//   constructor (props) {
//     super(props)
//     this.state = {
//       count: 1
//     }
//   }

//   componentDidMount () {
//     document.title = `You clicked ${count} times`
//   }

//   componentDidUpdate () {
//     document.title = `You clicked ${count} time`
//   }

//   render() {
//     return (
//       <div>
//         <p>You clicked {this.state.count}</p>
//         <button onClick={() => this.setState({count: this.state.count + 1})}></button>
//       </div>
//     )
//   }
// }
