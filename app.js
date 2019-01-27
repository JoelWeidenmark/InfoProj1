

var dataArray = [];
var updateData = [];
var groupArray = [];
var clickedUsers = [];
addEventListeners();
createGroups();


d3.json("Project1JSON.json").then(function(data){
  	data.forEach(function(d) {
      //updateData.push(d)
  		dataArray.push(d)
  	})
  	//console.log(dataArray)
  	createUsers(dataArray)

});


function createGroups(){
  for(i = 0; i < 10; i++){
    groupArray.push([]);
  }
  //console.log(groupArray)
}

function createUsers(inData){
	var myNode = document.getElementById("SVGsContainer");
	myNode.innerHTML = '';
	var names = [];
  //console.log(dataArray);
	for (i = 0; i < inData.length; i++){
    //inData[i]["group"] =  "0";
		drawUserBox(inData[i], "#SVGsContainer", null)
  }
}

function updateUserList(){
  var myNode = document.getElementById("SVGsContainer");
  myNode.innerHTML = '';

  //console.log(dataArray)
  for (i = 0; i < dataArray.length; i++){
    drawUserBox(dataArray[i], "#SVGsContainer", null)
  }
}

function updateGroups(){
  //Empty
  for(i = 0; i < groupArray.length; i++){
    var locationString = "group" + (i + 1) + "Members";
    console.log("Deleting in " + locationString)
    var myNode = document.getElementById(locationString);
    myNode.innerHTML = '';
  }
  //Fill
  for(i = 0; i < groupArray.length; i++){
    console.log(groupArray)
    for(j = 0; j < groupArray[i].length; j++){
      var locationString = "group" + (i) + "Members";
      drawUserBox(groupArray[i][j], "#" + locationString, null)
    }
  }

}

function drawUserBox(user, location, group){
	var currentName = user.Name;


	var svgContainer = d3.select(location).append("svg")
		    .attr("width", "100%")
        .attr("height", 60)
        .attr("fill", "grey");
    svgContainer.append("rect")
        .attr("x", 1)
        .attr("y", 1)
        .attr("width", "100%")
      	.attr("height", 60);
    svgContainer.append("title")
        .text("SDFGsdfgsdfhsdfhEWRSERHWRTHRTS\n asdfasdgasd" );
    svgContainer.append("text")
		    .attr("x", 10)
        .attr("y", 20)
        .text(user.Name)
        .attr("fill", "black");
    svgContainer.on("click", function() { 
    	let counter = 0;
      let inClicked = false;
      svgContainer.attr("fill", "red");


      for(i = 0; i < clickedUsers.length; i++){
        if(clickedUsers[i].Name == currentName){
          clickedUsers.splice(i, 1)
          inClicked = true;
          //console.log(clickedUsers)
          //console.log(dataArray)
        }
      }

      if(inClicked){
        svgContainer.attr("fill", "grey");
        inClicked = false;
      }
      else{
        chooseUser(user);
      }
    });
}



function chooseUser(user){
  clickedUsers.push(user);

}

function groupClick(num){
  if (clickedUsers.length != 0){

    for (i = 0; i < dataArray.length; i++){
      for(j = 0; j < clickedUsers.length; j++){
        if(dataArray[i].Name == clickedUsers[j].Name){
          dataArray.splice(i, 1)
        }
      }
    }

    for(i = 0; i < clickedUsers.length; i++){
      for(j = 0; j < groupArray.length; j++){
        for(k = 0; k < groupArray[j].length; k++){
          if(clickedUsers[i].Name == groupArray[j][k].Name){
            groupArray[j].splice(k, 1);
          }
        }
      }
    }


    for(i = 0; i < groupArray.length; i++){
      for(j = 0; j < groupArray[i].length; j++){
        for(k = 0; k < clickedUsers.length; k++){
          console.log(clickedUsers)
          if(clickedUsers[k].Name == groupArray[i][j].Name){
            console.log("Pos: " + j)
            console.log("Removing: " + groupArray[i][j].Name)
            
            //j = j-1;
          }
        }
      }
    }

    //Remove object from groupArray
    /*
    if(updateThese.length > 0){
      removeFromGroups(updateThese);
    }*/
    for(i = 0; i < clickedUsers.length; i++){
      groupArray[num].push(clickedUsers[i])
    }
    updateGroups();

    //let locationString = "#group" + num + "Members";
    //console.log(locationString)

    /*
    for(i = 0; i < clickedUsers.length; i++){
        //if(group != null){
        //var groupAsNum = parseInt(num)
          //console.log(groupAsNum)
          //console.log(groupAsNum)
        //groupArray[groupAsNum].push(clickedUsers[i]);
          //console.log(groupArray)
          //console.log(groupArray[groupAsNum-1])
        //}
      //console.log("hej")
      //let numberfy = parseInt(num) - 1;
      drawUserBox(clickedUsers[i], locationString, num);
    }*/
    
    updateUserList();
    clickedUsers = [];
  }
}



function addEventListeners(){
  document.getElementById("group1Btn").onclick = function() {groupClick("1")};
  document.getElementById("group2Btn").onclick = function() {groupClick("2")};
  document.getElementById("group3Btn").onclick = function() {groupClick("3")};
  document.getElementById("group4Btn").onclick = function() {groupClick("4")};
  document.getElementById("group5Btn").onclick = function() {groupClick("5")};
  document.getElementById("group6Btn").onclick = function() {groupClick("6")};
  document.getElementById("group7Btn").onclick = function() {groupClick("7")};
  document.getElementById("group8Btn").onclick = function() {groupClick("8")};
  document.getElementById("group9Btn").onclick = function() {groupClick("9")};
  document.getElementById("group10Btn").onclick = function() {groupClick("10")};
}
