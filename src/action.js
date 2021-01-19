import React from 'react';
import * as Util from './util';

class Action extends React.Component {

  constructor(props) {   
    super(props);
    this.state = {};
  }

  render() {
    console.log('Action : render : enter');

    console.log('Action : render : props : '+JSON.stringify(this.props));

    let numNames = 0;
    if (this.props.existingNames!=null) {
      numNames = this.props.existingNames.length;
    }
    var actionNames = [];
    if (numNames > 0) {
      actionNames = [Util.ACTION_TITLE,Util.ACTION_CREATE, Util.ACTION_CREATE_EXAMPLE, 
        Util.ACTION_PLAY, Util.ACTION_UPDATE, Util.ACTION_EXPORT, Util.ACTION_IMPORT, 
        Util.ACTION_DELETE, Util.ACTION_CLEAR];
    } else {
      actionNames = [Util.ACTION_TITLE,Util.ACTION_CREATE, Util.ACTION_CREATE_EXAMPLE, 
        Util.ACTION_IMPORT, Util.ACTION_CLEAR];
    }

    const options = [];

    let selectedAction = this.props.selected;
    if (selectedAction == null) {
      selectedAction = Util.ACTION_TITLE;
    }

    for (let i=0; i<actionNames.length; i++) {
      let actionName = actionNames[i];
      let id = ''+i;
      options.push(<option key={id} value={actionName}>{actionName}</option>);
      
    }

    return (
      <select value={selectedAction}
      name="cwactions" 
      id="cwactions" 
      className="cw-init-select" 
      onChange={(ev) => this.props.onChange(ev.target.value)}
      >
      {options}
      </select>
    );
    
  }
}

export default Action;
