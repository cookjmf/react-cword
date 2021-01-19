import React from 'react';

class PlayDownClue extends React.Component {

  constructor(props) {
    
    super(props);
    this.state = {};
  }
  
  render() {
    // console.log('PlayDownClue : render : enter');

    let cword = this.props.cword;

    let downClueKey = this.props.downClueKey;
    let downClueNum = this.props.downClueNum;
    let clueMap = cword.clueMap;
    let clue = clueMap.get(downClueKey);

    let id = 'cw-clues-down-row-'+(downClueNum+1);
    let labelText = clue.getLabel()+". ";

    let id2 = 'cdo'+downClueKey;
    let id3 = 'acdo'+downClueKey;

    let href = "#acdo"+downClueKey;

    let ancText = clue.text+' ('+clue.answer.length+')';

    return (
      <>
      <div id={id} className="cw-clues-row">
      <span className="cw-clues-label">
      {labelText}
      </span>
      <span id={id2} className="cw-clues-list-item cw-clues-list-down">
      <a id={id3} className="cw-clues-link" href={href}
      onClick={(ev) => this.props.onClick(ev.target.id)}
      >
      {ancText}
      </a>
      </span>
      </div>
      </>
    );
  }
}

export default PlayDownClue;
