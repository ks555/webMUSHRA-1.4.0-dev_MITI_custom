/*************************************************************************
         (C) Copyright AudioLabs 2017 

This source code is protected by copyright law and international treaties. This source code is made available to You subject to the terms and conditions of the Software License for the webMUSHRA.js Software. Said terms and conditions have been made available to You prior to Your download of this source code. By downloading this source code You agree to be bound by the above mentionend terms and conditions, which can also be found here: https://www.audiolabs-erlangen.de/resources/webMUSHRA. Any unauthorised use of this source code may result in severe civil and criminal penalties, and will be prosecuted to the maximum extent possible under law. 

**************************************************************************/

function LikertSingleStimulusPage(_pageManager, _pageTemplateRenderer, _pageConfig, _audioContext, _bufferSize, _audioFileLoader, _stimulus, _session, _errorHandler, _language) {
  this.pageManager = _pageManager;
  this.pageTemplateRenderer = _pageTemplateRenderer; 
  this.pageConfig = _pageConfig;  
  this.audioContext = _audioContext;
  this.bufferSize = _bufferSize;
  this.audioFileLoader = _audioFileLoader;
  this.stimulus = _stimulus;  
  this.session = _session;      
  this.errorHandler = _errorHandler;
  this.language = _language;
  this.fpc = null;    
    
  this.audioFileLoader.addFile(this.stimulus.getFilepath(), (function (_buffer, _stimulus) { _stimulus.setAudioBuffer(_buffer); }), this.stimulus);
  this.filePlayer = null;
  this.likert1 = null;
  this.likert2 = null;
  this.likert3 = null;
  this.likert4 = null;
  this.ratingMap = new Array();
    
  this.time = 0; 
  this.startTimeOnPage = null;
  this.result1= null;
  this.result2= null;
  this.result3= null;
  this.result4= null;
} 

LikertSingleStimulusPage.prototype.getName = function () {
  return this.pageConfig.name;
};

LikertSingleStimulusPage.prototype.init = function (_callbackError) { 
  this.filePlayer = new FilePlayer(this.audioContext, this.bufferSize, [this.stimulus], this.errorHandler, this.language, this.pageManager.getLocalizer());
  
    var cbk = (function(_prefix) {
    this.ratingMap[_prefix] = true;
    if (Object.keys(this.ratingMap).length == 1) {
      this.pageTemplateRenderer.unlockNextButton();
    }
  }).bind(this);
  
  
  if (this.pageConfig.mustRate === false) {
    cbk = false;  
  }
  
  
    this.likert1 = new LikertScale(this.pageConfig.response, "1_", this.pageConfig.mustPlayback == true, cbk, "60%", "60%");
    this.likert2 = new LikertScale(this.pageConfig.response, "2_", this.pageConfig.mustPlayback == true, cbk, "60%", "60%"); 
    this.likert3 = new LikertScale(this.pageConfig.response, "3_", this.pageConfig.mustPlayback == true, cbk, "60%", "60%");
    this.likert4 = new LikertScale(this.pageConfig.response, "4_", this.pageConfig.mustPlayback == true, cbk, "60%", "60%"); 
 
  if (this.pageConfig.mustPlayback) {
    this.filePlayer.genericAudioControl.addEventListener((function (_event) {
      if (_event.name == 'ended') {
        this.likert1.enable();
	this.likert2.enable();
        this.likert3.enable();
	this.likert4.enable();
      } 
    }).bind(this));

	}

};
  



LikertSingleStimulusPage.prototype.render = function (_parent) {  
      
  this.filePlayer.render(_parent);

//Content 1
  var div = $("<div></div>");
  _parent.append(div);

  var content1; 
  if(this.pageConfig.content1 === null){
    content ="";
  } else {
    content1 = this.pageConfig.content1;
  }
  
  var p = $("<p><h4>" + content1 + "</h4></p>");
  div.append(p);

  //Question 1
  var divq1 = $("<div align=left></div>");
  _parent.append(divq1);
  var question1; 
  if(this.pageConfig.question1 === null){
    question1 ="";
  } else {
    question1 = "1. " + this.pageConfig.question1;
  }
  var p = $("<p padding-bottom=5px>" + question1 + "</p>");
  divq1.append(p);

  this.likert1.render(_parent);

  //Question 2
  var divq2 = $("<div align=left></div>");
  _parent.append(divq2);
  var question2; 
  if(this.pageConfig.question2 === null){
    question2 ="";
  } else {
    question2 = "2. " +this.pageConfig.question2;
  }
  var p = $("<p>" + question2 + "</p>");
  divq2.append(p);

  this.likert2.render(_parent);


//Content 2
  var div = $("<div></div>");
  _parent.append(div);

  var content2; 
  if(this.pageConfig.content2 === null){
    content2 ="";
  } else {
    content2 = this.pageConfig.content2;
  }
  
  var p = $("<p><h4>" + content2 + "</h4></p>");
  div.append(p);


    //Question 3
  var divq3 = $("<div align=left></div>");
  _parent.append(divq3);
  var question3; 
  if(this.pageConfig.question3 === null){
    question3 ="";
  } else {
    question3 = "1. " + this.pageConfig.question3;
  }
  var p = $("<p>" + question3 + "</p>");
  divq3.append(p);

  this.likert3.render(_parent);

    //Question 4
  var divq4 = $("<div align=left></div>");
  _parent.append(divq4);
  var question4; 
  if(this.pageConfig.question4 === null){
    question4 ="";
  } else {
    question4 = "2. " + this.pageConfig.question4;
  }
  var p = $("<p>" + question4 + "</p>");
  divq4.append(p);

  this.likert4.render(_parent); 
  
  this.fpc = new FilePlayerController(this.filePlayer);
  this.fpc.bind();


};

LikertSingleStimulusPage.prototype.load = function () {  
  this.startTimeOnPage = new Date();
  if(this.pageConfig.mustRate == true){
    this.pageTemplateRenderer.lockNextButton();
  }
	if(this.result){
    $("input[name='"+this.likert1.prefix +"_response'][value='"+this.result+"']").attr("checked", "checked");
    $("input[name='"+this.likert1.prefix +"_response'][value='"+this.result+"']").checkboxradio("refresh");
    $("input[name='"+this.likert2.prefix +"_response'][value='"+this.result+"']").attr("checked", "checked");
    $("input[name='"+this.likert2.prefix +"_response'][value='"+this.result+"']").checkboxradio("refresh");
    $("input[name='"+this.likert3.prefix +"_response'][value='"+this.result+"']").attr("checked", "checked");
    $("input[name='"+this.likert3.prefix +"_response'][value='"+this.result+"']").checkboxradio("refresh");
    $("input[name='"+this.likert4.prefix +"_response'][value='"+this.result+"']").attr("checked", "checked");
    $("input[name='"+this.likert4.prefix +"_response'][value='"+this.result+"']").checkboxradio("refresh");
    this.likert1.group.change();    
    this.likert2.group.change();
    this.likert3.group.change();    
    this.likert4.group.change();  
  }
  
  this.filePlayer.init();
};

LikertSingleStimulusPage.prototype.save = function () {
  this.fpc.unbind(); 
  this.time += (new Date() - this.startTimeOnPage);
  
  this.result1 = $("input[name='"+this.likert1.prefix +"_response']:checked").val();
  this.result2 = $("input[name='"+this.likert2.prefix +"_response']:checked").val();
  this.result3 = $("input[name='"+this.likert3.prefix +"_response']:checked").val();
  this.result4 = $("input[name='"+this.likert4.prefix +"_response']:checked").val();

  this.filePlayer.free();
};

LikertSingleStimulusPage.prototype.store = function (_reponsesStorage) {
		
	
	
  var trial = this.session.getTrial(this.pageConfig.type, this.pageConfig.id);
  if (trial === null) {
    trial = new Trial();
	trial.type = this.pageConfig.type;
	trial.id = this.pageConfig.id;
	this.session.trials[this.session.trials.length] = trial;	  
  }
  var rating = new LikertSingleStimulusRating();
  rating.stimulus = this.stimulus.id;
  
  if(this.result1 == undefined){
    rating.stimulusRating1 = "NA";
    rating.stimulusRating2 = "NA";
  }else{
    rating.stimulusRating1 = this.result1;
    rating.stimulusRating2 = this.result2;
    rating.stimulusRating3 = this.result3;
    rating.stimulusRating4 = this.result4;
  }
    
  rating.time = this.time;
  trial.responses[trial.responses.length] = rating;


};
