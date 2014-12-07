    
    Parse.initialize("PXtItYU56vgW8jbKgDhZQac0WMWvlE5uzhS6DtBB", "pI5dlkQ7teOaWlFyvc7i3RbW60ST0NkalJYPLtWr");
    function createUser(username,password,email)
    {
    var user = new Parse.User();
    user.set("username", username);
    user.set("password", password);
    user.set("email", email);
    user.signUp(null, {
      success: function(user) {
        // Hooray! Let them use the app now.
      },
      error: function(user, error) {
        // Show the error message somewhere and let the user try again.
        alert("Error: " + error.code + " " + error.message);
      }
    });
    }
      
       $("#logInButton").click(function()
      {
          var username = $("#username").val();
          var password = $("#passwd").val();
          //alert(username);
          Parse.User.logIn(username, password, {
          success: function(user) {
            // Do stuff after successful login.
              alert("You Were Succesfully Logged In");
              //window.location.href = "game.html"
              $("#logIn").hide();
              $("#gameContainer").show();
          },
          error: function(user, error) {
            // The login failed. Check error to see why.
            alert("Sorry Invalid Credentials, Try Again");
          }
});
      });
  
    $("#signUpButton").click(function()
       {
          var username = $("#usernameSignUp").val();
          var password = $("#passwordSignUp").val();
          var emailId = $("#emailId").val();
        if(username.length > 0 && password.length > 0 && emailId.length > 0)
        {
            //Call Parse Sign Up Function
            createUser(username,password,emailId);
        }  
       }); 
 
    function signUpView()
      {
          var login = document.getElementById("logIn");
          login.style.display = "none";
          var signUp = document.getElementById("signUp");
          signUp.style.display = "";
      }
    function loginView()
      {
          var login = document.getElementById("logIn");
          login.style.display = "";
          var signUp = document.getElementById("signUp");
          signUp.style.display = "none";
      }
    
      
