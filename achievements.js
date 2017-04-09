function Achievement(title, description) {
    this.title = title;
    this.description = description;
}

function getAchievement(index) {
    if (index >= 0 && index <= 12) {
        return achievements[index];
    } else {
        var mult = index - 12;
        var ans = (mult * 1000) + 3000; //Cause that is where we started
        var message = ans + "seconds";
        return new Achievement("distance" + ans, message);
    }
}

var achievements = [
    new Achievement("distance500", "500 seconds"), //0
    new Achievement("distance1000", "1000 seconds"), //1
    new Achievement("distance2000", "2000 seconds"), //2
    new Achievement("distance3000", "3000 seconds"), //3
    new Achievement("squirrel25", "Hit 25 Squirrels"), //4
    new Achievement("squirrel100", "Hit 100 Squirrels"), //5
    new Achievement("squirrel150", "Hit 150 Squirrels"), //6
    new Achievement("squirrel250", "Hit 250 Squirrels"), //7
    new Achievement("mug25", "Collected 25 Mugs"), //8
    new Achievement("mug100", "Collected 100 Mugs"), //9
    new Achievement("mug150", "Collected 150 Mugs"), //10
    new Achievement("mug250", "Collected 250 Mugs"), //11
    new Achievement("distracted", "Spent over 30 Seconds on menu screen") //12
];
/*
achievments[idFromParse].title;
achievments[idFromParse].description;
*/
var achievementTracker = {
    distance: 0,
    squirrel: 0,
    mug: 0,
    distracted: 0
}

function grantAchievement(achievementId) {
    checkRaceCondition = false;
    var userId = firebase.auth().currentUser.uid;

    firebase.database().ref('/achievements/' + userId + '/' + achievementId).once("value", function(snap) {
        if(snap.exists()){
          console.log('Achievement already exists');
        } else{
          firebase.database().ref('/achievements/' + userId + '/' + achievementId).set(true);
          bigbox.log("<b>Achievement</b>" +
              "<br/>" + getAchievement(achievementId).description);
        }
    });
}

function assignAchievement() {
    if (!achievementTracker.distance % 1000 == 0) {
        return;
    } else {
        var index = (achievementTracker.distance - 3000) / 1000 + 12;
        grantAchievement(index);
    }
}

function checkAchievements() {

    switch (achievementTracker.distance) {
        case 500:
            grantAchievement(0);
            break;
        case 1000:
            grantAchievement(1);
            break;
        case 2000:
            grantAchievement(2);
            break;
        case 3000:
            grantAchievement(3);
            break;
        default:
            assignAchievement();
    }
}

function createTable(myArr) {
    var result = "";
    for (var i = myArr.length - 1; i > 0; i--) {
        //console.log(achievements);
        result += "<tr><td align=\"center\">" + getAchievement(myArr[i]).description + "</td></tr>";
    }
    return result;
}
