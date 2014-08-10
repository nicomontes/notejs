var lastContent;
var lastDate = new Date().getTime();
var lastId;
vue = new Vue({
  el: '#editor',
  filters: {
      marked: marked
  }
});

// GET Note Content when we click on <li>
function displayContent(id) {
  if (lastId) {
    socket.get('/note/subscribe',{leave: lastId})
  }
  socket.get('/note/search?id='+id, function (response) {
    document.getElementById("content").innerHTML="";
    document.getElementById("content").style.visibility='visible';
    console.log(document.cookie);
    userName = readCookie('userName');
    userId = readCookie('userId');
    for (i=0; i<response.creator.length; i++) {
      if (response.creator[i] == userId) {
        document.getElementById("deleteButton").style.visibility='visible';
        document.getElementById("shareButton").style.visibility='visible';
        document.getElementById("saveButton").style.visibility='visible';
        document.getElementById("content").readOnly = false;
      }
    }
    for (i=0; i<response.writer.length; i++) {
      if (response.writer[i] == userId) {
        document.getElementById("deleteButton").style.visibility='hidden';
        document.getElementById("shareButton").style.visibility='hidden';
        document.getElementById("saveButton").style.visibility='visible';
        document.getElementById("content").readOnly = false;
      }
    }
    for (i=0; i<response.reader.length; i++) {
      if (response.reader[i] == userId) {
        document.getElementById("deleteButton").style.visibility='hidden';
        document.getElementById("shareButton").style.visibility='hidden';
        document.getElementById("saveButton").style.visibility='hidden';
        document.getElementById("content").readOnly = true;
      }
    }
    loadEditor(response.content, id);
    lastId = id;
  });
  socket.get('/note/subscribe',{room: id})
}

// Load Editor
function loadEditor(content, id) {
  if (vue.$data.input) {
    lastContent = vue.$data.input;
    var dmp = new diff_match_patch();
    var diffmain = dmp.diff_main(lastContent, content);
    dmp.diff_cleanupSemantic(diffmain);
    lastDate = new Date().getTime();
  }
  vue.$el.id = id;
  vue.$data.input = content;
}

// RUN saveContent when key are pressed
document.getElementById('content').addEventListener('keyup', saveContent, false);
// HIDDEN textarea and action buttons
document.getElementById("content").style.visibility='hidden';
document.getElementById("deleteButton").style.visibility='hidden';
document.getElementById("shareButton").style.visibility='hidden';
document.getElementById("saveButton").style.visibility='hidden';
// Set texarea on read only
document.getElementById("content").readOnly = true;

socket.put('/user/search',{
  nameExact: readCookie('userName')
}, function (response) {
  createCookie('userId', response.user.id, 1);
});

// Save Content with socket.io
function saveContent(button) {
  document.getElementById('status').style.borderTopColor = 'red';
  if (new Date().getTime() > eval(lastDate+2000) || button == true){
    lastDate = new Date().getTime();
    socket.put('/note/update',{
      id: vue.$el.id,
      content: vue.$data.input,
      name: name
    }, function (response) {
      if (response.success == true) {
        document.getElementById('status').style.borderTopColor = '#ddd';
      }
    });
  }
}

function saveUsername () {
  createCookie('userName', document.getElementById('name').value, 1)
}

function deleteNote() {
  socket.delete('/note/destroy',{
    id: vue.$el.id,
  }, function (response) {
    if (response.success == true) {
      window.location.replace("/note/list");
    }
  });
}

function shareNote() {
  $.featherlight('/note/share', '');
}

function searchUser() {
  console.log(document.getElementById('searchUser').value);
  socket.get('/user/search?name='+ document.getElementById('searchUser').value, function (response) {
    console.log(response);
    document.getElementById("userSearchedDl").innerHTML = "";
    for (var i=0; i<response.users.length; i++) {
      var li = document.createElement("li");
      li.className = "button";
      li.id = response.users[i].id;
      li.innerText = response.users[i].name;
      document.getElementById("userSearchedDl").appendChild(li);
      $("li").draggable({revert:true});
    }
  });
}








function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}
