console.log("dashboard.js loaded");
 

$('.patient-button').on('click', function(event) {

	event.preventDefault();

 	var currentURL = window.location.origin;

    var clientData = {
        current_doctor: $(".docid:selected").text(),
        diagnosis: $("#diagnosis").val().trim(),
        id: $(".docid:selected").val().trim()
    }

    console.log(clientData);

 	var docID = $('.docid:selected').val().trim();

 	console.log(docID);

    $.post(currentURL + '/dashboard/update-patient/', {"current_doctor": clientData.current_doctor, "diagnosis": clientData.diagnosis}, function(data) {
        console.log("the post was successful");
    });


 	$.post(currentURL + '/dashboard/matches', {'id': clientData.id}, function(data) {
        //empties out the doc results on each post
        $(".doc-results").empty();
        $(".doc-results").append("<h2>" + data.text + "</h2><br><br>");
        
 		// console.log('this is the data: ' + data);

 		// var matchImg = $('<div></div>');
 		// matchImg.addClass('col-md-3').addClass('match-image');
 		// matchImg.append('<img src="/assets/catscan.jpg">');

 		// var matchTxt = $('<div></div>');
 		// matchTxt.addClass('col-md-9');
 		// matchTxt.append('<h3>' + 'CHECK OUT THIS DOCTOR' + '</h3>');
 		// matchTxt.append(data);

        

 		var imgBox = $('<div></div>');
 		imgBox.addClass('row').addClass('match-image');

 		var matchImg = $('<div></div>');
 		matchImg.addClass('col-md-3').addClass('match-image');
 		matchImg.append('<img src="'+ data.image +'">');

 		var matchStats = $('<div></div>');
 		matchStats.addClass('col-md-9').addClass('match-image');
 		matchStats.append('<h3>' + data.first_name +' '+ data.last_name + ', '+ data.title + '</h3>');
 		matchStats.append('<p><h4>' + data.specialty + '</h4></p>');
 		matchStats.append('<p> <b>Languages:</b> ' + data.language + "</p><p>" + ' <b>Gender:</b> ' + data.gender + '</p>');

 		imgBox.append(matchImg).append(matchStats);

 		var matchTxt = $('<div></div>');
 		matchTxt.addClass('row').addClass('match-text');
 		matchTxt.append('<p>'+ data.bio + '</p>');

 		var contactTxt = $('<div></div>');
 		contactTxt.addClass('row').addClass('match-text');
 		contactTxt.append('<p> <b>Practice Address: </b>' + data.street + '</p>');
 		contactTxt.append('<p> <b>City, State Zip: </b>' + data.city + ", " + data.state + "  " + data.zip + '</p>');

 		var phoneNum = $('<div></div>');
 		phoneNum.addClass('row').addClass('match-text').addClass('phone');
 		phoneNum.append('<p> <b>Phone: </b>' + data.phone);

 		$('.doc-results').append(imgBox).append(matchTxt).append(contactTxt).append(phoneNum);   
 	});

});




