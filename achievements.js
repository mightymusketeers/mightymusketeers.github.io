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
  new Achievement("distracted","Spent over 30 Seconds on menu screen"),//12
  new Achievement("distance4000","4000 seconds"),//13
  new Achievement("distance5000","5000 seconds"),//14
  new Achievement("distance6000","6000 seconds"),//15
  new Achievement("distance7000","7000 seconds"),//16
  new Achievement("distance8000","8000 seconds")//17
  new Achievement("distance9000","9000 seconds")//18
  new Achievement("distance10000","10000 seconds")//19
  new Achievement("distance11000","11000 seconds")//20
  new Achievement("distance12000","12000 seconds")//21
  new Achievement("distance13000","13000 seconds")//22
  new Achievement("distance14000","14000 seconds")//23
  new Achievement("distance15000","15000 seconds")//24
  new Achievement("distance16000","16000 seconds")//25
  new Achievement("distance1700","17000 seconds")//26
  new Achievement("distance1800","18000 seconds")//27
  new Achievement("distance19000","19000 seconds")//28
  new Achievement("distance20000","20000 seconds")//29

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
          humane.log("<b>Achievement</b>" + "<br/>" + achievements[id].description, { timeout: 1000, clickToClose: true })
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
      case 4000:
        grantAchievement(13);
        break;
      case 5000:
        grantAchievement(14);
        break;
      case 6000:
        grantAchievement(15);
        break;
      case 7000:
        grantAchievement(16);
        break;
      case 8000:
        grantAchievement(17);
        break;
      case 9000:
        grantAchievement(18);
        break;
      case 10000:
        grantAchievement(19);
        break;
      case 11000:
        grantAchievement(20);
        break;
      case 12000:
        grantAchievement(21);
        break;
      case 13000:
        grantAchievement(22);
        break;
      case 14000:
        grantAchievement(23);
        break;
      case 15000:
        grantAchievement(24);
        break;
      case 16000:
        grantAchievement(25);
        break;
      case 17000:
        grantAchievement(26);
        break;
      case 18000:
        grantAchievement(27);
        break;
      case 19000:
        grantAchievement(28);
        break;
      case 20000:
        grantAchievement(29);
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
