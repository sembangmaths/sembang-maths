import {
initializeApp
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {
getAuth,
onAuthStateChanged
}
from
"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";



const firebaseConfig = {

apiKey: "AIzaSyCM7AcvKL5-rTm4kISFjU1GLE2IGU2stUM",
authDomain:"sembang-maths.firebaseapp.com",
projectId:"sembang-maths",
storageBucket:"sembang-maths.firebasestorage.app",
messagingSenderId:"949561490562",
appId:"1:949561490562:web:0adfde880f6de95c03489b"

};



const app = initializeApp(firebaseConfig);

const auth = getAuth(app);



window.userLogged = false;



function getInitial(name){

if(!name) return "U";


const words = name
.trim()
.split(" ");


if(words.length >= 2){

return (
words[0][0] +
words[1][0]
)
.toUpperCase();

}


return name
.substring(0,2)
.toUpperCase();

}



function renderProfile(){


const box = document.getElementById("profileIcon");


if(!box) return;



const name =
localStorage.getItem("userName");


const photo =
localStorage.getItem("userPhoto");



if(photo){


box.innerHTML = `

<img src="${photo}">

`;


}

else if(name){


box.innerHTML = `

<div class="profile-initial">
${getInitial(name)}
</div>

`;


}

else{


box.innerHTML = `

<span class="material-symbols-rounded profile-default-icon">
person
</span>

`;


}


}



// PAPAR DATA LOCAL STORAGE DULU
renderProfile();



// CHECK FIREBASE LOGIN
onAuthStateChanged(auth,(user)=>{


if(user){


window.userLogged = true;



localStorage.setItem(
"userName",
user.displayName || "User"
);



localStorage.setItem(
"userPhoto",
user.photoURL || ""
);



renderProfile();



}else{


window.userLogged = false;



localStorage.removeItem("userName");

localStorage.removeItem("userPhoto");



renderProfile();


}


});



// PROFILE CLICK
window.checkProfile = function(){


if(window.userLogged){


window.location.href="profile.html";


}else{


window.location.href="login.html";


}


};

function loadLocalProfile(){

const name = localStorage.getItem("userName");
const photo = localStorage.getItem("userPhoto");

const box = document.getElementById("profileImageBox");


if(photo){

box.innerHTML = `
<img src="${photo}">
`;

}
else if(name){

box.innerHTML = `
<div class="profile-initial">
${getInitial(name)}
</div>
`;

}

}

