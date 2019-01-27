
var dataArray = [];
var updateData = [];
var groupArray = [];
var clickedUsers = [];
addEventListeners();
createGroups();


d3.json("Project1JSON.json").then(function(data){
  	data.forEach(function(d) {
  		dataArray.push(d)
  	})
  	createUsers(dataArray)
});


function applySelectedFilter(){
  updateGroups();
  updateUserList();
  clickedUsers = [];
}

function createGroups(){
  for(i = 0; i < 10; i++){
    groupArray.push([]);
  }
}

function createUsers(inData){
	var myNode = document.getElementById("SVGsContainer");
	myNode.innerHTML = '';
	var names = [];
	for (i = 0; i < inData.length; i++){
		drawUserBox(inData[i], "#SVGsContainer", null)
  }
}

function updateUserList(){
  var myNode = document.getElementById("SVGsContainer");
  myNode.innerHTML = '';

  for (i = 0; i < dataArray.length; i++){
    drawUserBox(dataArray[i], "#SVGsContainer", null)
  }
}

function updateGroups(){
  //Empty
  for(i = 0; i < groupArray.length; i++){
    var locationString = "group" + (i + 1) + "Members";
    var myNode = document.getElementById(locationString);
    myNode.innerHTML = '';
  }
  //Fill
  for(i = 0; i < groupArray.length; i++){
    for(j = 0; j < groupArray[i].length; j++){
      var locationString = "group" + (i+1) + "Members";
      drawUserBox(groupArray[i][j], "#" + locationString, null)
    }
  }

}

function drawUserBox(user, location, group){

	var currentName = user.Name;

  var filter = document.getElementById("filterBox");
  var selectedFilter = filter.options[filter.selectedIndex].value;
  var color = "grey"

  if(selectedFilter == "Art" && user.ArtisticSkills > 5
    || selectedFilter == "Code Repo" && user.CodeRepositorySkills > 5
    || selectedFilter == "Collaboration" && user.CollaborationSkills > 5
    || selectedFilter == "Communication" && user.CommunicationSkills > 5
    || selectedFilter == "Computers" && user.ComputerSkills > 5
    || selectedFilter == "Graphics" && user.GraphicsSkills > 5
    || selectedFilter == "HCI Programming" && user.HCIProgrammingSkills > 5
    || selectedFilter == "Math" && user.MathSkills > 5
    || selectedFilter == "Programming" && user.ProgrammingSkills > 5
    || selectedFilter == "Statistics" && user.StatisticalSkills > 5
    || selectedFilter == "UX Evaluation" && user.UserExperienceEvaluationSkills > 5
    || selectedFilter == "Statistics" && user.VisualizationSkills > 5
    ){
    color = "yellow"
  }



	var svgContainer = d3.select(location).append("svg")
		    .attr("width", "100%")
        .attr("height", 60)
        .attr("fill", color);
    svgContainer.append("rect")
        .attr("x", 1)
        .attr("y", 1)
        .attr("width", "100%")
      	.attr("height", 60);
    svgContainer.append("title")
        .text(user.Name + "\n" +
        "Art: " + user.ArtisticSkills + "\n" +
        "Code Repo: " + user.CodeRepositorySkills + "\n" +
        "Collaboration: " + user.CollaborationSkills + "\n" +
        "Communication: " + user.CommunicationSkills + "\n" +
        "Computers: " + user.ComputerSkills + "\n" +
        "Graphics: " + user.GraphicsSkills + "\n" +
        "HCI Programming: " + user.HCIProgrammingSkills + "\n" +
        "Math: " + user.MathSkills + "\n" +
        "Programming: " + user.ProgrammingSkills + "\n" +
        "Statistics: " + user.StatisticalSkills + "\n" +
        "UX Evaluation: " + user.UserExperienceEvaluationSkills + "\n" +
        "Visualization: " + user.VisualizationSkills + "\n" + "\n" +
        "Interests: " + user.Interests + "\n");
    svgContainer.append("text")
		    .attr("x", 10)
        .attr("y", 20)
        .text(user.Name)
        .attr("fill", "black");
    svgContainer.on("mouseover", function(){
      console.log("T")
    });
    svgContainer.on("click", function() { 
    	let counter = 0;
      let inClicked = false;
      svgContainer.attr("fill", "red");

      for(i = 0; i < clickedUsers.length; i++){
        if(clickedUsers[i].Name == currentName){
          clickedUsers.splice(i, 1)
          inClicked = true;
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

    if(num == "0"){
      for(i = 0; i < clickedUsers.length; i++){
        dataArray.push(clickedUsers[i])
      }
    }
    else{
      for(i = 0; i < clickedUsers.length; i++){
        groupArray[num-1].push(clickedUsers[i])
      }
    }

    
    updateGroups();
    updateUserList();
    clickedUsers = [];
    createBarChart();
  }
}

function createBarChart(){



  for(j = 0; j < groupArray.length; j++){
    var myNode = document.getElementById("group" + (j+1) + "Graph");
    myNode.innerHTML = '';

    //var testArray = groupArray[0];
    var returnedArray = calculateBarValues(groupArray[j]);
    var returnedInterests = calculateInterests(groupArray[j]);

    // set the dimensions and margins of the graph
    var margin = {top: 25, right: 20, bottom: 30, left: 30},
        width = 820,
        height = 300,
        widthInterests = 820,
        heightInterests = 250;

    // set the ranges
    var x = d3.scaleBand()
              .range([0, width])
              .padding(0.05);
    var y = d3.scaleLinear()
              .range([height, 0]);

    var xInterests = d3.scaleBand()
              .range([0, widthInterests])
              .padding(0.05);
    var yInterests = d3.scaleLinear()
              //.range([0,400])
              .range([heightInterests, 0]);
              
    // append the svg object to the body of the page
    // append a 'group' element to 'svg'
    // moves the 'group' element to the top left margin
    var svg = d3.select("#group" + (j+1) + "Graph" ).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");

    var svgInterests = d3.select("#group" + (j+1) + "Graph" ).append("svg")
        .attr("width", widthInterests + margin.left + margin.right)
        .attr("height", heightInterests + margin.top + margin.bottom)
      .append("g")
        .attr("transform", 
              "translate(" + margin.left + "," + margin.top + ")");


    // Scale the range of the data in the domains
    //x.domain(testArray.map(function(d) { return d.salesperson; }));
    //y.domain([0, d3.max(testArray, function(d) { return d.sales; })]);
    y.domain([0, 50])

    x.domain(returnedArray.map(function(d) { return d.skillName; }));

    yInterests.domain([0, 5])

    xInterests.domain(returnedInterests.map(function(d) { return d.interestName; }));





    // append the rectangles for the bar chart
    //console.log(testArray[0].Name)
    svg.selectAll(".bar")
        .data(returnedArray)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.skillName); })
        .attr("width", x.bandwidth() )
        .attr("y", function(d) { return y(d.value); })
        .attr("height", function(d) { return height - y(d.value); });



    svgInterests.selectAll(".bar")
        .data(returnedInterests)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return xInterests(d.interestName); })
        .attr("width", xInterests.bandwidth() )
        .attr("y", function(d) { return yInterests(d.value); })
        .attr("height", function(d) { return heightInterests - yInterests(d.value); });

    svg.append("text")
      .attr("x", (15))   
      .text("Group " + (j + 1) + " Skills")

    svgInterests.append("text")
      .attr("x", (15))   
      .text("Group " + (j + 1) + " Interests")

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

    svgInterests.append("g")
        .attr("transform", "translate(0," + heightInterests + ")")
        .call(d3.axisBottom(xInterests));

    svgInterests.append("g")
        .call(d3.axisLeft(yInterests));
  }
}

function calculateBarValues(inArray){
  var returnArray = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  var calcArray = []
  for(i = 0; i < inArray.length; i++){
    returnArray[0] = returnArray[0] + inArray[i].ArtisticSkills;
    returnArray[1] = returnArray[1] + inArray[i].CodeRepositorySkills;
    returnArray[2] = returnArray[2] + inArray[i].CollaborationSkills;
    returnArray[3] = returnArray[3] + inArray[i].CommunicationSkills;
    returnArray[4] = returnArray[4] + inArray[i].ComputerSkills;
    returnArray[5] = returnArray[5] + inArray[i].GraphicsSkills;
    returnArray[6] = returnArray[6] + inArray[i].HCIProgrammingSkills;
    returnArray[7] = returnArray[7] + inArray[i].MathSkills;
    returnArray[8] = returnArray[8] + inArray[i].ProgrammingSkills;
    returnArray[9] = returnArray[9] + inArray[i].StatisticalSkills;
    returnArray[10] = returnArray[10] + inArray[i].UserExperienceEvaluationSkills;
    returnArray[11] = returnArray[11] + inArray[i].VisualizationSkills;
  }

  //for(i = 0; i < returnArray.length; i++){
    calcArray[0] = {skillName: "Artistic", value: returnArray[0]}
    calcArray[1] = {skillName: "Code Repo", value: returnArray[1]}
    calcArray[2] = {skillName: "Collaboration", value: returnArray[2]}
    calcArray[3] = {skillName: "Communication", value: returnArray[3]}
    calcArray[4] = {skillName: "Computer", value: returnArray[4]}
    calcArray[5] = {skillName: "Graphics", value: returnArray[5]}
    calcArray[6] = {skillName: "HCI Programming", value: returnArray[6]}
    calcArray[7] = {skillName: "Math", value: returnArray[7]}
    calcArray[8] = {skillName: "Programming", value: returnArray[8]}
    calcArray[9] = {skillName: "Statistics", value: returnArray[9]}
    calcArray[10] = {skillName: "UX Evaluation", value: returnArray[10]}
    calcArray[11] = {skillName: "Visualization", value: returnArray[11]}
  //}


  return calcArray;
}



function calculateInterests(inArray){

  var interestsArray = [];
  var interestsCounter = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]


  //gym, working out
  //sport, football, soccer, swim, hockey
  //music
  //game
  //photoshop, design, art, ux
  //photo, picture
  //film, movie, netflix
  //development, programming, dev
  //media, youtube, news
  //food, baking, bake
  //computer, software

  for(i = 0; i < inArray.length; i++){
    var lower = inArray[i].Interests.toLowerCase();
    var substring = "visualization"
    if(lower.includes("gym") || lower.includes("working out")){
      interestsCounter[0]++;
    }
    if(lower.includes("sport") || lower.includes("football") || lower.includes("soccer") || lower.includes("swim") || lower.includes("hockey")){
      interestsCounter[1]++;
    }
    if(lower.includes("music")){
      interestsCounter[2]++;
    }
    if(lower.includes("game")){
      interestsCounter[3]++;
    }
    if(lower.includes("photoshop") || lower.includes("design") || lower.includes("art") || lower.includes("ux")){
      interestsCounter[4]++;
    }
    if(lower.includes("photo") || lower.includes("picture")){
      interestsCounter[5]++;
    }
    if(lower.includes("film") || lower.includes("movie") || lower.includes("netflix")){
      interestsCounter[6]++;
    }
    if(lower.includes("development") || lower.includes("programming") || lower.includes("dev")){
      interestsCounter[7]++;
    }
    if(lower.includes("media") || lower.includes("youtube") || lower.includes("news")){
      interestsCounter[8]++;
    }
    if(lower.includes("food") || lower.includes("baking") || lower.includes("bake") || lower.includes("cooking")){
      interestsCounter[9]++;
    }
    if(lower.includes("computer") || lower.includes("software")){
      interestsCounter[10]++;
    }
  }
  

  interestsArray[0] = {interestName: "Gym", value: interestsCounter[0]}
  interestsArray[1] = {interestName: "Sports", value: interestsCounter[1]}
  interestsArray[2] = {interestName: "Music", value: interestsCounter[2]}
  interestsArray[3] = {interestName: "Games", value: interestsCounter[3]}
  interestsArray[4] = {interestName: "Design", value: interestsCounter[4]}
  interestsArray[5] = {interestName: "Photography", value: interestsCounter[5]}
  interestsArray[6] = {interestName: "Movies", value: interestsCounter[6]}
  interestsArray[7] = {interestName: "Development", value: interestsCounter[7]}
  interestsArray[8] = {interestName: "Media", value: interestsCounter[8]}
  interestsArray[9] = {interestName: "Food", value: interestsCounter[9]}
  interestsArray[10] = {interestName: "Computers", value: interestsCounter[10]}
  //console.log(interestsArray)
  return interestsArray

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
  document.getElementById("toUserList").onclick = function() {groupClick("0")};
  document.getElementById("applyFilter").onclick = function() {applySelectedFilter()};
}








/*
  // get the data
  d3.csv("sales.csv", function(error, data) {
    if (error) throw error;

    // format the data
    data.forEach(function(d) {
      d.sales = +d.sales;
    });

    // Scale the range of the data in the domains
    x.domain(data.map(function(d) { return d.salesperson; }));
    y.domain([0, d3.max(data, function(d) { return d.sales; })]);

    // append the rectangles for the bar chart
    svg.selectAll(".bar")
        .data(data)
      .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return x(d.salesperson); })
        .attr("width", x.bandwidth())
        .attr("y", function(d) { return y(d.sales); })
        .attr("height", function(d) { return height - y(d.sales); });

    // add the x Axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // add the y Axis
    svg.append("g")
        .call(d3.axisLeft(y));

  });*/



  /*
  console.log("asdf")
  var svgWidth = 500;
  var svgHeight = 300;
  var svg = d3.select('#graphContainer').append('svg')
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr("class", "bar-chart");


  var dataset = returnedArray;
  var barPadding = 5;
  var barWidth = (svgWidth / dataset.length);
  var barChart = svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("y", function(d) {
        return svgHeight - d
    })
    .attr("height", function(d) {
        return d;
    })
    .attr("width", barWidth - barPadding)
    .attr("transform", function (d, i) {
         var translate = [barWidth * i, 0];
         return "translate("+ translate +")";
    });
    */
