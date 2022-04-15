const urlBase = "http://localhost:8888/";
const extension = ".php";

function signIn(){
    let error = "";

    const login = document.getElementById("Login").value;
    const password = document.getElementById("Password").value;

    const tmp = {login: login, password: password};
    const jsonPayload = JSON.stringify(tmp);

    const url = urlBase + "/api/Login" + extension;
    const xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try{

        xhr.onreadystatechange = function() { 

            if(xhr.readyState === 4 && xhr.status === 200) { 

                const jsonObject = JSON.parse(xhr.responseText);
                // console.log(jsonObject);
                userId = jsonObject.userId;
                error = jsonObject.error;
                uniName = jsonObject.uniName;
             
                if (error !== "") {
                    document.getElementById("loginResult").innerHTML =
                      "Login/Password combination incorrect";
                    return;
                }
                
                email = jsonObject.email;
                
                saveCookie(login, email, userId, uniName);
                window.location.href = "forums.html";
            
            } 
        };

        xhr.send(jsonPayload);

    }catch(err){
        document.getElementById("loginResult").innerHTML = err.message;
    }
}


function signUp(){
    const login = document.getElementById("regLogin").value;
    const email = document.getElementById("Email").value;
    const password = document.getElementById("regPassword").value;
    const conpassword = document.getElementById("ConPassword").value;
    const uniName = document.getElementById("University").value;

    document.getElementById("registerResult").innerHTML = "";

    if (password !== conpassword) {
      document.getElementById("registerResult").innerHTML =
        "Passwords do not match";
      return;
    }
  
    if (password === "" || password === null) {
      document.getElementById("registerResult").innerHTML = "Invalid password";
      return;
    }
  
    if (login === "" || login === null) {
      document.getElementById("registerResult").innerHTML = "Invalid login";
      return;
    }

    const tmp = {login: login, email: email, uniName: uniName, password: password};
    const jsonPayload = JSON.stringify(tmp);

    const url = urlBase + "/api/Register" + extension;
    const xhr = new XMLHttpRequest();

    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
    try{
        xhr.onreadystatechange = function() { 

            if(xhr.readyState === 4 && xhr.status === 200) { 

                const jsonObject = JSON.parse(xhr.responseText);
                // console.log(jsonObject);
                error = jsonObject.error;
             
                if (error !== "") {
                    document.getElementById("registerResult").innerHTML =
                      error;
                    return;
                  }

                // saveCookie();
                window.location.href = "index.html";
            
            } 
        };

        xhr.send(jsonPayload);

    }catch(err){
        document.getElementById("registerResult").innerHTML = err.message;
    }
}

function logout(){
  userId = 0;
  login = "";
  email = "";
  uniName = "";
  document.cookie = "login= ; expires = Thu, 01 Jan 1970 00:00:00 GMT";
  window.location.href = "/index.html";
}

function clearCreateEventFields(){
  document.getElementById("EventName").value = "";
  document.getElementById("Time").value = "";
  document.getElementById("Date").value = "";
  document.getElementById("PhoneNumber").value = "";
  document.getElementById("Email").value = "";
  document.getElementById("Desc").value = "";
  document.getElementById("Category").value = "";
}

function createSchoolEvent(){
  const eventName = document.getElementById("EventName").value;
  const time = document.getElementById("Time").value;
  const date = document.getElementById("Date").value;
  const category = document.getElementById("Category").value;
  const phoneNumber = document.getElementById("PhoneNumber").value;
  const email = document.getElementById("Email").value;
  const desc = document.getElementById("Desc").value;

  if(eventName == ""){
    document.getElementById("createEventResult").innerHTML = ("Please name your event.");
    return;
  }

  if(category != "University"){
    uniName = null;
  }

  let isPublic = false;
  if(category == "Public"){
    isPublic = true;
  }
  
  let rsoId = null;
  if(category == ""){
    document.getElementById("createEventResult").innerHTML = ("Please pick a category for your event.");
    return;
  }
  if(category != "University" && category != "Public"){
    let i = 0;
    let compare = ""
    while(category != compare){
      compare = selectCategoryRsoName[i]
      i++;
    }
    i--;
    rsoId = selectCategoryRsoId[i];
    console.log(rsoId);
  }

  const tmp = {userId: userId, uniName: uniName, eventName: eventName, time: time, date: date, 
              category: category, phoneNumber: phoneNumber, email: email, 
              desc: desc, rsoId: rsoId, isPublic: isPublic};

  const jsonPayload = JSON.stringify(tmp);

  const url = urlBase + "/api/CreateEvent" + extension;
  const xhr = new XMLHttpRequest();

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try{

    xhr.onreadystatechange = function() { 

      if(xhr.readyState === 4 && xhr.status === 200) { 

          const jsonObject = JSON.parse(xhr.responseText);

          error = jsonObject.error;
       
          if (error !== "") {
              document.getElementById("createEventResult").innerHTML =
                error;
              return;
            }
      
            // Clear the fields
            clearCreateEventFields();

            document.getElementById("createEventResult").innerHTML = ("Event Created Successfully");
            searchEvents();
      } 

    };  
  xhr.send(jsonPayload);
  } catch(err){
    document.getElementById("createEventResult").innerHTML = err.message;
  }

}

function createRSO(){
  const rsoName = document.getElementById("RSOName").value;

  if(rsoName == ""){
    document.getElementById("createRSOResult").innerHTML = ("Name your RSO");
    return;
  }

  const tmp = {userId: userId, uniName: uniName, rsoName: rsoName};
  const jsonPayload = JSON.stringify(tmp);

  const url = urlBase + "/api/CreateRSO" + extension;
  const xhr = new XMLHttpRequest();

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try{
    xhr.onreadystatechange = function() { 

        if(xhr.readyState === 4 && xhr.status === 200) { 

            const jsonObject = JSON.parse(xhr.responseText);
            // console.log(jsonObject);
            error = jsonObject.error;
         
            if (error !== "") {
                document.getElementById("createRSOResult").innerHTML =error;
                return;
            }          
            document.getElementById("RSOName").value = "";

            document.getElementById("createRSOResult").innerHTML = ("RSO Created Successfully");
        } 
    };

    xhr.send(jsonPayload);

  }catch(err){
      document.getElementById("createRSOResult").innerHTML = err.message;
  }
}

let unjoinedRsoId = [];
let unjoinedRsoName = [];

function populateUnjoinedRSO(){

  unjoinedRsoId = [];
  unjoinedRsoName = [];

  let tmp = {userId: userId, uniName: uniName};
  let jsonPayload = JSON.stringify(tmp);

  const url = urlBase + "/api/UnjoinedRSO" + extension;
  
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try{
    xhr.onreadystatechange = function() { 

      if(xhr.readyState === 4 && xhr.status === 200) { 

        let jsonObject = JSON.parse(xhr.responseText);
        error = jsonObject.error;

        if (error !== "") {
          console.log(error);
          return;
        }

        for (let i = 0; jsonObject.results != null && i < jsonObject.results.length; i++) {
          document.getElementById("RSO").options.add(new Option(jsonObject.results[i].rsoName));

          unjoinedRsoName[i] = jsonObject.results[i].rsoName;
          unjoinedRsoId[i] = jsonObject.results[i].rsoId;
        }
      } 
    };
    xhr.send(jsonPayload);
  }catch(err){
    console.log(err.message);
  }
}

function joinRSO(){
  var rso = document.getElementById("RSO").value;

  if(rso == ""){
    document.getElementById("joinRSOResult").innerHTML = ("Please pick an RSO");
    return;
  }

  let i = 0;
  let compare = ""
  while(compare != rso){
    compare = unjoinedRsoName[i]
    i++;
  }
  i--;
  let rsoId = unjoinedRsoId[i];
  console.log(rsoId);

  let tmp = {userId: userId, rsoId: rsoId, email: email};
  let jsonPayload = JSON.stringify(tmp);

  const url = urlBase + "/api/JoinRSO" + extension;
  
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try{
    xhr.onreadystatechange = function() { 

      if(xhr.readyState === 4 && xhr.status === 200) { 

        let jsonObject = JSON.parse(xhr.responseText);
        error = jsonObject.error;

        if (error !== "") {
          document.getElementById("joinRSOResult").innerHTML = error;
          return;
        }

        document.getElementById("joinRSOResult").innerHTML = ("Joined RSO Successfully.");
        searchEvents();
      } 
    };
    xhr.send(jsonPayload);
  }catch(err){
    console.log(err.message);
  }
}

function clearAddUniversityFields(){
  document.getElementById("UniName").value = "";
  document.getElementById("sCount").value = "";
  document.getElementById("State").value = "";
  document.getElementById("UniDesc").value = "";
}

function addUniversity(){
  const uni_name = (document.getElementById("UniName").value).toUpperCase();
  const sCount = document.getElementById("sCount").value;
  const state = document.getElementById("State").value;
  const desc = document.getElementById("UniDesc").value;

  if(uni_name == ""){
    document.getElementById("createUniResult").innerHTML = ("Please name your university");
    return;
  }  

  const tmp = {userId: userId, uni_name: uni_name, sCount: sCount, state: state, desc: desc};
  const jsonPayload = JSON.stringify(tmp);

  const url = urlBase + "/api/CreateUniversity" + extension;
  const xhr = new XMLHttpRequest();

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try{
      xhr.onreadystatechange = function() { 

          if(xhr.readyState === 4 && xhr.status === 200) { 

              const jsonObject = JSON.parse(xhr.responseText);
              // console.log(jsonObject);
              error = jsonObject.error;
           
              if (error !== "") {
                  document.getElementById("createUniResult").innerHTML =error;
                  return;
              }          
              clearAddUniversityFields();
              document.getElementById("createUniResult").innerHTML = ("University Added Successfully");
          } 
      };

      xhr.send(jsonPayload);

  }catch(err){
      document.getElementById("createUniResult").innerHTML = err.message;
  }
}

let selectCategoryRsoId = [];
let selectCategoryRsoName = [];

function populateUserRSO(){

  selectCategoryRsoId = [];
  selectCategoryRsoName = [];

  let tmp = {userId: userId};
  let jsonPayload = JSON.stringify(tmp);

  const url = urlBase + "/api/UserRSO" + extension;
  
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try{
    xhr.onreadystatechange = function() { 

      if(xhr.readyState === 4 && xhr.status === 200) { 

        let jsonObject = JSON.parse(xhr.responseText);
        error = jsonObject.error;

        if (error !== "") {
          console.log(error);
          return;
        }

        for (let i = 0; jsonObject.results != null && i < jsonObject.results.length; i++) {
          document.getElementById("Category").options.add(new Option(jsonObject.results[i].rsoName));
          // console.log(jsonObject.results[i].rsoName);

          selectCategoryRsoName[i] = jsonObject.results[i].rsoName;
          selectCategoryRsoId[i] = jsonObject.results[i].rsoId;
        }
      } 
    };
    xhr.send(jsonPayload);
  }catch(err){
    console.log(err.message);
  }
}

function populateUnis(){

  let tmp = {};
  let jsonPayload = JSON.stringify(tmp);

  const url = urlBase + "/api/FindUniversities" + extension;
  
  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try{
    xhr.onreadystatechange = function() { 

      if(xhr.readyState === 4 && xhr.status === 200) { 

        let jsonObject = JSON.parse(xhr.responseText);
        error = jsonObject.error;

        if (error !== "") {
          console.log(error);
          return;
        }
        for (let i = 0; jsonObject.results != null && i < jsonObject.results.length; i++) {
          document.getElementById("University").options.add(new Option(jsonObject.results[i].uniName));
        }
      } 
    };
    xhr.send(jsonPayload);
  }catch(err){
    console.log(err.message);
  }
}

function postComment(ename){

  const eventName = ename
  const text = document.getElementById("createComment").value;
  const rating = document.getElementById("Stars").value;

  document.getElementById("postCommentResult").innerHTML = "";

  if(text == ""){
    document.getElementById("postCommentResult").innerHTML = ("Comment is empty!");
    return;
  }  

  if(rating == ""){
    document.getElementById("postCommentResult").innerHTML = ("Pick a star rating");
    return;
  }  


  const tmp = {userId: userId, eventName: eventName, text: text, rating: rating};
  const jsonPayload = JSON.stringify(tmp);

  const url = urlBase + "/api/CreateComment" + extension;
  const xhr = new XMLHttpRequest();

  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try{
      xhr.onreadystatechange = function() { 

          if(xhr.readyState === 4 && xhr.status === 200) { 

              const jsonObject = JSON.parse(xhr.responseText);
              // console.log(jsonObject);
              error = jsonObject.error;
           
              if (error !== "") {
                  document.getElementById("postCommentResult").innerHTML =error;
                  return;
              }          
              clearAddUniversityFields();
              document.getElementById("postCommentResult").innerHTML = ("Comment posted.");
              document.getElementById("createComment").value = "";
              viewComments(ename);
          } 
      };

      xhr.send(jsonPayload);

  }catch(err){
      document.getElementById("postCommentResult").innerHTML = err.message;
  }
}

function viewComments(ename){
  var cmts = document.getElementById("commentsModal");
  cmts.style.display = "block";

  let tmp = { eventName: ename };
  let jsonPayload = JSON.stringify(tmp);

  const url = urlBase + "/api/DisplayComments" + extension;
  var commentsList = "";

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try{
    xhr.onreadystatechange = function(){

      if (this.readyState == 4 && this.status == 200){
        let jsonObject = JSON.parse(xhr.responseText);

        // console.log(jsonObject);
        error = jsonObject.error;

        if (error !== "") {
            document.getElementById("commentsList").innerHTML = "";
            return;
        }

        commentsList +=
        '<button type="button" id="' + ename + '" class="postComment-btn" onclick="postComment(id)">Post</button>';

        for (
          let i = 0;
          jsonObject.results != null && i < jsonObject.results.length;
          i++
        ) {

          commentsList +=
          '<div class="comment-section">';

          commentsList +=
          '<div class="comment-user">' +
          jsonObject.results[i].login +
          "</div>\n";

          commentsList +=
          '<div class="comment-text">' +
          jsonObject.results[i].text +
          "</div>\n";

          commentsList +=
          '<div class="comment-rating">' +
          jsonObject.results[i].rating +
          "</div>\n";

          commentsList +=
          "</div>\n";

        }
        // console.log(eventsList);
        document.getElementById("Comments").innerHTML = commentsList;
        console.log(commentsList);
      }
    };
    xhr.send(jsonPayload);
  } catch(err){ 
    // document.getElementById("contactSearchResult").innerHTML = err.message;
    console.log(err.message);
  }
  

}

function searchEvents(){
  document.getElementById("eventSearchResult").innerHTML = "";

  let eventsList = "";
  let search = document.getElementById("searchInput").value;

  let tmp = { userId: userId, uniName: uniName, search: search };
  let jsonPayload = JSON.stringify(tmp);
  console.log(userId);
  console.log(search);

  const url = urlBase + "/api/Search" + extension;

  let xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("Content-type", "application/json; charset=UTF-8");
  try{
    xhr.onreadystatechange = function(){

      if (this.readyState == 4 && this.status == 200){
        document.getElementById("eventSearchResult").innerHTML = "Matching Events Retrieved.";
        let jsonObject = JSON.parse(xhr.responseText);

        // console.log(jsonObject);
        error = jsonObject.error;

        if (error !== "") {
            document.getElementById("eventSearchResult").innerHTML =
              error;
              document.getElementById("eventBody").innerHTML = "";
            return;
        }

        for (
          let i = 0;
          jsonObject.results != null && i < jsonObject.results.length;
          i++
        ) {

          //Container
          eventsList +=
          '<div class="event-container" id="eventContainer>';

          //A Post
          eventsList +=
          '<div class="event-post">';

          //Event Name
          eventsList +=
          '<div class="event-name">' +
          jsonObject.results[i].eventName +
          "</div>\n";

          //Event Data (a list)
          eventsList +=
          '<ul class="event-info">'; 

          eventsList +=
          '<li class="event-time">' + "Time: " +
          jsonObject.results[i].time +
          "</li>\n";
          eventsList +=
          '<li class="event-date">' + "Date: " +
          jsonObject.results[i].date +
          "</li>\n";

          eventsList += '<li><a></a></li>';

          eventsList +=
          '<li class="event-category">' + "Category: " +
          jsonObject.results[i].category +
          "</li>\n";

          eventsList += '<li><a></a></li>';
          
          eventsList +=
          '<li class="event-email">' + "Email: "+
          jsonObject.results[i].email +
          "</li>\n";
          eventsList +=
          '<li class="event-phone">' + "Phone #: " +
          jsonObject.results[i].phoneNumber +
          "</li>\n";

          eventsList +=
          "</ul>\n";

          //Event Description
          eventsList +=
          '<div class="event-desc">' +
          jsonObject.results[i].desc +
          "</div>\n";

          //Comments
          eventsList +=
          '<button type=button id="' + jsonObject.results[i].eventName + '"class="viewComments-btn" onclick="viewComments(id)">' + "Comments" + "</button>\n";

          eventsList +=
          "</div>\n";

          eventsList +=
          "</div>\n";

        }
        console.log(eventsList);
        document.getElementById("eventBody").innerHTML = eventsList;
      }
    };
    xhr.send(jsonPayload);
  } catch(err){ 
    document.getElementById("contactSearchResult").innerHTML = err.message;
    console.log(err.message);
  }
}

function saveCookie(login, email, userId, uniName)
{
	let minutes = 20;
	let date = new Date();
	date.setTime(date.getTime()+(minutes*60*1000));	
	document.cookie = "login=" + login + ", email=" + email + ", uniName=" + uniName + ",userId=" + userId + ";expires=" + date.toGMTString();
}

function readCookie()
{
	let data = document.cookie;
	let splits = data.split(",");
	for(var i = 0; i < splits.length; i++) 
	{
		let thisOne = splits[i].trim();
		let tokens = thisOne.split("=");
		if( tokens[0] == "login" )
		{
			login = tokens[1];
		}
		else if( tokens[0] == "email" )
		{
			email = tokens[1];
		}
    else if( tokens[0] == "uniName" )
		{
			uniName = tokens[1];
		}
		else if( tokens[0] == "userId" )
		{
			userId = parseInt( tokens[1].trim() );
		}
	}
	
}

