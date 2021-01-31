import React from 'react';

class ParamAcrossClues extends React.Component {

  constructor(props) {
    
    super(props);
    this.state = {};
    this.textarea = React.createRef();
  }

  componentDidUpdate() {
    //  https://stackoverflow.com/questions/53782804/how-to-set-cursor-position-inside-textarea-in-reactjs
    let elem = this.textarea.current;   
    if (elem != null) {
      let cword = this.props.cword;
      if (cword.paramAcrossCluesSelected) { 
        elem.selectionStart = cword.paramAcrossCluesStart;
        elem.selectionEnd = cword.paramAcrossCluesEnd;
        elem.focus();
      }
    } 
  }
  
  render() {
    // console.log('ParamAcrossClues : render : enter');

    let cword = this.props.cword;

    let size = cword.size;
    let suf = size+'by'+size;
    let taClass="cw-clues-param-text-"+suf;

    // let horizClues = "";
    // if (cword.horizClues != null) {
    //   horizClues = ''+cword.horizClues;
    // }

    let ph = "Enter Across Clues";
    let text = "";
    if (cword.horizClues.length > 0) {

      // let msg = cword.buildForPlay();
      // if (msg == null) {
      //   text = cword.formatAcrossClues();
      // } else {
      //   text = ''+cword.horizClues;
      // }
      text = ''+cword.horizClues;
     
      ph = "";

    } 

    return (
      <>
      <div id="cw-clues-list-across" className="cw-clues-list-across">
        <div id="cw-clues-list-across-title" className="cw-clues-list-title">
          Across
        </div>
        <div >
          <textarea id="cw-clues-param-across-text" className={taClass}
          placeholder={ph}
          ref={ this.textarea }
          onKeyUp={(ev) => this.props.onKeyUp(ev)}
          onChange={(ev) => this.props.onKeyUp(ev)}
          value={text}
          >
          </textarea>
        </div>
      </div>
      </>
    );
  }

}

export default ParamAcrossClues;
