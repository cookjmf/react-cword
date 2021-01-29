import React from 'react';

class ParamDownClues extends React.Component {

  constructor(props) {
    
    super(props);
    this.state = {};
    this.textarea = React.createRef();
  }

  componentDidUpdate() {

    let elem = this.textarea.current;   
    if (elem != null) {
      let cword = this.props.cword;
      if (cword.paramDownCluesSelected) { 
        elem.selectionStart = cword.paramDownCluesStart;
        elem.selectionEnd = cword.paramDownCluesEnd;
        elem.focus();
      }
    } 
  }
  
  render() {
    // console.log('ParamDownClues : render : enter');

    let cword = this.props.cword;

    let size = cword.size;
    let suf = size+'by'+size;
    let taClass="cw-clues-param-text-"+suf;

    // let vertClues = "";
    // if (cword.vertClues != null) {
    //   vertClues = ''+cword.vertClues;
    // }
    let ph = "Enter Down Clues";
    let text = "";
    if (cword.vertClues.length > 0) {

      let msg = cword.validate();
      if (msg == null) {
        text = cword.formatDownClues();
      } else {
        text = ''+cword.vertClues;
      }

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
          ref={ this.textarea }
          onChange={(ev) => this.props.onKeyUp(ev)}
          onKeyUp={(ev) => this.props.onKeyUp(ev)}
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
