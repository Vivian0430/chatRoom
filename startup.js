var url = require("url");
var express = require("express");
var app = express();

var dateUtil = {
	now : function(){
		var date = new Date();
		return date.toLocaleDateString() + " " +date.getHours() +":"+date.getMinutes()+":"+date.getSeconds();
	}
}

function html_encode(str) 
{ 
var s = ""; 
if (str.length == 0) return ""; 
s = str.replace(/&/g, "&gt;"); 
s = s.replace(/</g, "&lt;"); 
s = s.replace(/>/g, "&gt;"); 
s = s.replace(/ /g, "&nbsp;"); 
s = s.replace(/\'/g, "&#39;"); 
s = s.replace(/\"/g, "&quot;"); 
s = s.replace(/\n/g, "<br>"); 
return s; 
}



var users ={};

// var facesMap = {
// 	"{emoj:a1}" : "<span class=\"faceImg a1\"></span>" ,
// 	"{emoj:a2}" : "<span class=\"faceImg a2\"></span>" ,
// 	"{emoj:a3}" : "<span class=\"faceImg a3\"></span>" ,
// 	"{emoj:a4}" : "<span class=\"faceImg a4\"></span>" ,
// 	"{emoj:a5}" : "<span class=\"faceImg a5\"></span>" ,
// 	"{emoj:a6}" : "<span class=\"faceImg a6\"></span>" ,
// 	"{emoj:a7}" : "<span class=\"faceImg a7\"></span>" ,

// 	"{emoj:b1}" : "<span class=\"faceImg b1\"></span>" ,
// 	"{emoj:b2}" : "<span class=\"faceImg b2\"></span>" ,
// 	"{emoj:b3}" : "<span class=\"faceImg b3\"></span>" ,
// 	"{emoj:b4}" : "<span class=\"faceImg b4\"></span>" ,
// 	"{emoj:b5}" : "<span class=\"faceImg b5\"></span>" ,
// 	"{emoj:b6}" : "<span class=\"faceImg b6\"></span>" ,
// 	"{emoj:b7}" : "<span class=\"faceImg b7\"></span>" ,

// 	"{emoj:c1}" : "<span class=\"faceImg c1\"></span>" ,
// 	"{emoj:c2}" : "<span class=\"faceImg c2\"></span>" ,
// 	"{emoj:c3}" : "<span class=\"faceImg c3\"></span>" ,
// 	"{emoj:c4}" : "<span class=\"faceImg c4\"></span>" ,
// 	"{emoj:c5}" : "<span class=\"faceImg c5\"></span>" ,
// 	"{emoj:c6}" : "<span class=\"faceImg c6\"></span>" ,
// 	"{emoj:c7}" : "<span class=\"faceImg c7\"></span>" ,

// 	"{emoj:d1}" : "<span class=\"faceImg d1\"></span>" ,
// 	"{emoj:d2}" : "<span class=\"faceImg d2\"></span>" ,
// 	"{emoj:d3}" : "<span class=\"faceImg d3\"></span>" ,
// 	"{emoj:d4}" : "<span class=\"faceImg d4\"></span>" ,
// 	"{emoj:d5}" : "<span class=\"faceImg d5\"></span>" ,
// 	"{emoj:d6}" : "<span class=\"faceImg d6\"></span>" ,
// 	"{emoj:d7}" : "<span class=\"faceImg d7\"></span>" ,

// }

app.get("/",function(req,res){
	res.set('Content-Type', 'text/html;charset=UTF-8');
	var ip = req.connection.remoteAddress.split(":")[3];
	console.log(ip);
	if(users[ip]){
      console.log(ip + "login success");
      res.sendFile(__dirname + "/public/index.html");
	}
	else{
      res.sendFile(__dirname + "/public/login.html");
	} 
})

function isNickNameExist(nickname){
	for(var key in users){
		if(users[key].nickname == nickname){
			return true;
		}
	}
	return false;
}
app.get("/login.do",function(req,res){
	var nickname = url.parse(req.url,true).query.nickname;
    var ip = req.connection.remoteAddress.split(':')[3];
    if(users[ip]){
		res.sendFile(__dirname + "/public/index.html");
		return;
	}

    if(isNickNameExist(nickname.trim())){
		res.send("昵称已经被占用！");
		return;
	}  


	if(!nickname.trim()){
		res.send("昵称不允许为空！");
		return;
	}

	console.log("当前用户名为：" + nickname.trim());

	if(nickname.length > 16){
		res.send("用户名过长！最多16个字符！");
		return;
	}

	var ip = req.connection.remoteAddress.split(":")[3];
	nickname = html_encode(nickname);
	users[ip] ={
         nickname: nickname,
         role: "common"
	} 
	res.sendFile(__dirname + "/public/index.html");
})


app.get("/getAllUsers.do",function(req,res){

	res.send(JSON.stringify(users));

})

    

var chatList = [];

app.get("/getChatList.do",function(req,res){

	res.send(JSON.stringify(chatList));

})

// String.prototype.replaceAll = function(s1,s2){
// 　　return this.replace(new RegExp(s1,"gm"),s2);
// }

app.get("/send.do",function(req,res){
    var message = url.parse(req.url,true).query.message;
    var color = url.parse(req.url,true).query.color;
    console.log(message);
    var ip = req.connection.remoteAddress.split(":")[3];

    if(!users[ip]){
		res.sendFile(__dirname + "/public/login.html");
		return;
	}
	message = html_encode(message);
	// for(var key in facesMap){
	// 	message = message.replaceAll(key,facesMap[key]);
	// }

	if(message.length > 100){
		res.send("fail");
		return;
	}
    chatList.push({
    	ip: ip,
    	message: message,
        sendDate: dateUtil.now(),
        nickname: users[ip].nickname,
        color: color
    })
    res.send("success");
})

app.use(express.static("public"));

app.listen(3000);
console.log("serve start");