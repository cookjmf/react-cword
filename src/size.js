import React from 'react';
import * as Util from './util';

class Size extends React.Component {

  constructor(props) {
    
    super(props);
    this.state = {};
  }
  
  render() {
    console.log('Size : render : enter');

    console.log('Size : render : props : '+JSON.stringify(this.props));

    let selectedSize = this.props.selected;
    if (selectedSize == null) {
      selectedSize = Util.SIZE_TITLE;
    }

    const options = [];

    let sizes = [];
    sizes.push(Util.SIZE_TITLE);
    for (let i=0; i<Util.SIZES_ALLOWED.length; i++) {
      sizes.push(Util.SIZES_ALLOWED[i]);
    }

    for (let i=0; i<sizes.length; i++) {
      let id = ''+i;
      let size = sizes[i];
      options.push(<option key={id} value={size}>{size}</option>);
    }

    return (
      <select value={selectedSize}
      name="cwsizes" 
      id="cwsizes" 
      className="cw-init-select" 
      onChange={(ev) => this.props.onChange(ev.target.value)}
      >
      {options}
      </select>
    );
    
  }

}

export default Size;
