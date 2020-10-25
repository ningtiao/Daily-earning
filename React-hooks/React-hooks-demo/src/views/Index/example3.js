import React, { Component } from 'react'

export default class example3 extends Component {
  constructor (props) {
    super(props)
    this.state = { count: 0}
  }

  componentDidMount () {
    console.log(`You Clicked ${this.state.count} Times`)
  }

  componentDidUpdate () {
    console.log('componentsDidUpdate')
  }

  render() {
    return (
      <div>
        <p>You Clicked {this.state.count} Times</p>
        <button onClick={this.handleClick.bind(this)}>Click me</button>
      </div>
    )
  }

  handleClick = () => {
    this.setState({
      count: this.state.count + 1
    })
  }
}
