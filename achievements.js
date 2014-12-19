function Achievement(title,description)
{
  this.title = title;
  this.description = description;
}
var achievements = [
  new Achievement("distance500","500 seconds"),//0
  new Achievement("distance1000","1000 seconds"),//1
  new Achievement("distance2000","2000 seconds"),//2
  new Achievement("distance3000","3000 seconds"),//3
  new Achievement("squirrel25","Hit 25 Squirrels"),//4
  new Achievement("squirrel100","Hit 100 Squirrels"),//5
  new Achievement("squirrel150","Hit 150 Squirrels"),//6
  new Achievement("squirrel250","Hit 250 Squirrels"),//7
  new Achievement("mug25","Collected 25 Mugs"),//8
  new Achievement("mug100","Collected 100 Mugs"),//9
  new Achievement("mug150","Collected 150 Mugs"),//10
  new Achievement("mug250","Collected 250 Mugs"),//11
  new Achievement("distracted","Spent over 30 Seconds on menu screen")//12
];
/*
achievments[idFromParse].title;
achievments[idFromParse].description;
*/
var achievementTracker =
{
  distance:0,
  squirrel:0,
  mug:0,
  distracted:0
}

function grantAchievement(id)
{     
   checkRaceCondition =false;
     var Achievement = Parse.Object.extend("Achievement");
     var query = new Parse.Query(Achievement);

    query.equalTo("UserId", {
    __type: "Pointer",
    className: "_User",
    objectId: Parse.User.current().id
    });
  
    query.equalTo("achievementId",id);
 
    query.find({
    success: function(results) {
    checkRaceCondition = true;
    if(results.length > 0)
    {
    }
    else{
    var newAchievement = new Achievement();
    newAchievement.set("achievementId", id);
    newAchievement.set("UserId", Parse.User.current());
    newAchievement.save(null, {
      success: function(result) {
          console.log("made it to the grantAchievo success");
          humane.log("<b>Achievement</b>" + "<br/>" + achievements[id].description, { timeout: 5000, clickToClose: true })
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


function checkAchievements()
{

  switch(achievementTracker.distance)
  {
      case 500:
        grantAchievement(0);
        console.log("500 distance");
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
  }
}

function createTable(myArr)
{
  var result = "";
  for(var i=myArr.length-1;i > 0;i--)
  {
    //console.log(achievements);
    result+="<tr><td align=\"center\">"+achievements[myArr[i]].description+"</td></tr>";
  }
  return result;
}
