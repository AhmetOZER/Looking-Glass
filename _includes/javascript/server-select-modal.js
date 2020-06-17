showAllListStat = "no";

// Show All Servers On List in Modal
function listAllToggleToShow() {
    if (showAllListStat == "no") {
      $('#serverList').find('.collapse').collapse('show')
      showAllListStat = "yes"
      $("#showAllLgList")
      .html("Hide all")
      .removeClass('btn-outline-info')
      .addClass('btn-outline-warning');
    } else {
        var itemId = Cookies.get('SelectedServerID')
        if (itemId != null && itemId != "") {
          $('.collapse').not($('#'+itemId).parents()).collapse('hide')
          $('#'+itemId).parents().collapse('show')
        } else {
          $('#serverList').find('.collapse').collapse('hide')
        }
        showAllListStat = "no"
        $("#showAllLgList")
        .html("Show all")
        .addClass('btn-outline-info')
        .removeClass('btn-outline-success')
        .removeClass('btn-outline-warning');
    }
}

// Clear Server Selection
function ListServerSelectDelete() {
  Cookies.remove('SelectedServerID')
  svButtonLoadSave()
}

// Apply Server Config to Front End
function svApplyConfig(config) {
var isEnabled
for (confIndex in config) {

if ( typeof config[confIndex] == "object"){
  isEnabled = svApplyConfig(config[confIndex])
  } else {
      if (isEnabled) {
          if(config[confIndex] == "enabled") {
              isEnabled = "enabled"
          }
      } else {
          isEnabled = config[confIndex]
          // after for
if (config[confIndex] == "enabled") {
  $("#lgOption"+confIndex).prop('disabled', false);
} else {
  $("#lgOption"+confIndex).prop('disabled', true);
}
      }
      console.log(confIndex,config[confIndex])
  }
}


return isEnabled
}

//
function svButtonLoadSave(itemId) {
if (itemId != null && itemId != "") {
  $('.collapse').not($('#'+itemId).parents()).collapse('hide')
  $('#'+itemId).parents().collapse('show')
  $('#'+itemId).addClass('list-group-item-info')
  
  $("#serverSelectButton")
      .html($('#'+itemId).data( "svname" ))
      .addClass('btn-outline-light').removeClass('btn-outline-danger');
  svApplyConfig($('#'+itemId).data( "svconf" ));
  
} else {
  $("#serverList")
  .find('.collapse').collapse('hide')
  .find('.lgserver').removeClass('list-group-item-info');
  $("#serverSelectButton")
      .html("Please Select Server")
      .addClass('btn-outline-danger').removeClass('btn-outline-light');
}
}

// When the server clicked , Run these. "svButtonTrigger()"
function svButtonTrigger() {
$(function() {
  $('.server-list-group-item').on('click', function() {
      $('.collapse').not($(this).parents('')).collapse('hide');
      if (showAllListStat == "yes") {
          $("#showAllLgList")
              .html("Show current")
              .addClass('btn-outline-success')
              .removeClass('btn-outline-warning');
        //$(this).collapse("show")
      }
  });
});
$(function() {
  $('.lgserver').on('click', function() {
      if (showAllListStat == "yes") {
          $('.collapse').not($(this).parents('')).collapse('hide');
          $("#showAllLgList")
              .html("Show all")
              .addClass('btn-outline-info')
              .removeClass('btn-outline-success')
              .removeClass('btn-outline-warning');
              showAllListStat = "no"
      }
      $('.lgserver').removeClass('list-group-item-info')
      Cookies.set('SelectedServerID', $(this).attr('id'))
      $("#serverSelectButton").html($(this).data( "svname" ));
      svApplyConfig($(this).data( "svconf" ))
      $('#serverSelectButton').addClass('btn-outline-light').removeClass('btn-outline-danger');
      $(this)
          .toggleClass('list-group-item-info')
          .toggleClass('');
  });
  });
}
// END of the "svButtonTrigger()"

// Compare Nested Configs with Recursive , "svConfigComparisor"
function svConfigComparisor(oldConfig,newConfig) {
var tempConfig = oldConfig
for (confIndex in oldConfig) {
  //console.log("index = "+index)
  if ( typeof oldConfig[confIndex] == "object" && typeof newConfig[confIndex] == "object"){
      tempConfig[confIndex] = svConfigComparisor(oldConfig[confIndex],newConfig[confIndex])
  } else {
      if (newConfig[confIndex]) {
          tempConfig[confIndex] = newConfig[confIndex]
      } else {
          tempConfig[confIndex] = oldConfig[confIndex]
      }
  }
}
return tempConfig
}
// End of the "svConfigComparisor"
function arrToDashString(incomingArray) {
//return
var tempString = ""
for (item in incomingArray) {
  if ( tempString == "") {
      tempString = incomingArray[item]
  } else {
      tempString = tempString + "-" +incomingArray[item]
  }
  
}
console.log(tempString)
return tempString
}
function returnTempArr(arr,arr2) {
var tempArr = []
for (item in arr) {
  tempArr.push(arr[item])
}
if (arr2) {
  tempArr.push(arr2)
}
return tempArr
}
// Load Looking Glass Server List
function lgServerListLoad(data,Config,depth) {
// Check maximum Depth
if ( depth != null && typeof depth == "object" ) {
    if (depth.length > 6){console.log("You are reach maximum depth of server list. Please keep list depth at maximum 5."); return } // If is not check 5 because modal id exist in array
} else { console.log("Depth is not array"); return}

var curIndex = 1;
 for (index in data) {
   //console.log("Old config for "+index,Config)
  
  // Check if has a config or not. If element has a config then make a Compare
   if (data[index]["ServerConfig"]) {
       var curConfig = svConfigComparisor(Config,data[index]["ServerConfig"])
   } else {
       var curConfig = Config
   }
   
  // If name not exist, get Json Object name
   if (typeof data[index]["Name"] == "undefined" && data[index]["Name"] != "" ) {
      var lgSvName = index;
   } else {
      var lgSvName = data[index]["Name"];
   }

   // Control If Server Description Exist
   if (typeof data[index]["Description"] == "undefined") {
      var lgSVDescription = "";
   } else {
      var lgSVDescription = data[index]["Description"];
   }

   // Check Data type, It might be nested list or Server
   if ( data[index]["JsonURL"]  ) {
     //lgServerListLoadAjax(data[index]["JsonURL"],depth,curIndex);
     console.log("Currently Nested Json List is not Supported")
   } else if ( typeof data[index]["Servers"] == "object" ) {// Look is a list or Server, If its list it returns object if not return undefined.
      // Do for list items, First create list item after run recursive
      console.log("Bu bir liste "+lgSvName,returnTempArr(depth,curIndex))
      var tempDepth = returnTempArr(depth,curIndex)
      //console.log(depth,tempDepth)
      $( "#"+arrToDashString(depth) ).append(`<a href="#`+arrToDashString(tempDepth)+`" class="server-list-group-item list-group-item list-group-item-action btn btn-dark" data-toggle="collapse"><i class="fas fa-list text-dark"></i> `+lgSvName+`<small class="text-muted float-right">`+lgSVDescription+`</small></a><div class="list-group collapse" id="`+arrToDashString(tempDepth)+`"> ` );
      // Recursive Call
      lgServerListLoad(data[index]["Servers"],curConfig, returnTempArr(depth,curIndex))
      $( "#"+arrToDashString(depth) ).append(`</div>`);

  } else if( data[index]["Url"] ) {
      // Do for server items
      tempDepth =returnTempArr(depth,curIndex)
      console.log("Bu bir server "+lgSvName,tempDepth)
      $( "#"+arrToDashString(depth) ).append(`<a href="#" class="server-list-group-item list-group-item list-group-item-action btn btn-light lgserver" data-svurl='`+data[index]["Url"]+`' data-svName='`+lgSvName+`' data-svconf='`+JSON.stringify(curConfig)+`' id="`+arrToDashString(tempDepth)+`"><i class="fas fa-server text-primary"></i>`+lgSvName+`<small class="text-muted float-right">`+lgSVDescription+`</small></a>` );

  } else {
        console.log("Error: "+arrToDashString(depth)+" "+index+" is unknown type of server.")
    }
    // Current index location in for, increase every item in loop
    curIndex = curIndex+1
 } // for loop end
}
// End of the "lgServerListLoad"

// Get server list with ajax
function lgServerListLoadAjax(URL,curIndex) {
$.ajax({
url: URL,
dataType: 'json',
success: function( data ) {
lgServerListLoad(data["Servers"],data["ServerConfig"],["serverList"]);
svButtonTrigger();
svButtonLoadSave(Cookies.get('SelectedServerID'))
},
error: function( data ) {
if ( data["status"] == 200) {
  console.log( 'ERROR: ', "Json Parse Error" );
} else {
  console.log( 'ERROR: ', data );
}

}
});
}
lgServerListLoadAjax("server.json",0);