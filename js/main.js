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
	trainFrequency: 36,
	trainFirstDeparture: "7:00"
},
{
	trainName: "Marco Express",
	trainDestination: "California",
	trainFrequency: 5,
	trainFirstDeparture: "6:00"
},
{
	trainName: "NY Express",
	trainDestination: "New York",
	trainFrequency: 21,
	trainFirstDeparture: "5:00"
},
{
	trainName: "LA Express",
	trainDestination: "Los Angeles",
	trainFrequency: 20,
	trainFirstDeparture: "6:30"
}
];


// function that pushes array of objects to database
// @NOTICE: This should only run once


function pushArrayDatabase(arr){
	for(var i=0; i<arr.length; i++){
		// push current index object
		database.ref().push(arr[i]);
	}
};


// Call this when you receive data from the db and need to populate your table.
function populateTable(snapshot){

	console.log("Current child received: "+snapshot.val());

	var trainRow = $("<tr>");
	trainRow.append($("<td>").html(snapshot.val().trainName));
	trainRow.append($("<td>").html(snapshot.val().trainDestination));


	trainRow.append($("<td>").html(snapshot.val().trainFrequency));

	var nextTrain = 7;
	trainRow.append($("<td>").html( nextTrain ));

	var minsAway =5;

	trainRow.append($("<td>").html( minsAway ));

	$(".table").append(trainRow);


};


// Query for records from the DB.
database.ref().on("child_added", function(snapshot){

	populateTable(snapshot);

});





database.ref().on("value", function(snapshot) {

	console.log(snapshot.val());




	

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
// turn input 4 into interger for evaluation
input4= parseInt(input4);

if(moment(input3).format() === moment.format('HH:mm') && input4 === typeof "number"){
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

