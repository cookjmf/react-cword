import React from 'react';
import ParamBoard from './paramBoard';
import ParamAcrossClues from './paramAcrossClues';
import ParamDownClues from './paramDownClues';
import * as Util from './util';

class Param extends React.Component {

  constructor(props) {
    super(props); 
    this.state = {};
  }
  
  render() {
    console.log('Param : render : enter');

    let cword = this.props.cword;
    
    let size = cword.size;

    let na = Util.numberedMaxAcross(size);
    let nd = Util.numberedMaxDown(size);

    let suffix = na+'by'+nd;
    let boardClassName = 'cw-board-'+suffix;
    let cluesClassName = 'cw-clues-'+suffix;

    let action = this.props.action;

    if (action === Util.ACTION_EXPORT) {  
      let cwObj = cword.getStorageObject();
      let cwordText = JSON.stringify(cwObj);
      return (
        <div id="cw-params-cont" className="cw-cont">
          <textarea id="cw-export-text" className="cw-export-import-text"
            value={cwordText} readOnly
            >
          </textarea>
        </div>
      );
   
    } else {

      return (
        <div id="cw-params-cont" className="cw-cont">
          <div id="cw-params-board" className={boardClassName}>
            <ParamBoard
              cword={ cword}
              onClickParamCell={ this.props.onClickParamCell }
            >
            </ParamBoard>
            <div id="cw-param-clues" className={cluesClassName}>
              <a className="cw-clues-info" href={Util.OCR_ONLINE_URL}
              target = "_blank" rel="noreferrer">
                Parse clues using OnlineOCR
              </a>
              <ParamAcrossClues
                cword={ cword} 
                onKeyUp={ this.props.onKeyUpParamAcrossTextarea }
              >         
              </ParamAcrossClues>
              <ParamDownClues
                cword={ cword} 
                onKeyUp={ this.props.onKeyUpParamDownTextarea }
              >
              </ParamDownClues>
            </div>
          </div>
        </div>
      );
    }

  }

}

export default Param;
