socket.get('/note/search?id=' + vue.$el.id, function (response) {
	$("div[id^='drash']").droppable({
		drop:function(event, ui){
			console.log(document.getElementById('creatorDl').childNodes[0].id)
			if (document.getElementById('creatorDl').childNodes.length > 1 || document.getElementById('creatorDl').childNodes[0].id != ui.draggable.context.id) {
				setTimeout(function(){removeLi(ui.draggable.context.parentNode, ui.draggable.context)}, 50);
			}
		}
	});
	for (var i=0; i<response.creator.length; i++) {
		socket.get('/user/search?id=' + response.creator[i], function (user) {
			var li = document.createElement("li");
			li.className = "button";
			li.id = user.id;
			li.innerText = user.name;
			document.getElementById("creatorDl").appendChild(li);
			$("li").draggable({revert:true});
		});
	}
	if (response.writer) {
		for (var i=0; i<response.writer.length; i++) {
			socket.get('/user/search?id=' + response.writer[i], function (user) {
				var li = document.createElement("li");
				li.className = "button";
				li.id = user.id;
				li.innerText = user.name;
				document.getElementById("writerDl").appendChild(li);
				$("li").draggable({revert:true});
			});
		}
	}
	if (response.reader) {
		for (var i=0; i<response.reader.length; i++) {
			socket.get('/user/search?id=' + response.reader[i], function (user) {
				var li = document.createElement("li");
				li.className = "button";
				li.id = user.id;
				li.innerText = user.name;
				document.getElementById("readerDl").appendChild(li);
				$("li").draggable({revert:true});
			});
		}
	}
});

console.log('test');

document.getElementById('searchUser').addEventListener('keyup', searchUser, false);

$("div[id^='listShare']").droppable({
	drop:function(event, ui){
		var liIsInDivCreator;
		var liIsInDivWriter;
		var liIsInDivReader;
		for (var i=0; i<document.getElementById('creatorDl').childNodes.length; i++) {
			if (document.getElementById('creatorDl').childNodes[i].id == ui.draggable.context.id) {
				liIsInDivCreator = true;
			}
		}
		for (var i=0; i<document.getElementById('writerDl').childNodes.length; i++) {
			if (document.getElementById('writerDl').childNodes[i].id == ui.draggable.context.id) {
				liIsInDivWriter = true;
			}
		}
		for (var i=0; i<document.getElementById('readerDl').childNodes.length; i++) {
			if (document.getElementById('readerDl').childNodes[i].id == ui.draggable.context.id) {
				liIsInDivReader = true;
			}
		}
		if ((document.getElementById('creatorDl').childNodes.length == 1 && document.getElementById('creatorDl').childNodes[0].id == ui.draggable.context.id) || ((ui.draggable.context.parentNode.id == 'userSearchedDl') && (liIsInDivCreator == true || liIsInDivWriter == true || liIsInDivReader == true ))) {
				liIsInDivCreator = true;
				liIsInDivWriter = true;
				liIsInDivReader = true;
		}
		if (liIsInDivCreator != true && event.target.id == "listShareCreator" ) {
			setTimeout(function(){removeLi(ui.draggable.context.parentNode, ui.draggable.context)}, 50);
			var li = document.createElement("li");
			li.className = "button";
			li.id = ui.draggable.context.id;
			li.innerText = ui.draggable.context.innerText;
			this.children[1].appendChild(li);
			$("li").draggable({revert:true});
			updateDB(vue.$el.id, ui.draggable.context.parentNode.id.substring(0,ui.draggable.context.parentNode.id.length-2), event.target.children[1].id.substring(0,event.target.children[1].id.length-2), ui.draggable.context.id);
		}
		else if (liIsInDivWriter != true && event.target.id == "listShareWriter") {
			setTimeout(function(){removeLi(ui.draggable.context.parentNode, ui.draggable.context)}, 50);
			var li = document.createElement("li");
			li.className = "button";
			li.id = ui.draggable.context.id;
			li.innerText = ui.draggable.context.innerText;
			this.children[1].appendChild(li);
			$("li").draggable({revert:true});
			updateDB(vue.$el.id, ui.draggable.context.parentNode.id.substring(0,ui.draggable.context.parentNode.id.length-2), event.target.children[1].id.substring(0,event.target.children[1].id.length-2), ui.draggable.context.id);
		}
		else if (liIsInDivReader != true && event.target.id == "listShareReader") {
			setTimeout(function(){removeLi(ui.draggable.context.parentNode, ui.draggable.context)}, 50);
			var li = document.createElement("li");
			li.className = "button";
			li.id = ui.draggable.context.id;
			li.innerText = ui.draggable.context.innerText;
			this.children[1].appendChild(li);
			$("li").draggable({revert:true});
			updateDB(vue.$el.id, ui.draggable.context.parentNode.id.substring(0,ui.draggable.context.parentNode.id.length-2), event.target.children[1].id.substring(0,event.target.children[1].id.length-2), ui.draggable.context.id);
		}
	}
})

function removeLi(parent, li) {
	parent.removeChild(li);
}

function updateDB(id, autoRm, autoAdd, userId){
	console.log(id);
	socket.put('/note/update',{
		id: id,
		autoRm: autoRm,
		autoAdd: autoAdd,
		userId: userId
	}, function (response) {
			console.log(response);
	});
}
