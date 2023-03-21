import React, { Component } from 'react';
import Main from './Main';



const more = {prop: 'prop'}
const choices = []
class App extends Component {
  render () {
    return (
      <div>
        <Main
					prop1='This is a prop'
					prop2={'This is another prop'}
					prop3={`One ${more.prop} here`}
					prop4={`Why am i ${choices.find(x => x > 9000)} to myself`}
			/>
      </div>
    )
  }
}

export default App;
