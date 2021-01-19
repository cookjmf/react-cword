import React from 'react';

class Message extends React.Component {

  constructor(props) {
    
    super(props);
    this.state = {};
  }

  renderWithConfirm(fullText, cls, confirmText) {
    
    const style1 = {
      'textDecoration': 'underline'
    };

    let confid = 'cw-message-'+confirmText;

    return (
      <div id="cw-message-cont" className="cw-cont"> 
        <span className={cls} id='cw-message-text'>
          {fullText}
        </span>
        <span className={cls} id='cw-message-text'>
          |
        </span>
        <a className={cls} id={confid}
          style={style1} href='#confirmmessage'
          onClick={(ev) => this.props.onClickMessageConfirm(ev.target.id)}
          >
          {confirmText}
        </a>
        <span className={cls} id='cw-message-text'>
          |
        </span>
        <a className={cls} id='cw-message-close' 
          style={style1} href='#closemessage'
          onClick={() => this.props.onClickMessageClose()}
          >
          Close
        </a>
      </div>
    );

  }

  renderSimple(fullText, cls) {
    
    const style1 = {
      'textDecoration': 'underline'
    };

    return (
      <div id="cw-message-cont" className="cw-cont"> 
        <span className={cls} id='cw-message-text'>
          {fullText}
        </span>
        <span className={cls} id='cw-message-text'>
          |
        </span>
        <a className={cls} id='cw-message-close' 
          style={style1} href='#closemessage'
          onClick={() => this.props.onClickMessageClose()}
          >
          Close
        </a>
      </div>
    );
  }

  render() {
    console.log('Message : enter : render');
    console.log('Message : render : props : '+JSON.stringify(this.props));

    let msg = this.props.msg;

    if (msg == null) {
      return (
        <div id="cw-message-cont" className="cw-cont"> 
        </div>
      );
    } else {

      let fullText = msg.fullText();
      let cls = msg.cls;
      let confirmText = msg.confirmText;

      if (confirmText != null && confirmText.length > 0) {
                
        return this.renderWithConfirm(fullText, cls, confirmText);
        
      } else {
        return this.renderSimple(fullText, cls);
      }
    }
  }
}

export default Message;
