import React from 'react';

class PlayAcrossClue extends React.Component {

  constructor(props) {
    
    super(props);
    this.state = {};
  }
  
  render() {
    // console.log('PlayAcrossClue : render : enter');

    let cword = this.props.cword;

    let acrossClueKey = this.props.acrossClueKey;
    let acrossClueNum = this.props.acrossClueNum;
    let clueMap = cword.clueMap;
    let clue = clueMap.get(acrossClueKey);

    let id = 'cw-clues-across-row-'+(acrossClueNum+1);
    let labelText = clue.getLabel()+". ";

    let id2 = 'cac'+acrossClueKey;
    let id3 = 'acac'+acrossClueKey;

    let href = "#acac"+acrossClueKey;

    let ancText = clue.text+' ('+clue.answer.length+')';

    return (
      <>
      <div id={id} className="cw-clues-row">
      <span className="cw-clues-label">
      {labelText}
      </span>
      <span id={id2} className="cw-clues-list-item cw-clues-list-across">
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


export default PlayAcrossClue;
