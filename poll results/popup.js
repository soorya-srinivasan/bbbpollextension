


var sendMessageId = document.getElementById("but");
var save=document.getElementById("save");
var clear=document.getElementById("clear");
var div=document.getElementById("res");
var evaluate=document.getElementById("evaluate");
var responses="";
var indexx=0;
var answers={};
var currresponse="";


function handleFileSelect(event){
  const reader = new FileReader()
  reader.onload = handleFileLoad;
  reader.readAsText(event.target.files[0])
}

function handleFileLoad(event){
  answers={};
  var ll=event.target.result.split("\n");
  for(var kk=0;kk<ll.length;kk++){
    var temp=ll[kk].split(" ");
    if(temp.length==2){
      answers[parseInt(temp[0])]=temp[1];  
    }
    
  }
}

document.getElementById('answerfile').addEventListener('change', handleFileSelect, false);






chrome.storage.local.get(['responses'],function(data){ 
	var topmsg="";
	if(data.hasOwnProperty("responses")){
    currresponse=data.responses;
		for(var k=1;k<=Object.getOwnPropertyNames(data.responses).length;k++){
      indexx=k;
	    var msg='<br><b>'+k.toString()+'</b><br>'+'<table id="customers"><tr><th>User</th><th>Response</th></tr>';
      for(var j=1;j<=Object.getOwnPropertyNames(data.responses[k]).length;j++){
    	 msg=msg+"<tr>"+"<td>"+data.responses[k][j][0]+"</td><td>"+data.responses[k][j][1]+"</td></tr>";
      }
      msg+='</table><br><hr style="height:2px;border-width:0;color:gray;background-color:gray">';
      topmsg+=msg;
    }
	}	
  document.getElementById("res").innerHTML=topmsg;   
});



if(evaluate){
  evaluate.onclick=function(){
    var currentresponse=currresponse
    if(Object.getOwnPropertyNames(answers).length>0 && Object.getOwnPropertyNames(currentresponse).length ){    
      var userresponse={};
      var leaderboard={};
      for(var q=1;q<=Object.getOwnPropertyNames(currentresponse).length;q++){
        for(var user=1;user<=Object.getOwnPropertyNames(currentresponse[q]).length;user++){
          userlist=currentresponse[q][user];          
          if (!userresponse.hasOwnProperty(userlist[0])){
            userresponse[userlist[0]]={"correct":0,"incorrect":0};
            leaderboard[userlist[0]]=0;            
          }         
          var useranswer="";
          if(userlist[1]){
            useranswer=userlist[1].toLowerCase();
          }
          else{
            useranswer="--";
            currentresponse[q][user][1]=" -";
          }
          if(useranswer.replace(/\s+/g, "")==answers[q].replace(/\s+/g, "")){
            userresponse[userlist[0]][q]=[useranswer,true];
            userresponse[userlist[0]]["correct"]+=1;
            leaderboard[userlist[0]]+=1;
          }
          else{
            userresponse[userlist[0]][q]=[userlist[1],false];
            userresponse[userlist[0]]["incorrect"]+=1;
          }
        }
      }

      var sortedleaderboard = new Map([... new Map(Object.entries(leaderboard))].sort((aa, b) => b[1] - aa[1]));
      sortedleaderboard=Array.from(sortedleaderboard.entries());
      var report="name,";
      var qlen=Object.getOwnPropertyNames(answers).length;
      for(var i=1;i<=qlen;i++){
        report+=i.toString()+",";
      }
      report+="correct,incorrect\n";
      for(var qq=0;qq<sortedleaderboard.length;qq++){
        report+=sortedleaderboard[qq][0]+",";
        for (var jj=1;jj<=qlen;jj++){
          if(userresponse[sortedleaderboard[qq][0]].hasOwnProperty(jj)){
            report+=userresponse[sortedleaderboard[qq][0]][jj][0];
            if(userresponse[sortedleaderboard[qq][0]][jj][1]){
              report+="(C),";
            }
            else{
             report+="(IC),"; 
            }

          }
          else{
            report+= " -(IC),";
          }
        }
        report+=sortedleaderboard[qq][1].toString()+","+(qlen-sortedleaderboard[qq][1]).toString()+"\n";
      }
      var blob = new Blob([report], {type: "text/csv"});
      var link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.setAttribute('download', 'fstivalquizresults.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
 
}

if(clear){
	clear.onclick = function() {
  indexx=0;
	chrome.storage.local.clear(function() {
    var error = chrome.runtime.lastError;
    if (error) {
        console.error(error);
    }

    else{
    	document.getElementById("res").innerHTML="";
    }
});
}
}
if(save){
	 save.onclick = function() {
	chrome.storage.local.get(['responses'],function(data){
		if(data.hasOwnProperty("responses")){
			var topmsg="";
			for(var k=1;k<=Object.getOwnPropertyNames(data.responses).length;k++){
			
	var msg="";
    for(var j=1;j<=Object.getOwnPropertyNames(data.responses[k]).length;j++){
    	msg=msg+data.responses[k][j][0]+" "+(data.responses[k][j][1] || "-")+"\n";
    }
    
    topmsg=topmsg+msg+"\n\n";
}
			var blob = new Blob([topmsg], {type: "text/plain"});
			var url = URL.createObjectURL(blob);
			chrome.downloads.download({
  				url: url // The object URL can be used as download URL
  //...
			});
		}
		
	});
}
}
if (sendMessageId) {
    sendMessageId.onclick = function() {
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        	
            chrome.tabs.sendMessage(tabs[0].id,{message: "import",tabId: tabs[0].id},function(response) {
            	
    			
    			if(Object.getOwnPropertyNames(response["fromcontent"]).length>0){
            indexx+=1;
    				var msg='<br><b>'+indexx.toString()+'</b><br>'+'<table id="customers"><tr><th>User</th><th>Response</th></tr>';
    			for(var j=1;j<=Object.getOwnPropertyNames(response["fromcontent"]).length;j++){
    				msg=msg+"<tr>"+"<td>"+response["fromcontent"][j][0]+"</td><td>"+response["fromcontent"][j][1]+"</td></tr>";
    			}
    			msg+='</table><br><hr style="height:2px;border-width:0;color:gray;background-color:gray">';
    			document.getElementById("res").innerHTML=document.getElementById("res").innerHTML+msg;
    			chrome.storage.local.get(['responses'],function(data){
    					
    					if(data.responses){
    						data.responses[Object.getOwnPropertyNames(data.responses).length+1]=response["fromcontent"];
					   		responses=data.responses
   							
   						}
   						else{
   							responses={};
   	 						responses[1]=response["fromcontent"];
   	 						
   	 					}
   	 					chrome.storage.local.set({'responses': responses});
              currresponse=responses;
				});
					
    			}  

  			}		                           
  			);
           
        });
    };
}