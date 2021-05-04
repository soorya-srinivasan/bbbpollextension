
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
   var name = document.getElementsByTagName("tr");
   var res={};
   for(var i=1;i<name.length;i++){
   	   var left=document.getElementsByTagName("tr")[i].getElementsByTagName('td');   	   
   	   if(left){
   	   	  res[i]=[left[0].textContent,left[1].textContent];
   	   }
   }
    sendResponse({ fromcontent: res });
});