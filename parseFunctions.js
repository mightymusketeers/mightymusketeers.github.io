    
Parse.initialize("PXtItYU56vgW8jbKgDhZQac0WMWvlE5uzhS6DtBB", "pI5dlkQ7teOaWlFyvc7i3RbW60ST0NkalJYPLtWr");
//Global Variable that keeps track of current user's highscore
highScore = 0;
$(function() {
    FastClick.attach(document.body);
    loadHighScore();
    document.ontouchmove = function(event){
    event.preventDefault();
}
});

    function createUser(username,password,email)
    {
		var user = new Parse.User();
		user.set("username", username);
		user.set("password", password);
		user.set("email", email);
		user.signUp(null, {
		  success: function(user) {
			// Hooray! Let them use the app now.
			  alert("Account created. Logging you in.");
			  //window.location.href = "game.html"
			  $("#wrapper2").hide();
			  $("#mainTitle").hide();
			  $("#gameContainer").show();
		  },
		  error: function(user, error) {
			// Show the error message somewhere and let the user try again.
			var warning = document.getElementById("warning");
			warning.innerHTML = "Error: " + error.code + " " + error.message;
			warning.style.visibility = "visible";
		  }
		});
    }
      
    //This makes it so that we can login by pressing enter instead of clicking submit
        $('#passwd').keypress(function(e){
          if(e.keyCode==13)
          {
              $('#submit1').click();
          }});
       

       $("#submit1").click(function()
      {
          var username = $("#username").val();
          var password = $("#passwd").val();
          
        if (count % 2 == 0) {
    		Parse.User.logIn(username, password, {
			  success: function(user) {
				// Do stuff after successful login.
				  //window.location.href = "game.html"
				  $("#wrapper2").hide();
				  $("#mainTitle").hide();
				  $("#gameContainer").show();
                  $("#playerUsername").html(titlCase(Parse.User.current().getUsername()));
			  },
			  error: function(user, error) {
				// The login failed. Check error to see why.
				var warning = document.getElementById("warning");
				warning.innerHTML = "Error: " + error.code + " " + error.message;
         		warning.style.visibility = "visible";
			  }
		});
    	} else {
    	  var username = $("#username").val();
          var password = $("#passwd").val();
          var emailId  = $("#email").val();
          
			if(username.length > 0 && password.length > 0 && emailId.length > 0)
			{
				//Call Parse Sign Up Function
				createUser(username,password,emailId);
			} else {
				var warning = document.getElementById("warning");
				warning.innerHTML = "Error: all fields must be present";
          		warning.style.visibility = "visible";
			}
    	}
    });
    
    function titlCase(string)
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
       
 	var count = 0;
    function toggleView() {
    	if (count % 2 == 0) {
    		signUpView();
    		count++;
    	} else {
    		loginView();
    		count++;
    	}
    }
 
    function signUpView()
      {
          var email = document.getElementById("emailDiv");
          email.style.visibility = "visible";
          
		  var loginTitle = document.getElementById("loginTitle");
		  var registerTitle = document.getElementById("registerTitle");
          registerTitle.style.display = "block";
          loginTitle.style.display = "none";
          
          var registerLink = document.getElementById("goSignUp");
          var signInLink = document.getElementById("goLogIn");
          registerLink.style.display = "none";
          signInLink.style.display = "inline-block";
          
          var warning = document.getElementById("warning");
          warning.style.visibility = "hidden";
      }
    function loginView()
      {
          var email = document.getElementById("emailDiv");
          email.style.visibility = "hidden";
          
          var registerLink = document.getElementById("goSignUp");
          var signInLink = document.getElementById("goLogIn");
          registerTitle.style.display = "none";
          loginTitle.style.display = "inline-block";
      }

    function saveScore(userScore)
    {
     if(userScore <= highScore) {
         return;
     }
     
     var HighScore = Parse.Object.extend("HighScore");
     var query = new Parse.Query(HighScore);
     
     query.equalTo("UserId", {
    __type: "Pointer",
    className: "_User",
    objectId: Parse.User.current().id
    });
 
    query.find({
    success: function(results) {
    // Do something with the returned Parse.Object values
    var object;
    if(results.length > 0)
    {for (var i = 0; i < results.length; i++) { 
      object = results[i];
    }
    object.set("score",userScore);
    object.save(); 
    }
    else{
    var gameScore = new HighScore();
    gameScore.set("score", userScore);
    gameScore.set("UserId", Parse.User.current())
    
    gameScore.save(null, {
      success: function(gameScore) {
      },
      error: function(gameScore, error) {
      }
    });
    }
  },
  error: function(error) {
    alert("Error: " + error.code + " " + error.message);
  }
});          
    }

/*
var GameScore = Parse.Object.extend("GameScore");
var query = new Parse.Query(GameScore);
query.equalTo("playerName", "Dan Stemkoski");
query.find({
  success: function(results) {
    alert("Successfully retrieved " + results.length + " scores.");
    // Do something with the returned Parse.Object values
    for (var i = 0; i < results.length; i++) { 
      var object = results[i];
      alert(object.id + ' - ' + object.get('playerName'));
    }
  },
  error: function(error) {
    alert("Error: " + error.code + " " + error.message);
  }
});
*/
    function loadHighScore()
    {
     var HighScore = Parse.Object.extend("HighScore");
     var query = new Parse.Query(HighScore);
     
     query.equalTo("UserId", {
    __type: "Pointer",
    className: "_User",
    objectId: Parse.User.current().id
    });
 
    query.find({
    success: function(results) {
    // Do something with the returned Parse.Object values
    highScore = 0;
    for (var i = 0; i < results.length; i++) { 
      var object = results[i];
      highScore = object.get('score');
    }
  },
  error: function(error) {
    alert("Error: " + error.code + " " + error.message);
  }
});  
    }
    