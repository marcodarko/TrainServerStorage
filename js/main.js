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

	console.log("incoming data to minsAway: "+ nextArrival);

	var nextArrivalInput =moment(nextArrival, 'HH:mm');
	console.log("incoming coverted to secs: "+ nextArrivalInput);

	var next= nextArrivalInput.toNow();

	console.log("next is: "+ next);

	return next;

};

// calculates next arrival by checking that next arrival is not less than current time
// if it is it'll add the train's frequency until it it greater than current time
// when it stops that will be the next train arrival

function nextTrainArrival(snapshot){

	// converting everything to secs for easy comparison

	var firstDeparture = moment(snapshot.val().trainFirstDeparture, 'HH:mm');
	console.log("Trains first departure of the day: "+ firstDeparture);

	// current time stamp
	var rightNow= moment().unix();
	console.log("time right now: "+rightNow);

	// train frequecy
	var freq =moment(snapshot.val().trainFrequency, 'm');
	console.log("train freq: "+freq);

	// while first departurte is less than current time add train's frequency
	while(firstDeparture < rightNow ){
		firstDeparture.add(freq);
	}

	// next arrival that is under current time
	var result= moment(firstDeparture, 'X').format('HH:mm');

	return result;
};



// Call this when you receive data from the db and need to populate your table.
function populateTable(snapshot){


	var trainRow = $("<tr>");
	trainRow.append($("<td>").html(snapshot.val().trainName));
	trainRow.append($("<td>").html(snapshot.val().trainDestination));


	trainRow.append($("<td>").html(snapshot.val().trainFrequency+" Mins"));

	var x= nextTrainArrival(snapshot);
	
	trainRow.append($("<td>").html( x ));

	var z= minsAway(x);

	trainRow.append($("<td>").html( z ));

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

