import React from 'react';

class ParamDownClues extends React.Component {

  constructor(props) {
    
    super(props);
    this.state = {};
  }
  
  render() {
    console.log('ParamDownClues : render : enter');

    let cword = this.props.cword;

    let size = cword.size;
    let suf = size+'by'+size;
    let taClass="cw-clues-param-text-"+suf;

    let vertClues = "";
    if (cword.vertClues != null) {
      vertClues = ''+cword.vertClues;
    }
    let ph = "Enter Down Clues";
    let text = "";
    if (vertClues.length > 0) {
      text = ''+vertClues;
      ph = "";
    } 

    return (
      <>
      <div id="cw-clues-list-down" className="cw-clues-list-down">
        <div id="cw-clues-list-down-title" className="cw-clues-list-title">
          Down
        </div>
        <div >
          <textarea id="cw-clues-param-down-text" className={taClass}
          placeholder={ph}
          onChange={(ev) => this.props.onKeyUp(ev.target.value)}
          onKeyUp={(ev) => this.props.onKeyUp(ev.target.value)}
          value={text}
          >
          </textarea>
        </div>
      </div>
      </>
    );
  }
}

export default ParamDownClues;
