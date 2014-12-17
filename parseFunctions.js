Parse.initialize("PXtItYU56vgW8jbKgDhZQac0WMWvlE5uzhS6DtBB", "pI5dlkQ7teOaWlFyvc7i3RbW60ST0NkalJYPLtWr");
//Global Variable that keeps track of current user's highscore
highScore = 0;
var cafmugs;
var enemies;
FastClick.attach(document.body);
document.ontouchmove = function(event){
event.preventDefault();
}
if(checkUserLogin()){prepareGameStage();}

function createUser(username,password,email)
{
	var user = new Parse.User();
	user.set("username", username);
	user.set("password", password);
	user.set("email", email);
	user.signUp(null, {
	  success: function(user) {
		// Hooray! Let them use the app now.
		  alert("Account created. Please Verify Your Email to login.");
		  //window.location.href = "game.html"
		  checkEmailVerified(Parse.User.current().id);
	  },
	  error: function(user, error) {
		// Show the error message somewhere and let the user try again.
		var warning = document.getElementById("warning");
		warning.innerHTML = "Error: " + error.code + " " + error.message;
		warning.style.visibility = "visible";
	  }
	});
}

function checkUserLogin()
{
	if(Parse.User.current() != undefined)
	{
		return true;
	}
	else return false;
}      

//This makes it so that we can login by pressing enter instead of clicking submit
$('#passwd').keypress(function(e){
  if(e.keyCode==13)
  {
      $('#submit1').click();
  }});
//Registering Event Listeners For SignUp Toggle
$("#goSignUp").click(function(){ toggleView();});
$("#goLogIn").click(function(){toggleView();});
$("#goSignUp").on("touchstart",function(){ toggleView();});
$("#goLogIn").on("touchstart",function(){toggleView();});
$(".logoutNow").on("touchstart",function(){Parse.User.logOut(); location.reload();});
$(".logoutNow").click(function(){Parse.User.logOut();  location.reload();});
$("#inGameButton5").on("touchstart",function(){
 var confirmMe = confirm('Are you sure you want to logout?');
    if (confirmMe) {
      // log the user out
      Parse.User.logOut(); 
      location.reload();
    } else {
      //return to the game
    }
});
$("#inGameButton5").click(function(){	
    var confirmMe = confirm('Are you sure you want to logout?');
    if (confirmMe) {
      // log the user out
      Parse.User.logOut(); 
      location.reload();
    } else {
      //return to the game
    }
  });


function checkEmailVerified(userId){
var User = Parse.Object.extend("User");
var query = new Parse.Query(User);
query.get(userId, {
  success: function(User) {
	var isVerified = User._serverData.emailVerified;
	if(isVerified){ prepareGameStage();}
	else { 
		var warning = document.getElementById("warning");
		warning.innerHTML = "Error: " + "Email Not Verfied, please check your email and verify.";
 		warning.style.visibility = "visible";
	}
  },
  error: function(object, error) {
	var warning = document.getElementById("warning");
	warning.innerHTML = "Error: " + error.code + " " + error.message;
	warning.style.visibility = "visible";
  }
});
}
		
       $("#submit1").click(function()
      {
          var username = $("#username").val();
          var password = $("#passwd").val();
          
        if (count % 2 == 0) {
    		Parse.User.logIn(username, password, {
			  success: function(user) {
				// Do stuff after successful login.
				  //window.location.href = "game.html"
				  checkEmailVerified(Parse.User.current().id);
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
    
    function titleCase(string)
    {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
       
	function prepareGameStage()
	{
	  loadHighScore();
	  $("#wrapper2").hide();
	  $("#mainTitle").hide();
	  $("#gameContainer").show();
        $(".playerUsername").html(titleCase(Parse.User.current().getUsername()));
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
          var email = document.getElementById("email");
          email.style.visibility = "visible";
          email.style.display = "inline-block";

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
          var email = document.getElementById("email");
          email.style.visibility = "hidden";
          email.style.display = "none";    
          
          var loginTitle = document.getElementById("loginTitle");
		  var registerTitle = document.getElementById("registerTitle");
          registerTitle.style.display = "none";
          loginTitle.style.display = "block";
                
          var registerLink = document.getElementById("goSignUp");
          var signInLink = document.getElementById("goLogIn");
          registerLink.style.display = "inline-block";
          signInLink.style.display = "none";
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
    console.log("Error: " + error.code + " " + error.message);
  }
});          
    }
    
    
function saveItems(mugCounter, enemiesHit) {
     
     loadItemsScore();

     if(mugCounter <= cafmugs && enemiesHit <= enemies) {
         return;
     }
     
     var ItemScore = Parse.Object.extend("ItemScore");
     var query = new Parse.Query(ItemScore);
     
     query.equalTo("UserId", {
    __type: "Pointer",
    className: "_User",
    objectId: Parse.User.current().id
    });
 
    query.find({
    success: function(results) {
    // Do something with the returned Parse.Object values
    var object;
    if(results.length > 0){
    	for (var i = 0; i < results.length; i++) { 
      		object = results[i];
    	}
    	if(mugCounter > cafmugs) {
    		object.set("cafmug", mugCounter);
    	}
    	if(enemiesHit > enemies) {
    		object.set("enemies", enemiesHit);   
    	} 
    	object.save(); 
    }
    else{
   	 	var itemScore = new ItemScore();
    	itemScore.set("cafmug", mugCounter);
    	itemScore.set("enemies", enemiesHit);
    	itemScore.set("UserId", Parse.User.current())
    
		itemScore.save(null, {
		  success: function(returnVar) {
		  },
		  error: function(returnVar, error) {
		  }
		});
    }
  },
  error: function(error) {
    console.log("Error: " + error.code + " " + error.message);
  }
});          
    }    
    
    

function loadUserScores() {
		var GameScore = Parse.Object.extend("HighScore");
		var query = new Parse.Query(GameScore);
		query.addDescending("score");
        query.include("UserId");
        function scoreObject(object)
        {
          this.userId = object.get('UserId').id;
          this.score = object.get('score');
          this.username = object.get('UserId')._serverData.username;
        }
        query.find().then(function(results)
        { 
          finalScores = [];
          for(var i=0;i<results.length;i++){
          	finalScores.push(new scoreObject(results[i]));
          }
		})
        .then(function(){
        	displayUserScores(finalScores);
        })
        ,
        function(error)
        {
			console.log("Error: " + error.code + " " + error.message);
		}
	}


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
    console.log("Error: " + error.code + " " + error.message);
  }
});  
    }
    
    
    function loadItemsScore()
    {
     var ItemScore = Parse.Object.extend("ItemScore");
     var query = new Parse.Query(ItemScore);
     
     query.equalTo("UserId", {
    __type: "Pointer",
    className: "_User",
    objectId: Parse.User.current().id
    });
 
    query.find({
    success: function(results) {
		// Do something with the returned Parse.Object values
		for (var i = 0; i < results.length; i++) { 
		  var object = results[i];
		  cafmugs = object.get('cafmug');
		  enemies = object.get('enemies');
		}
  },
  error: function(error) {
    console.log("Error: " + error.code + " " + error.message);
  }
});  
    }
    