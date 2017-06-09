// Whenever someone clicks a p tag
$(document).on("click", "p", function() {
  // Empty the notes from the note section
  $("#notes").empty();
  $("#past_notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append(
        "<input id='titleinput' name='title' placeholder='Author'>"
      );
      // A textarea to add a new note body
      $("#notes").append(
        "<textarea id='bodyinput' placeholder='comment' name='body'></textarea>"
      );
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append(
        "<button data-id='" + data._id + "' id='savenote'>Save Note</button><br>"
      );

      // If there's a note in the article
      if (data.note) {
        for (i = 0; i < data.note.length; i++) {
          $("#past_notes").append(
            "<br><p>Author: " +
              data.note[i].title +
              "</p><p>Comment: " +
              data.note[i].body +
              "</p>" + "<button data-id='"+ data.note[i]._id +"' class='btn-danger remove-comment' type='submit'>Remove comment?</button>"
          );
        }
      }
    });
});

$(document).on("click", ".remove-comment", function() {
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "POST",
    url: "/remove/" + thisId
  })
    // With that done, add the note information to the page
    .done(function(data) {
      console.log("Bye bye bye bye BYE.")
    });
})

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .done(function(data) {
      // Empty the notes section
      $("#notes").empty();
      $("#past_notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
