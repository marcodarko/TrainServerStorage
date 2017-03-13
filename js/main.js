// Initialize Firebase


// copied from Firebase

var config = {
	apiKey: "AIzaSyDKRlZdZS32HPv2ElQXMn81SpNILi0DsQk",
	authDomain: "marcotraindatabase.firebaseapp.com",
	databaseURL: "https://marcotraindatabase.firebaseio.com",
	storageBucket: "marcotraindatabase.appspot.com",
	messagingSenderId: "669676328937"
};


firebase.initializeApp(config);

// Create a variable to reference the database
var database = firebase.database();


// initial train list
var initialTrainList=[
{
	trainName: "Polar Express",
	trainDestination: "NorthPole",
	trainFrequency: "36",
	trainFirstDeparture: "7:00"
},
{
	trainName: "Marco Express",
	trainDestination: "California",
	trainFrequency: "5",
	trainFirstDeparture: "6:00"
},
{
	trainName: "NY Express",
	trainDestination: "New York",
	trainFrequency: "21",
	trainFirstDeparture: "5:00"
},
{
	trainName: "LA Express",
	trainDestination: "Los Angeles",
	trainFrequency: "20",
	trainFirstDeparture: "6:30"
}
];


// @NOTICE: This should only run once

pushArrayDatabase(initialTrainList);


// function that pushes array of objects to database

function pushArrayDatabase(arr){
	for(var i=0; i<arr.length; i++){
		// push current index object
		database.ref().push(arr[i]);
	}
};

//  calculates mins away by taking in current time minus next arrival
function minsAway(nextArrival){

	var currentTime= moment().unix();
	console.log("MA Current time in secs: "+currentTime);

	console.log("database FD: "+nextArrival.val().trainFirstDeparture);

	var freq = moment(nextArrival.val().trainFrequency, 'mm').unix();
	console.log("Frequency in secs: "+freq);

	var FirstDeparture= moment(nextArrival.val().trainFirstDeparture, 'mm').unix();
	console.log("First departure in secs: "+freq);

	// need to get secs since initial departure
	var secsSinceFirstD= moment(FirstDeparture, 's').diff(currentTime, 's');
	console.log("Secs since First departure: "+secsSinceFirstD);

	var result= secsSinceFirstD % freq;
	console.log("Modulus result in secs: "+result);
	console.log("++++++++++++++++++++++++");

	return result;

};



function nextTrainArrival(SecondsAway){

	var currentTime= moment().unix();
	console.log("NTA Current time in secs: "+currentTime);

	var result= moment(currentTime, 's').add(SecondsAway, 's').format('hh:mm');
	console.log("Next train arrival in secs: "+result);

	return result;
};



// Call this when you receive data from the db and need to populate your table.
function populateTable(snapshot){


	var trainRow = $("<tr>");
	trainRow.append($("<td>").html(snapshot.val().trainName));
	trainRow.append($("<td>").html(snapshot.val().trainDestination));


	trainRow.append($("<td>").html(snapshot.val().trainFrequency+" Mins"));

	var z= minsAway(snapshot);
	var x= nextTrainArrival( z );
	
	trainRow.append($("<td>").html( x ));

	trainRow.append($("<td>").html( (z/60)+" mins" ));

	$(".tableBody").append(trainRow).hide().fadeIn(1000);


};


// Query for records from the DB.
database.ref().on("child_added", function(snapshot){

	populateTable(snapshot);

});





database.ref().on("value", function(snapshot) {

	

	

},function(errorObject) {

	console.log("The read failed: " + errorObject.code);
	$("#bottomBox").html("<h1>Error Loading trains</h1>");

});



// if the submit button is clicked do this

$("#submitButton").on("click", function(event){

	// preventing default page reload
	event.preventDefault();

// inputs get stored for evaluation
var input1= $("#nameInput").val();
var input2= $("#destinationInput").val();
var input3= $("#frequencyInput").val();
var input4= $("#firstTrainInput").val();


if(moment(input3, "HH:mm").format() === moment.format('HH:mm') ){
		// empty train object gets populated by input
		var newTrain={
			trainName: $("#nameInput").val(),
			trainDestination: $("#destinationInput").val(),
			trainFrequency: $("#frequencyInput").val(),
			trainFirstDeparture: $("#firstTrainInput").val()
		}
		// object containing all new data pushed to database
		database.push(newTrain);


		// input fields cleared
		var input1= $("#nameInput").val(" ");
		var input2= $("#destinationInput").val(" ");
		var input3= $("#frequencyInput").val(" ");
		var input4= $("#firstTrainInput").val(" ");
	}

	// if input was not valid do this

	else{
	// invalid imput message
	prompt("You must enter a valid HH:mm format and frequency");
	return false;

}

});

