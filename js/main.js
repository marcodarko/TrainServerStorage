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


// ++++++++++++++++++ 

var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = 0;


// FUNCTIONS + EVENTS
$("#submitButton").on("click", function() {

// when clicked we take the values from each input field
// and trim any white space before or after
  trainName = $('#nameInput').val().trim();
  destination = $('#destinationInput').val().trim();
  firstTrainTime = $('#firstTrainInput').val().trim();
  frequency = $('#frequencyInput').val().trim();

console.log("Your Train's info: ");
  console.log(trainName);
  console.log(destination);
  console.log(firstTrainTime);
  console.log(frequency);

  // take all the values from user and push them as an object to the DB

  database.ref().push({
    trainName: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency
  });
// clear input fields
    return false;
});


//every time an object is added...
database.ref().on("child_added", function(snapshot) {
	// database.ref is the ROOT folder
  console.log(snapshot.val());

  // save input in a variable 
  // .val interprets the data fro DB in object form 

  trainName = snapshot.val().trainName;
  destination = snapshot.val().destination;
  firstTrainTime = snapshot.val().firstTrainTime;
  frequency = snapshot.val().frequency;

// gets the current time in hour minute format
  var firstTrainMoment = moment(firstTrainTime, 'hh:mm');
  // time stamp of the momemnt right now
  var nowMoment = moment(); 
// returns difference between now and first train in minutes
  var minutesSinceFirstArrival = nowMoment.diff(firstTrainMoment, 'minutes');
  // gives the remainder of the division
  var minutesSinceLastArrival = minutesSinceFirstArrival % frequency;
  // minutes away
  var minutesAway = frequency - minutesSinceLastArrival;
// nest arrival will be the current time plus minutes away
  var nextArrival = nowMoment.add(minutesAway, 'minutes');
  // formattin the time to a readable format
  var formatNextArrival = nextArrival.format("hh:mm");


  // add table
  var myRow = $('<tr>');
  var tName = $('<td>').html(trainName);
  var tDestination = $('<td>').html(destination);
  var tFrequency = $('<td>').html(frequency);
  var tNextArrival = $('<td>').html(formatNextArrival);
  var tMinutesAway = $('<td>').html(minutesAway);

// appending everythign into a row
  myRow.append(tName).append(tDestination).append(tFrequency).append(tNextArrival).append(tMinutesAway);
// adding a row to my table body
  $('.tableBody').append(myRow).hide().fadeIn(1000);


  }, function (errorObject) {
// if everything fails
    console.log("The read failed: " + errorObject.code);

});

