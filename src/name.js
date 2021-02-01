import React from 'react';
import * as Util from './util';

class Name extends React.Component {

  constructor(props) {
    
    super(props);
    this.state = {};
  }
  
  render() {
    console.log('Name : render : enter');

    console.log('Name : render : props : '+JSON.stringify(this.props));

    let existingNames = this.props.existingNames;

    const options = [];
    
    if (existingNames == null) {
      existingNames = [];
    }

    let names = [];
    
    for (let i=0; i<existingNames.length; i++) {
      names.push(existingNames[i]);
    }
    names.sort();

    names.unshift(Util.NAME_TITLE);

    for (let i=0; i<names.length; i++) {
      let id = ''+(i+1);
      let name = names[i];
      options.push(<option key={id} value={name}>{name}</option>);
    }
  
    return (
      <select 
      name="cwnames" 
      id="cwnames" 
      className="cw-init-select" 
      onChange={(ev) => this.props.onChange(ev.target.value)}
      >
      {options}
      </select>
    );
    
  }
}

export default Name;
