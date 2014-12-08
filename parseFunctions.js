    
    Parse.initialize("PXtItYU56vgW8jbKgDhZQac0WMWvlE5uzhS6DtBB", "pI5dlkQ7teOaWlFyvc7i3RbW60ST0NkalJYPLtWr");

$(function() {
    FastClick.attach(document.body);
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
          
          var registerLink = document.getElementById("signUpText");
          var signInLink = document.getElementById("loginText");
          registerLink.style.display = "none";
          signInLink.style.display = "inline-block";
          
          var warning = document.getElementById("warning");
          warning.style.visibility = "hidden";
      }
    function loginView()
      {
          var email = document.getElementById("emailDiv");
          email.style.visibility = "hidden";
          
          var loginTitle = document.getElementById("loginTitle");
		  var registerTitle = document.getElementById("registerTitle");
          registerTitle.style.display = "none";
          loginTitle.style.display = "block";
          
          var registerLink = document.getElementById("signUpText");
          var signInLink = document.getElementById("loginText");
          registerLink.style.display = "inline-block";
          signInLink.style.display = "none";
      }
      
