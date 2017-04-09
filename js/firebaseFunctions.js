//Global Variable that keeps track of current user's highscore
window.highScore = 0;
window.cafmugs = 0;
window.mugCounter = 0;
window.squirrels = 0;
window.myAchievements = [];
window.signupName = "";
window.loadedUser = {};

$(document).ready(function() {
    FastClick.attach(document.body);
    document.ontouchmove = function(event) {
        //event.preventDefault();
    }

    var hasLocalStorageUser = false;
    for (var key in localStorage) {
      if (key.startsWith("firebase:authUser:")) {
          hasLocalStorageUser = true;
          window.loadedUser = JSON.parse(localStorage.getItem(key));
      }
    }

    if (hasLocalStorageUser) {
      prepareGameStage();
    }

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            window.loadedUser = user;
            $(".playerUsername").html(user.displayName ? user.displayName : window.signupName);
        }
    });

});

function customAlert(message) {
    bigbox.log("<b>Alert</b>" +
        "<br/>" + message);
}

function addUserToDB(userId, fullname) {
    firebase.database().ref('/users/' + userId + '/').once("value", function(snap) {
        if (snap.exists()) {
            console.log('user already exists');
        } else {
            firebase.database().ref('/users/' + userId + '/').set({highScore: 0, cafmugs: 0, squirrels: 0, fullname:fullname});
        }
    });
}

function createUser(name, email, password) {
    window.signupName = name;
    firebase.auth().createUserWithEmailAndPassword(email, password).then(function(user) {
        customAlert("Account created. Please Verify Your Email to login.");
        addUserToDB(user.uid, name);
        user.updateProfile({
          displayName: name
        }).then(function(result){
        }).catch(function(error){
          console.log("There was an error updating profile:" , error);
        });

        user.sendEmailVerification().then(function(response2){
           bigbox.log("A Verification email has been sent to you at " + email);
        }).catch(function(error){
           console.log("There was an error:" , error);
        });
        checkEmailVerified(user.uid);
    }).catch(function(error) {
        var warning = document.getElementById("warning");
        warning.innerHTML = "Error: " + error.code + " " + error.message;
        warning.style.visibility = "visible";
    });
}

function checkUserLogin() {
    var user = firebase.auth().currentUser;
    if (user) {
        return true;
    } else {
        return false;
    }
}

function logOutUser() {
    firebase.auth().signOut();
    location.reload();
}

//This makes it so that we can login by pressing enter instead of clicking submit
$('#passwd').keypress(function(e) {
    if (e.keyCode == 13) {
        $('#submit1').click();
    }
});
//Registering Event Listeners For SignUp Toggle
$("#goSignUp").click(function() {
    toggleView();
});
$("#goLogIn").click(function() {
    toggleView();
});
$("#goSignUp").on("touchstart", function() {
    toggleView();
});
$("#goLogIn").on("touchstart", function() {
    toggleView();
});
$(".logoutNow").on("touchstart click", function() {
    logOutUser();
});

$("#inGameButton5").on("touchstart click", function() {
    var confirmMe = confirm('Are you sure you want to logout?');
    if (confirmMe) {
        logOutUser();
        location.reload();
    } else {
        //return to the game
    }
});

function checkEmailVerified(userId) {
    var user = firebase.auth().currentUser;
    if (user.emailVerified) {
        $(".playerUsername").html(user.displayName);
        prepareGameStage();
    } else {
        var warning = document.getElementById("warning");
        warning.innerHTML = "Error: " +
            "Email Not Verfied, please check your email and verify.";
        warning.style.visibility = "visible";
    }
}

$("#submit1").click(function() {
    var name = $("#name").val();
    var emailId = $("#email").val();
    var password = $("#passwd").val();

    if (count % 2 == 0) {
        firebase.auth().signInWithEmailAndPassword(emailId, password).then(function(user) {
            checkEmailVerified(user.uid);
            $(".playerUsername").html(user.displayName);
        }).catch(function(error) {
            // Handle Errors here.
            var warning = document.getElementById("warning");
            warning.innerHTML = "Error: " + error.code + " " + error.message;
            warning.style.visibility = "visible";
            // ...
        });

    } else {

        if (name.length > 0 && password.length > 0 && emailId.length > 0) {
            createUser(name, emailId, password);
        } else {
            var warning = document.getElementById("warning");
            warning.innerHTML = "Error: all fields must be present";
            warning.style.visibility = "visible";
        }
    }
});

$("#fbLogIn").click(function() {
    firebase.auth().signInWithPopup(new firebase.auth.FacebookAuthProvider()).then(function(response) {
        customAlert("User logged in through Facebook!");
        addUserToDB(response.user.uid, response.user.displayName);
        $(".playerUsername").html(response.user.displayName);
        prepareGameStage();
    }).catch(error => {
        var warning = document.getElementById("warning");
        warning.innerHTML = "Error: " + error.code + " " + error.message;
        warning.style.visibility = "visible";
    });
});

function titleCase(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function prepareGameStage() {
    loadHighScoreMugsAndSquirrels(function() {
        $("#loginContainer").hide();
        $("#mainTitle").hide();
        $("#gameContainer").show();
    });
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

function signUpView() {
    var mainTitle = document.getElementById("mainTitle");
    mainTitle.innerHTML = "Register";
    var registerLink = document.getElementById("goSignUp");
    var signInLink = document.getElementById("goLogIn");
    var nameField = document.getElementById("name");
    registerLink.style.display = "none";
    signInLink.style.display = "inline-block";
    nameField.style.display = "block";
}

function loginView() {
    var mainTitle = document.getElementById("mainTitle");
    mainTitle.innerHTML = "Login";
    var registerLink = document.getElementById("goSignUp");
    var signInLink = document.getElementById("goLogIn");
    var nameField = document.getElementById("name");
    registerLink.style.display = "inline-block";
    signInLink.style.display = "none";
    nameField.style.display = "none";
}

function checkLocalAchievement(localMug, localSquirrel) {
    //console.log(localMug, localSquirrel);
    switch (localSquirrel) {
        case 25:
            console.log("25 enemies");
            grantAchievement(4);
            break;
        case 100:
            grantAchievement(5);
            break;
        case 150:
            grantAchievement(6);
            break;
        case 250:
            grantAchievement(7);
            break;
    }

    switch (localMug) {
        case 25:
            console.log("25 enemies");
            grantAchievement(8);
            break;
        case 100:
            grantAchievement(9);
            break;
        case 150:
            grantAchievement(10);
            break;
        case 250:
            grantAchievement(11);
            break;
    }
}

function runTimer() {
    var sTime = new Date().getTime();
    var countDown = 3;
    $("#tapToRetry").hide();
    $("#gameCounter").show();
    function UpdateTime() {
        var cTime = new Date().getTime();
        var diff = cTime - sTime;
        var seconds = countDown - Math.floor(diff / 1000);
        if (seconds == 0) {
            window.clearInterval(counter);
            canRestartGame = true;
            $("#gameCounter").hide();
            $("#tapToRetry").show();
        }
        $("#gameCounter").html("Try again in " + seconds + "...");
    }
    UpdateTime();
    var counter = setInterval(UpdateTime, 1000);
}

function saveScore(userScore) {
    if (userScore <= window.highScore) {
        return;
    }
    var userId = firebase.auth().currentUser.uid;
    firebase.database().ref('/users/' + userId + '/').once("value", function(snap) {
        if (snap.exists()) {
        var updates = {};
        updates['/users/' + userId + '/highScore/'] = userScore;
        firebase.database().ref().update(updates);
        }
    });
}

function saveItems() {
    console.log("Called Save Items");
    checkRaceCondition2 = false;
    var userId = firebase.auth().currentUser.uid;
    var localMugCount = 0;
    var localSquirrelCount = 0;
    localMugCount = cafmugs + achievementTracker.mug;
    localSquirrelCount = squirrels + achievementTracker.squirrel;
    checkLocalAchievement(localMugCount, localSquirrelCount);

    firebase.database().ref('/users/' + userId + '/').once("value", function(snap) {
        if (snap.exists()) {
          var updates = {};
          updates['/users/' + userId + '/cafmugs/'] = localMugCount;
          updates['/users/' + userId + '/squirrels/'] = localSquirrelCount;
          firebase.database().ref().update(updates);
          checkRaceCondition2 = true;
        }
    });
}

function loadUserScores() {

    function scoreObject(usrId, theScore, theName) {
        this.userId = usrId;
        this.score = theScore;
        this.username = theName;
    }

    firebase.database().ref('/users/').once("value", function(snap) {
        finalScores = [];
        if (snap.exists()) {
            snap.forEach(function(child) {
                finalScores.push(new scoreObject(child.key, child.val().highScore, child.val().fullname));
            });
        }
        displayUserScores(finalScores);
    });

}

function loadHighScoreMugsAndSquirrels(callback) {
    firebase.database().ref('/users/' + window.loadedUser.uid + '/').once("value", function(snap) {
        if(snap.exists()){
          window.highScore = snap.val().highScore;
          window.cafmugs = snap.val().cafmugs;
          window.squirrels = snap.val().squirrels;
        }
        callback();
    });
}

function loadAchievements(callback) {
  var userId = firebase.auth().currentUser.uid;
  firebase.database().ref('achievements/' + userId + '/').once("value", function(snap) {
      myAchievements = [];
      if (snap.exists()) {
          snap.forEach(function(child) {
              myAchievements.push(child.key);
          });
      }
      $(".achievementsTable").html(createTable(myAchievements));
      callback();
  });
}
