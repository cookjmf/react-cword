import React from 'react';
import * as Util from './util';

class PlayCellBg extends React.Component {

  constructor(props) {
    
    super(props);
    this.state = {};
  }

  renderCell(boardArrayKey) {
    // console.log('PlayCellBg : renderCell : enter : boardArrayKey : '+boardArrayKey);
    let y = Util.row(boardArrayKey);
    let x = Util.column(boardArrayKey);
    
    let id = 'itembg-'+Util.toCellId(y, x);

    // the 1 is needed for numbered grid
    let cellGridRow = y + 1;
    let cellGridColumn = x + 1;

    let style1 = {
      gridColumn: cellGridColumn,
      gridRow: cellGridRow,
    }

    return (
      <>
        <span id={id} className="cw-itembg" name={id} key={id} 
        style={style1}
        >
        </span>
      </>   
    );
    
  }
  
  render() {
    // console.log('PlayCellBg : render : enter');

    // key is "special", even though its been passed in - it does not show in props !!

    let boardArrayKey = this.props.boardArrayKey;
    if (boardArrayKey == null) {
      return <p>E101</p>
    } else {
      // console.log('ParamCell : render : boardArrayKey : '+boardArrayKey);

      return (
        <>
        {this.renderCell(boardArrayKey)}
        </>
      );
    }
    
  }
}

export default PlayCellBg;
