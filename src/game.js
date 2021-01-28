import React from 'react';
import Init from './init';
import Message from './message';
import Param from './param';
import Play from './play';

import Cword from './cword';
import MsgMgr from './msgMgr';

import * as Util from './util';

// version 210115_0821

class Game extends React.Component {
  constructor(props) {   
    super(props);
    console.log('Game : constructor : enter');

    // enables a child to call onChangeXXXX with the selected value

    // init
    this.onChangeAction = this.onChangeAction.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeNewName = this.onChangeNewName.bind(this);
    this.onChangeSize = this.onChangeSize.bind(this);
    // message
    this.onClickMessageClose = this.onClickMessageClose.bind(this);
    this.onClickMessageConfirm = this.onClickMessageConfirm.bind(this);
    // param
    this.onClickParamCell = this.onClickParamCell.bind(this);
    this.onKeyUpParamAcrossTextarea = this.onKeyUpParamAcrossTextarea.bind(this);
    this.onKeyUpParamDownTextarea = this.onKeyUpParamDownTextarea.bind(this);
    this.onKeyUpImportTextarea = this.onKeyUpImportTextarea.bind(this);
    // play
    this.onClickPlayCell = this.onClickPlayCell.bind(this);
    this.onChangePlayCell = this.onChangePlayCell.bind(this); // TODO : share with on key up
    this.onKeyUpPlayCell = this.onKeyUpPlayCell.bind(this);
    this.onKeyDownPlayCell = this.onKeyDownPlayCell.bind(this);
    this.onClickAcrossClue = this.onClickAcrossClue.bind(this);
    this.onClickDownClue = this.onClickDownClue.bind(this);
    

    // message manager
    this.msgMgr = new MsgMgr();

    // state
    this.state = {
      updateTimestamp: '',
      existingNames: null,
      action: '',
      msg: null,
      cword: null,
    };
  }

  componentDidMount() {
    console.log('Game : componentDidMount : enter');
    this.storeGetNames();
  }

  componentDidUpdate() {
    console.log('Game : componentDidUpdate : enter');
  }

  shouldComponentUpdate(nextProps, nextState) {
    console.log('Game : shouldComponentUpdate : enter');
    let res = false;
    console.log('Game : shouldComponentUpdate : this.state.updateTimestamp : ...'+this.state.updateTimestamp+'...');
    console.log('Game : shouldComponentUpdate : nextState.updateTimestamp : ....'+nextState.updateTimestamp+'...');
    if (this.state.updateTimestamp !== nextState.updateTimestamp) {
      res = true;
      console.log('Game : shouldComponentUpdate : new value for state.updateTimestamp so will render');
    } else {
      console.log('Game : shouldComponentUpdate : SAME value for state.updateTimestamp so will NOT render');
    }
    return res;
  }

  // on methods
  // CAN CHANGE STATE

  onChangeAction(newAction) {

    console.log('Game : START : -------------------------------------------->');
    console.log('Game : START : onChangeAction ----> '+newAction+' --------->');
    console.log('Game : START : -------------------------------------------->');

    let existingNames = this.state.existingNames;

    if (newAction === Util.ACTION_CREATE_EXAMPLE) {
      let names = [];

      for (var [key,val] of Util.EXAMPLE_MAP) {
        console.log(key +'...'+val.length);
        if (!existingNames.includes(key)) {
          names.push(key);
        }
      }

      this.setState({ action: newAction, cword: null,
        existingNames: names, 
        updateTimestamp: Util.newDate() }); 


    } else if (newAction === Util.ACTION_CLEAR) {

      this.storeGetNames();

    } else {

      this.setState({ action: newAction, cword: null,
        updateTimestamp: Util.newDate() }); 
    }   
  }
  
  onChangeName(newName) {

    console.log('Game : START : -------------------------------------------->');
    console.log('Game : START : onChangeName ----> '+newName+' --------->');
    console.log('Game : START : -------------------------------------------->');

    console.log('Game : onChangeName : enter : newName : ...'+newName+'...');
    //   
    let action = this.state.action;
    if (action === Util.ACTION_DELETE) {
      let cword = new Cword();
      cword.name = newName;

      this.storeDelete(cword);
    } else if (action === Util.ACTION_CREATE_EXAMPLE) {

      let cwObj = Util.EXAMPLE_MAP.get(newName);
      if (cwObj != null) {    
        let cword = new Cword();
        cword.setupCwordFromStorageObject(cwObj);
    
        this.storeSave(cword);
      } else {
        console.log("logic error : no example found named : "+newName);
      }
    } else if (action === Util.ACTION_PLAY) {
      this.storeGet(newName);
    } else if (action === Util.ACTION_UPDATE) {
      this.storeGet(newName);
    } else if (action === Util.ACTION_EXPORT) {
      this.storeGet(newName);
    } else if (action === Util.ACTION_IMPORT) {

    } else {
      // other actions here

    }

  }

  onChangeNewName(newName) {

    console.log('Game : START : -------------------------------------------->');
    console.log('Game : START : onChangeNewName ----> '+newName+' --------->');
    console.log('Game : START : -------------------------------------------->');

    let action = this.state.action;
    if (action === Util.ACTION_CREATE) {

      let cword = new Cword();
      cword.name = newName;
      this.setState({ cword: cword }); 

      if (Util.isExample(newName)) {

        // this.setupNew(cword);
        // this is an error case

        this.msgMgr.addError('Invalid name, reserved for example');
        this.setState({ 
          msg : this.msgMgr.msg() , updateTimestamp: Util.newDate()
        });

      } 
    } else {
      console.log("logic error : in onChangeNewName but action is not CREATE");
    }
  }

  onChangeSize(newSize) {

    console.log('Game : START : -------------------------------------------->');
    console.log('Game : START : onChangeSize ----> '+newSize+' --------->');
    console.log('Game : START : -------------------------------------------->');  

    let cword = this.state.cword;
    cword.init(newSize);

    let action = this.state.action;
    if (action === Util.ACTION_CREATE) {

      let name = cword.name;

      let existingNames = this.state.existingNames;
      
      if (!Util.isValidName(name)) {
        this.msgMgr.addError('Invalid name');
        this.setState({ 
          msg : this.msgMgr.msg() , updateTimestamp: Util.newDate()
        });
  
      } else if (Util.isDuplicateName(existingNames, name)) {
        this.msgMgr.addError('Duplicate name');
        this.setState({ 
          msg : this.msgMgr.msg() , updateTimestamp: Util.newDate()
        });
      } else {
  
        let cwObj = Util.EXAMPLE_MAP.get(name);
        if (cwObj != null) {    
          console.log('Game : setupNew : example case : not valid here');

        } else {
          console.log('Game : setupNew : non example case');
  
          // all empty on creation
  
          this.storeSave(cword);
        }
      }
    

    } else {
      console.log("logic error : in onChangeSize but action is not CREATE");
    }
  }

  onClickMessageClose() {
    console.log('Game : START : -------------------------------------------->');
    console.log('Game : START : onClickMessageClose ------------------------>');
    console.log('Game : START : -------------------------------------------->');  

    this.msgMgr.clear(); 

    let cword = this.state.cword;
    let name = '';
    if (cword != null) {
      name = cword.name;
    }
    let action = this.state.action;
    let existingNames = this.state.existingNames;

    if (action === Util.ACTION_CREATE) {
      if (!Util.isValidName(name) || Util.isDuplicateName(existingNames, name)) {
        // force user to choose "Size" again
        this.setState( { 
          selectedAction: Util.ACTION_TITLE, 
          selectedSize: Util.SIZE_TITLE, 
          msg: null, 
          updateTimestamp: Util.newDate() } 
          );  
      } else {
        let msg = cword.validate();
        if (msg != null) {
          this.setState( { 
            selectedAction: Util.ACTION_TITLE, 
            selectedSize: Util.SIZE_TITLE, 
            msg: null, 
            updateTimestamp: Util.newDate() } 
            );  
        } else {
          this.storeGetNames();
        }

      }
    } else if (action === Util.ACTION_CREATE_EXAMPLE) {
      this.storeGetNames();
    } else if (action === Util.ACTION_DELETE) {
      this.storeGetNames();
    } else if (action === Util.ACTION_EXPORT) {
      this.storeGetNames();
    } else if (action === Util.ACTION_IMPORT) {

      this.setState({ msg: null, action: null, cword: null }); 
      
      this.storeGetNames();

    } else {

      // message displayed before action chosen
      this.setState({ msg: null,
        updateTimestamp: Util.newDate() }); 
    }
  }

  onClickMessageConfirm(id) {
    console.log('Game : START : -------------------------------------------->');
    console.log('Game : START : onClickMessageConfirm -----> '+id+'------------------->');
    console.log('Game : START : -------------------------------------------->');  

    if (id === Util.CONFIRM_VALIDATE) {
      let cword = this.state.cword;
      let msg = cword.validate();

      this.setState( { 
        msg: msg, 
        updateTimestamp: Util.newDate() 
      });

    } else if (id === Util.CONFIRM_IMPORT) {

      let cword = this.state.cword;

      try {
        let value = cword.importJson;
  
        let cwObj = JSON.parse(value);

        let cwordNew = new Cword();

        cwordNew.setupCwordFromStorageObject(cwObj);

        let msg = cwordNew.validateForImport();
  
        if (msg == null) {
    
          this.storeSave(cwordNew);
  
        } else {

          msg.prefix = 'Failed Validation.';

          this.setState( { 
            msg: msg, 
            updateTimestamp: Util.newDate() 
          });
        }

      } catch (err) {
        this.msgMgr.addError('Invalid JSON. '+err);

        this.setState( { 
          msg: this.msgMgr.msg(), 
          updateTimestamp: Util.newDate() 
        });
      }
    }
  }

  onClickParamCell(id) {

    console.log('Game : START : -------------------------------------------->');
    console.log('Game : START : onClickParamCell ----> '+id+'------------->');
    console.log('Game : START : -------------------------------------------->');  

    let cword = this.state.cword;
    cword.toggleParamCell(id);

    this.storeSave(cword);
  }

  onKeyUpParamAcrossTextarea(ev) {

    var elem = ev.currentTarget;
    var id = elem.id;
    var value = elem.value;

    console.log('Game : START : -------------------------------------------->');
    console.log('Game : START : onKeyUpParamAcrossTextarea ---->'+id+'------------->');
    console.log('Game : START : -------------------------------------------->');  

    let atext = Util.convertCluesRomanDash(value);
    atext = Util.convertCluesDash(atext);

    let cword = this.state.cword;
    cword.horizClues = atext;
    cword.paramAcrossCluesSelected = true;
    cword.paramDownCluesSelected = false;
    cword.paramAcrossCluesStart = elem.selectionStart;
    cword.paramAcrossCluesEnd = elem.selectionEnd;

    this.storeSave(cword);

  }

  onKeyUpParamDownTextarea(ev) {

    var elem = ev.currentTarget;
    var id = elem.id;
    var value = elem.value;

    console.log('Game : START : -------------------------------------------->');
    console.log('Game : START : onKeyUpParamDownTextarea ---->'+id+'------------->');
    console.log('Game : START : -------------------------------------------->');  

    let dtext = Util.convertCluesRomanDash(value);
    dtext = Util.convertCluesDash(dtext);

    let cword = this.state.cword;
    cword.vertClues = dtext;

    cword.paramAcrossCluesSelected = false;
    cword.paramDownCluesSelected = true;
    cword.paramDownCluesStart = elem.selectionStart;
    cword.paramDownCluesEnd = elem.selectionEnd;

    this.storeSave(cword);

  }

  onClickPlayCell(ev) {

    var elem = ev.currentTarget;
    var id = elem.id;

    console.log('Game : START : -------------------------------------------->');
    console.log('Game : START : onClickPlayCell ----> id: '+id+' ------------->');
    console.log('Game : START : -------------------------------------------->');  

    let cword = this.state.cword;
    cword.cellClicked(id);

    this.setState({ msg: null, cword: cword,
      updateTimestamp: Util.newDate() }); 

  }

  onChangePlayCell(ev) {

    // changes handled in "onKeyUpPlayCell"
    // react complains if no onChange handler exists

    var elem = ev.currentTarget;
    var id = elem.id;
    var value = elem.value;

    // console.log('Game : START : -------------------------------------------->');
    console.log('Game : START : onChangePlayCell ----> id : '+id+' ------------->');
    console.log('Game : START : onChangePlayCell ----> value : '+value+' ------------->');
    // console.log('Game : START : -------------------------------------------->');  

    // let cword = this.state.cword;
    // cword.cellChanged(id, value);
    // this.storeSave(cword);
    
  }

  onKeyUpPlayCell(ev) {

    var elem = ev.currentTarget;
    var id = elem.id;

    console.log('Game : START : -------------------------------------------->');
    console.log('Game : START : onKeyUpPlayCell ----> id : '+id+' ------------->');
    console.log('Game : START : -------------------------------------------->');   

    let cword = this.state.cword;
    let value = cword.keyUpPlayCell(ev);

    if (value != null) {
      console.log('Game : got value : ['+value+']');
      cword.cellChanged(id, value);
      this.storeSave(cword);

    } else {

      this.setState({ msg: null, cword: cword,
        updateTimestamp: Util.newDate() }); 
    }

  }

  onKeyDownPlayCell(ev) {

    var elem = ev.currentTarget;
    var id = elem.id;

    console.log('Game : START : -------------------------------------------->');
    console.log('Game : START : onKeyDownPlayCell ----> id : '+id+' ------------->');
    console.log('Game : START : -------------------------------------------->');  

    let cword = this.state.cword;
    let result = cword.keyDownPlayCell(ev);

    this.setState({ msg: null, cword: cword,
      updateTimestamp: Util.newDate() }); 

    return result;
  }

  onClickAcrossClue(id) {

    console.log('Game : START : -------------------------------------------->');
    console.log('Game : START : onClickAcrossClue ----> '+id+'------------->');
    console.log('Game : START : -------------------------------------------->');  

    let cword = this.state.cword;
    cword.acrossClueClicked(id);

    this.setState({ msg: null, cword: cword,
      updateTimestamp: Util.newDate() }); 

  }

  onClickDownClue(id) {

    console.log('Game : START : -------------------------------------------->');
    console.log('Game : START : onClickDownClue ----> '+id+'------------->');
    console.log('Game : START : -------------------------------------------->');  

    let cword = this.state.cword;
    cword.downClueClicked(id);

    this.setState({ msg: null, cword: cword,
      updateTimestamp: Util.newDate() }); 
  }

  onKeyUpImportTextarea(value) {

    console.log('Game : START : -------------------------------------------->');
    console.log('Game : START : onKeyUpImportTextarea ----> value : '+value+' ------------->');
    console.log('Game : START : -------------------------------------------->');   

    if (value != null && value.length > 0) {

      let cword = new Cword();
      cword.importJson = value;

      this.msgMgr.addConfirmInfo('', 'Import', Util.CONFIRM_IMPORT);

      this.setState({ msg: this.msgMgr.msg(), cword: cword,
        updateTimestamp: Util.newDate() }); 
    }

  }

  // store methods
  // DO NOT CHANGE STATE HERE

  storeGet(name) {
    console.log('Game : storeGet : enter : name : '+name);
  
    fetch('/cwords/name/'+name)
    .then(
      response => {
        return response.json();
      }
    )
    .then(
      data => {
        console.log('Game : storeGet : fetch : data : ...'+JSON.stringify(data)+'...');
        let cwObj = JSON.parse(data.contents)
        this.resultGet(cwObj, true, name, null);
      }
    )
    .catch(
      err => {
        console.log('Game : storeGet : catch : err');
        Util.showErr(err);
        this.resultGet(null, false, name, err);
      }
    ) 
  }
  
  storeDelete(cword) {
    let name = cword.name;
    console.log('Game : storeDelete : enter : name : '+name);
  
    fetch('/cwords/name/'+name, {
      method: 'DELETE',
    })
    .then(
      response => {
        return response.json();
      }
    )
    .then(
      data => {
        console.log('Game : storeDelete : fetch : data = ...'+JSON.stringify(data)+'...');
        this.resultDelete(true, cword, null);
      }
    )
    .catch(
      err => {

        console.log('Game : storeDelete : catch : err');
        Util.showErr(err);
        this.resultDelete(false, cword, err);
      }
    ) 
  }

  storeSave(cwObj) {
    console.log('Game : storeSave : enter');
  
    // for play and update - assume the cword exists
    // for other cases, (new, new-example, import) check first

    let action = this.state.action;

    if (action === Util.ACTION_PLAY || action === Util.ACTION_UPDATE) {
      this.storeUpdate(cwObj);
    } else {
  
      fetch('/cwords')
      .then(
        response => {
          return response.json();
        }
      )
      .then(
        data => {
          console.log('Game : storeSave : fetch : data : ...'+JSON.stringify(data)+'...');
          let names = [];
          for (let i=0; i<data.length; i++) {
            let row = data[i];
            let name = row.name;
            names.push(name);
          }
          console.log('Game : storeSave : fetch : names = ...'+JSON.stringify(names)+'...');
          if (names.includes(cwObj.name)) {
            this.storeUpdate(cwObj);
          } else {
            this.storeInsert(cwObj);
          }
        }
      )
      .catch(
        err => {

          console.log('Game : storeSave : catch : err');
          Util.showErr(err);

          this.resultSave(cwObj, false, err);
        }
      ) 
    }  
  }

  storeInsert(cwObj) {
    console.log('Game : storeInsert : enter');
    let objectForStore = cwObj.getStorageObject();
    fetch('/cwords', {
      method: 'POST', 
      headers: {
       'Content-type': 'application/json; charset=UTF-8' 
      },
      body: JSON.stringify(objectForStore)  
     })
    .then(
      response => {
        return response.json();
      }
    )
    .then(
      data => {
        console.log('Game : storeInsert : fetch : data : ...'+JSON.stringify(data)+'...');
        this.resultInsert(cwObj, true, null);
      }
    )
    .catch(
      err => {
        console.log('Game : storeInsert : catch : err');
        Util.showErr(err);
        this.resultInsert(cwObj, false, err);
      }
    )  
  }
  
  storeUpdate(cwObj) {
    console.log('Game : storeUpdate : enter');

    let objectForStore = cwObj.getStorageObject();
    fetch('/cwords/name/'+cwObj.name, {
      method: 'PUT', 
      headers: {
       'Content-type': 'application/json; charset=UTF-8' 
      },
      body: JSON.stringify(objectForStore)  
     })
    .then(
      response => {
        return response.json();
      }
    )
    .then(
      data => {
        console.log('Game : storeUpdate : fetch : data : ...'+JSON.stringify(data)+'...');
        this.resultUpdate(cwObj, true, null);
      }
    )
    .catch(
      err => {
        console.log('Game : storeUpdate : catch : err');
        Util.showErr(err);
        this.resultUpdate(cwObj, false, err);
      }
    )  
  }
  
  storeGetNames() {
    console.log('Game : storeGetNames : enter');
    fetch('/cwords')
      .then(
        response => {
          return response.json();
        }
      )
      .then(
        data => {
          console.log('Game : storeGetNames : fetch : data : ...'+Util.shorten(JSON.stringify(data),200)+'...');
  
          let names = [];
          for (let i=0; i<data.length; i++) {
            let row = data[i];
            let name = row.name;
            names.push(name);
          }
          this.resultGetNames(true, names, null);
          
        }
      )
      .catch(
        err => {

          console.log('Game : storeGetNames : catch : err');
          Util.showErr(err);

          this.resultGetNames(false, [], err);

        }
      )
  }

  // result methods, called:
  // - after store methods 
  // - set the updateTimestamp here, which forces re-render
  // CAN CHANGE STATE  

  resultGetNames(ok, names, err) {
    console.log('Game : resultGetNames : enter');
    if (!ok) {
      this.msgMgr.addError('Failed to get crossword names. '+err);
      let msg = this.msgMgr.msg();
      this.setState( { existingNames: names, 
        cword: null, action: '', 
        msg: msg , updateTimestamp: Util.newDate()} );

    } else {
      this.setState( { existingNames: names, 
        cword: null, action: '', 
        msg: null , updateTimestamp: Util.newDate()} );
    }

  }

  resultSave(cwObj, ok, err) {
    console.log('Game : resultSave : enter');
    let action = this.state.action;
    if (action === Util.ACTION_IMPORT) {
      this.resultUpdateImport(cwObj, ok, err);
    } else if (action === Util.ACTION_PLAY) {
      this.resultPlayUpdate(cwObj, ok, err);
    } else if (action === Util.ACTION_CREATE) {
      this.resultCreateSave(cwObj, ok, err);
    } else if (action === Util.ACTION_UPDATE) {
      this.resultUpdateSave(cwObj, ok, err);
    }
  }

  resultUpdate(cwObj, ok, err) {
    console.log('Game : resultUpdate : enter');
    let action = this.state.action;
    if (action === Util.ACTION_IMPORT) {
      this.resultUpdateImport(cwObj, ok, err);
    } else if (action === Util.ACTION_PLAY) {
      this.resultPlayUpdate(cwObj, ok, err);
    } else if (action === Util.ACTION_CREATE) {
      this.resultCreateUpdate(cwObj, ok, err);
    } else if (action === Util.ACTION_UPDATE) {
      this.resultUpdateUpdate(cwObj, ok, err);
    }
  }

  resultInsert(cwObj, ok, err) {
    console.log('Game : resultInsert : enter');
    let action = this.state.action;
    if (action === Util.ACTION_IMPORT) {
      this.resultCreateImport(cwObj, ok, err);
    } else if (action === Util.ACTION_PLAY) {
      // not possible
    } else if (action === Util.ACTION_CREATE) {
      this.resultCreateInsert(cwObj, ok, false, err);
    } else if (action === Util.ACTION_CREATE_EXAMPLE) {
      this.resultCreateInsert(cwObj, ok, true, err);
    } else if (action === Util.ACTION_UPDATE) {
      // not possible
    }
  }

  resultPlayUpdate(cwObj, ok, err) {
    console.log('Game : resultPlayUpdate : enter');
    let name = cwObj.name;
    if (!ok) {
      this.msgMgr.addError('Failed to save crossword : '+name+' . '+err);
    } 
    let msg = this.msgMgr.msg();
    this.setState( {
      msg: msg , cword: cwObj, updateTimestamp: Util.newDate()
    } );
  }

  resultCreateUpdate(cwObj, ok, err) {
    console.log('Game : resultCreateUpdate : enter');
    let name = cwObj.name;
    if (!ok) {
      this.msgMgr.addError('Failed to save crossword : '+name+' . '+err);
    } else {
      this.msgMgr.addConfirmInfo( 'Saved crossword : '+name+' at '+Util.date1(), "Validate" , Util.CONFIRM_VALIDATE);
    }
    let msg = this.msgMgr.msg();
    this.setState( {
      msg: msg , cword: cwObj, updateTimestamp: Util.newDate()
    } );
  }

  resultCreateImport(cwObj, ok, err) {
    console.log('Game : resultCreateImport : enter');
    let name = cwObj.name;
    if (!ok) {
      this.msgMgr.addError('Failed to save crossword : '+name+' . '+err);
    } else {
      this.msgMgr.addInfo( 'Saved crossword : '+name+' at '+Util.date1(), "Validate" , Util.CONFIRM_VALIDATE);
    }
    let msg = this.msgMgr.msg();
    this.setState( {
      msg: msg , cword: cwObj, updateTimestamp: Util.newDate()
    } );
  }

  resultUpdateImport(cwObj, ok, err) {
    console.log('Game : resultUpdateImport : enter');
    let name = cwObj.name;
    if (!ok) {
      this.msgMgr.addError('Failed to save crossword : '+name+' . '+err);
    } else {
      this.msgMgr.addInfo( 'Saved crossword : '+name+' at '+Util.date1(), "Validate" , Util.CONFIRM_VALIDATE);
    }
    let msg = this.msgMgr.msg();
    this.setState( {
      msg: msg , cword: cwObj, updateTimestamp: Util.newDate()
    } );
  }

  resultUpdateUpdate(cwObj, ok, err) {
    console.log('Game : resultUpdateUpdate : enter');
    let name = cwObj.name;
    if (!ok) {
      this.msgMgr.addError('Failed to save crossword : '+name+' . '+err);
    } else {
      this.msgMgr.addConfirmInfo( 'Updated crossword : '+name+' at '+Util.date1(), "Validate" ,Util.CONFIRM_VALIDATE);
    }
    let msg = this.msgMgr.msg();
    this.setState( {
      msg: msg , cword: cwObj, updateTimestamp: Util.newDate()
    } );
  }

  resultCreateInsert(cwObj, ok, isExample, err) {
    console.log('Game : resultCreateInsert : enter');
    let name = cwObj.name;
    if (!ok) {
      if (isExample) {
        this.msgMgr.addError('Failed to save example crossword : '+name+'. ' +err);
      } else {
        this.msgMgr.addError('Failed to save crossword : '+name+'. ' +err);
      }
    } else {
      if (isExample) {
        this.msgMgr.addInfo('Created example crossword : '+name+'.');
      } else {
        this.msgMgr.addInfo('Created crossword : '+name+', now set blanks and clues');  
      } 
    }
    let msg = this.msgMgr.msg();
    this.setState( {
      msg: msg , cword: cwObj, updateTimestamp: Util.newDate()
    } );
  }

  resultCreateSave(cwObj, ok, err) {
    console.log('Game : resultCreateSave : enter');
    let name = '?';
    if (cwObj != null) {
      name = cwObj.name;
    }
    if (!ok) {
      this.msgMgr.addError('Failed to save crossword : '+name+'. '+err);
    } else {
      // should not happen
    }
    let msg = this.msgMgr.msg();
    this.setState( {
      msg: msg , cword: cwObj, updateTimestamp: Util.newDate()
    } );
  }

  resultUpdateSave(cwObj, ok, err) {
    console.log('Game : resultUpdateSave : enter');
    let name = '?';
    if (cwObj != null) {
      name = cwObj.name;
    }
    if (!ok) {
      this.msgMgr.addError('Failed to save crossword : '+name+'. '+err);
    } else {
      // should not happen
    }
    let msg = this.msgMgr.msg();
    this.setState( {
      msg: msg , cword: cwObj, updateTimestamp: Util.newDate()
    } );
  }

  resultGet(cwObj, ok, name, err) {
    console.log('Game : resultGet : enter');

    let action = this.state.action;

    if (!ok) {
      this.msgMgr.addError('Failed to get crossword : '+name+'. '+err);
      let msg = this.msgMgr.msg();
      this.setState( {
        msg: msg , updateTimestamp: Util.newDate()
      } );

    } else {
      let cword = new Cword();
      cword.setupCwordFromStorageObject(cwObj);

      let msg = null;
      if (action === Util.ACTION_PLAY) {
        msg = cword.buildForPlay();
      } else if (action === Util.ACTION_UPDATE) {
        msg = cword.buildForUpdate();
      } else if (action === Util.ACTION_EXPORT) {
        this.msgMgr.addInfo('Copy this text and save for future import');
        msg = this.msgMgr.msg();
      }

      this.setState( { 
        msg: msg,
        cword: cword,
        updateTimestamp: Util.newDate()} );
  
    }
  }

  resultDelete(deletedOK, cword, err) {
    console.log('Game : resultDelete : enter');
    let name = cword.name;
    if (!deletedOK) {
      this.msgMgr.addError('Failed to delete crossword : '+name+'. '+err);
    } else {
      this.msgMgr.addInfo('Deleted crossword : '+name);
    }
    let msg = this.msgMgr.msg();
    this.setState( {msg : msg, cword: cword, updateTimestamp: Util.newDate()} );
  }

  // render methods
  // NEVER CHANGE STATE HERE
 
  renderCreate() {
    // chose create, show name, size
    console.log('Game : renderCreate : enter');
    // console.log('Game : renderCreate : state : '+JSON.stringify(this.state));
    return (
      <div className="game">   
        <Init 
          action={ this.state.action}
          selectedAction={Util.ACTION_CREATE}         
          selectedName={Util.NAME_TITLE}       
          selectedSize={ Util.SIZE_TITLE }
          onChangeAction={ this.onChangeAction }
          onChangeName={ this.onChangeName }
          onChangeNewName={ this.onChangeNewName }
          onChangeSize={ this.onChangeSize }
        /> 
        <Message         
          msg={ this.state.msg }
          onClickMessageClose={ this.onClickMessageClose }
        />       
      </div>
    );
  }

  renderCreateExample() {
    // chose create, show name
    console.log('Game : renderCreateExample : enter');
    // console.log('Game : renderCreateExample : state : '+JSON.stringify(this.state));
    return (
      <div className="game">   
        <Init 
          action={ this.state.action}
          selectedAction={Util.ACTION_CREATE_EXAMPLE}         
          selectedName={Util.NAME_TITLE}       
          onChangeAction={ this.onChangeAction }
          onChangeName={ this.onChangeName }
          existingNames={ this.state.existingNames }
        /> 
        <Message         
          msg={ this.state.msg }
          onClickMessageClose={ this.onClickMessageClose }
        />       
      </div>
    );
  }

  renderCreateWithName() {
    // chose create, entered name, get size
    console.log('Game : renderCreateWithName : enter');
    // console.log('Game : renderCreateWithName : state : '+JSON.stringify(this.state));

    let cword = this.state.cword;

    return (
      <div className="game">   
        <Init 
          action={ this.state.action}
          selectedAction={Util.ACTION_CREATE}
          name={ cword.name}
          selectedName={this.state.name}
          size={ cword.size}
          selectedSize={ Util.SIZE_TITLE }
          onChangeAction={ this.onChangeAction }
          onChangeName={ this.onChangeName }
          onChangeNewName={ this.onChangeNewName }
          onChangeSize={ this.onChangeSize }
        /> 
        <Message         
          msg={ this.state.msg }
          onClickMessageClose={ this.onClickMessageClose }
        />       
      </div>
    );
  }

  renderMessage() {
    console.log('Game : renderMessage : enter');
    // console.log('Game : renderMessage : state : '+JSON.stringify(this.state));
    return (
      <div className="game"> 
        <Message         
          msg={ this.state.msg }
          onClickMessageClose={ this.onClickMessageClose }
        />
      </div>
    );
  }

  renderSetupNew() {
    // chose create, entered name, chose size
    console.log('Game : renderSetupNew : enter');
    // console.log('Game : renderSetupNew : state : '+JSON.stringify(this.state));

    let cword = this.state.cword;

    return (
      <div className="game"> 
        <Init 
          action=''
          selectedAction={ Util.ACTION_TITLE }
          selectedSize={ cword.size }
          existingNames={ this.state.existingNames }
          onChangeAction={ this.onChangeAction }
        />
        <Message         
          msg={ this.state.msg }
          onClickMessageClose={ this.onClickMessageClose }
          onClickMessageConfirm={ this.onClickMessageConfirm }
        /> 
        <Param
          action= { this.state.action }
          cword={ cword}
          onClickParamCell={ this.onClickParamCell }
          onKeyUpParamAcrossTextarea={ this.onKeyUpParamAcrossTextarea }
          onKeyUpParamDownTextarea={ this.onKeyUpParamDownTextarea }
        />
      </div>
    );
  }

  renderUpdateWithName() {
    // chose update, entered name
    console.log('Game : renderUpdateWithName : enter');

    let cword = this.state.cword;

    return (
      <div className="game"> 
        <Init 
          action=''
          selectedAction={ Util.ACTION_TITLE }
          selectedSize={ cword.size }
          existingNames={ this.state.existingNames }
          onChangeAction={ this.onChangeAction }
        />
        <Message         
          msg={ this.state.msg }
          onClickMessageClose={ this.onClickMessageClose }
          onClickMessageConfirm={ this.onClickMessageConfirm }
        /> 
        <Param
          action= { this.state.action }
          cword={ cword}
          onClickParamCell={ this.onClickParamCell }
          onKeyUpParamAcrossTextarea={ this.onKeyUpParamAcrossTextarea }
          onKeyUpParamDownTextarea={ this.onKeyUpParamDownTextarea }
        />
      </div>
    );
  }

  renderExportWithName() {
    // chose export, entered name
    console.log('Game : renderExportWithName : enter');

    let cword = this.state.cword;

    return (
      <div className="game"> 
        <Init 
          action=''
          selectedAction={ Util.ACTION_TITLE }
          selectedSize={ cword.size }
          existingNames={ this.state.existingNames }
          onChangeAction={ this.onChangeAction }
        />
        <Message         
          msg={ this.state.msg }
          onClickMessageClose={ this.onClickMessageClose }
          onClickMessageConfirm={ this.onClickMessageConfirm }
        /> 
        <Param
          action= { this.state.action }
          cword={ cword}
        />
      </div>
    );
  }

  renderPlayWithName() {
    // chose play and name
    console.log('Game : renderPlayWithName : enter');
    // console.log('Game : renderPlay : state : '+JSON.stringify(this.state));

    let cword = this.state.cword;
    let updateTimestamp = this.state.updateTimestamp;

    return (
      <div className="game"> 
        <Init 
          action=''
          selectedAction={ Util.ACTION_TITLE }
          existingNames={ this.state.existingNames }
          onChangeAction={ this.onChangeAction }
        />
        <Message         
          msg={ this.state.msg }
          onClickMessageClose={ this.onClickMessageClose }
          onClickMessageConfirm={ this.onClickMessageConfirm }
        /> 
        <Play
          cword={ cword }
          updateTimestamp={ updateTimestamp }
          onClickPlayCell={ this.onClickPlayCell }
          onChangePlayCell={ this.onChangePlayCell }
          onKeyUpPlayCell={ this.onKeyUpPlayCell }
          onKeyDownPlayCell={ this.onKeyDownPlayCell }
          onClickAcrossClue={ this.onClickAcrossClue }
          onClickDownClue={ this.onClickDownClue }
        />
      </div>
    );
  }

  renderPlay() {
    // chose play
    console.log('Game : renderPlay : enter');
    // console.log('Game : renderPlay : state : '+JSON.stringify(this.state));

    return (
      <div className="game"> 
        <Init 
          action={ this.state.action}
          selectedAction={Util.ACTION_PLAY}
          existingNames={ this.state.existingNames }
          onChangeName={ this.onChangeName }
          onChangeAction={ this.onChangeAction }
        /> 
        <Message         
          msg={ this.state.msg }
          onClickMessageClose={ this.onClickMessageClose }
        />   
      </div>
    );
  }

  renderDelete() {
    // chose delete
    console.log('Game : renderDelete : enter');
    console.log('Game : renderDelete : state : '+JSON.stringify(this.state));

    return (
      <div className="game"> 
        <Init 
          action={ this.state.action}
          selectedAction={Util.ACTION_DELETE}
          existingNames={ this.state.existingNames }
          onChangeName={ this.onChangeName }
          onChangeAction={ this.onChangeAction }
        /> 
        <Message         
          msg={ this.state.msg }
          onClickMessageClose={ this.onClickMessageClose }
        />   
      </div>
    );
  }

  renderUpdate() {
    // chose update
    console.log('Game : renderUpdate : enter');
    console.log('Game : renderUpdate : state : '+JSON.stringify(this.state));

    return (
      <div className="game"> 
        <Init 
          action={ this.state.action}
          selectedAction={Util.ACTION_UPDATE}
          existingNames={ this.state.existingNames }
          onChangeName={ this.onChangeName }
          onChangeAction={ this.onChangeAction }
        /> 
        <Message         
          msg={ this.state.msg }
          onClickMessageClose={ this.onClickMessageClose }
        />   
      </div>
    );
  }

  renderExport() {
    // chose export
    console.log('Game : renderExport : enter');
    console.log('Game : renderExport : state : '+JSON.stringify(this.state));

    return (
      <div className="game"> 
        <Init 
          action={ this.state.action}
          selectedAction={Util.ACTION_EXPORT}
          existingNames={ this.state.existingNames }
          onChangeName={ this.onChangeName }
          onChangeAction={ this.onChangeAction }
        /> 
        <Message         
          msg={ this.state.msg }
          onClickMessageClose={ this.onClickMessageClose }
        />   
      </div>
    );
  }

  renderImport() {
    // chose import
    console.log('Game : renderImport : enter');
    console.log('Game : renderImport : state : '+JSON.stringify(this.state));

    return (
      <div className="game"> 
        <Init 
          action={ this.state.action}
          selectedAction={Util.ACTION_IMPORT}
          existingNames={ this.state.existingNames }
          onChangeName={ this.onChangeName }
          onChangeAction={ this.onChangeAction }
        /> 
        <Message         
          msg={ this.state.msg }
          onClickMessageClose={ this.onClickMessageClose }
          onClickMessageConfirm={ this.onClickMessageConfirm }
        />   
        <Param
          cword = {this.state.cword}
          action= { this.state.action }
          onKeyUpImportTextarea={ this.onKeyUpImportTextarea }
        />
      </div>
    );
  }

  renderMessageAfterAction() {
    // chose delete / createExample
    console.log('Game : renderMessageAfterAction : enter');
    // console.log('Game : renderMessageAfterAction : state : '+JSON.stringify(this.state));

    let name = '';
    if (this.state.cword != null) {
      name = this.state.cword.name;
    }

    return (
      <div className="game"> 
        <Init 
          action={ this.state.action}
          selectedAction={Util.ACTION_TITLE}
          name={ name}
          existingNames={ this.state.existingNames }
          onChangeName={ this.onChangeName }
          onChangeAction={ this.onChangeAction }
        /> 
        <Message         
          msg={ this.state.msg }
          onClickMessageClose={ this.onClickMessageClose }
        />   
      </div>
    );
  }

  renderInit() {
    console.log('Game : renderInit : enter');
    // console.log('Game : renderInit : state : '+JSON.stringify(this.state));
    return (
      <div className="game">   
        <Init 
          existingNames={ this.state.existingNames }
          onChangeAction={ this.onChangeAction }
        />    
        <Message         
          msg={ this.state.msg }
          onClickMessageClose={ this.onClickMessageClose }
        />      
      </div>
    );
  }

  render() {
    
    let action = this.state.action;

    let name = '';
    let size = '';
    let cword = this.state.cword;
    if (cword != null) {
      name = cword.name;
      size = cword.size;
    }

    console.log('Game : START : -------------------------------------------->');
    console.log('Game : START : render ------------------------------------->');
    console.log('Game : START : ------- action : '+action+' ------------------------------------->');
    console.log('Game : START : ------- name : '+name+' ------------------------------------->');
    console.log('Game : START : ------- size : '+size+' ------------------------------------->');
    console.log('Game : START : -------------------------------------------->'); 

    if (action === Util.ACTION_CREATE) {
      if (name === '') {
        // name + size to be chosen
        console.log('Game : START : ------- CASE : Create/NoName -----> renderCreate'); 
        return this.renderCreate();
      } else {
        if (size === '') {
          // name has been chosen, size to be chosen
          console.log('Game : START : ------- CASE : Create/Name/NoSize -----> renderCreateWithName'); 
          return this.renderCreateWithName();
        } else {
          // name, size has been chosen, cword saved, show message and params
          console.log('Game : START : ------- CASE : Create/Name/Size -----> renderSetupNew'); 
          return this.renderSetupNew();
        }
      }
    } else if (action === Util.ACTION_CREATE_EXAMPLE) {
      if (name === '') {
        // name to be chosen
        console.log('Game : START : ------- CASE : CreateExample/NoName -----> renderCreateExample'); 
        return this.renderCreateExample();
      } else {
        console.log('Game : START : ------- CASE : CreateExample/Name -----> renderMessageAfterAction'); 
        return this.renderMessageAfterAction();
      }
    } else if (this.state.action === Util.ACTION_PLAY) {
      if (name === '') {
        console.log('Game : START : ------- CASE : Play/NoName -----> renderPlay');
        return this.renderPlay();
      } else {
        console.log('Game : START : ------- CASE : Play/Name -----> renderPlayWithName');
        return this.renderPlayWithName();
      }
    } else if (this.state.action === Util.ACTION_UPDATE) {
      if (name === '') {
        // name to be chosen
        console.log('Game : START : ------- CASE : Update/NoName -----> renderUpdate'); 
        return this.renderUpdate();
      } else {
        console.log('Game : START : ------- CASE : Update/Name -----> renderUpdateWithName'); 
        return this.renderUpdateWithName();
      }
    } else if (this.state.action === Util.ACTION_EXPORT) {
      if (name === '') {
        // name to be chosen
        console.log('Game : START : ------- CASE : Export/NoName -----> renderExport'); 
        return this.renderExport();
      } else {
        console.log('Game : START : ------- CASE : Export/Name -----> renderExportWithName'); 
        return this.renderExportWithName();
      }
    } else if (this.state.action === Util.ACTION_IMPORT) {

      console.log('Game : START : ------- CASE : Import -----> renderImport'); 
      return this.renderImport();
       
    } else if (action === Util.ACTION_DELETE) {
      if (name === '') {
        console.log('Game : START : ------- CASE : Delete/NoName -----> renderDelete');
        return this.renderDelete();
      } else {
        console.log('Game : START : ------- CASE : Delete/Name -----> renderMessageAfterAction');
        return this.renderMessageAfterAction();
      }
    } else if (this.state.action === Util.ACTION_CLEAR) {
      console.log('Game : START : ------- CASE : Clear -----> renderInit');
      return this.renderInit();   
    } else {
      console.log('Game : START : ------- CASE : Default -----> renderInit');
      return this.renderInit();        
    }   
    
  }

  
}

export default Game;
