
let btnStartChat = document.querySelector('.btnChat');
let chatBox = document.querySelector('.sectionChat');
let btnIcon = document.querySelector('.btnChat i')
let inputUser = document.getElementById('inputUser');
let btnsubmitMessage = document.querySelector('.submitMessage');
const userData ={
    message :null
}

//fim das variaveis
let chatBody = document.querySelector('.chat')
btnStartChat.addEventListener('click', ()=>{
btnStartChat.classList.toggle('active');
isCloseBtn();

chatBox.classList.toggle('active');
})

function isCloseBtn(){

    if(btnStartChat.classList.contains('active')){
       btnIcon.classList.remove('fa-robot');
         btnIcon.classList.add('fa-xmark');
    }else{
        btnIcon.classList.remove('fa-xmark');
        btnIcon.classList.add('fa-robot');
    }
}

inputUser.addEventListener('keypress', ()=>{
btnsubmitMessage.classList.add('btnactive');
inputUser.style.width = '72%';
})

const createMessageElement = (content, classes) => {
const div = document.createElement('div');
div.classList.add("message", classes);
if(div.classList.contains(messageBot)){
    const roboBot = document.createElement('div');
    roboBot.classList.add('robochat');
    roboBot.innerHTML = `<i class="fa-solid fa-robot"></i>` 
    div.appendChild(roboBot);
}
const p = document.createElement('p');
p.innerHTML = content;

div.appendChild(p);

return div;
}

const handleOutgoingMessage = (e) =>{
    e.preventDefault();
   userData.message = inputUser.value.trim();
    inputUser.value = '';

    const messageContent = `<p></p>`
    const outgoingMessageDiv = createMessageElement(messageContent, "messageUser");
    outgoingMessageDiv.querySelector(".messageUser p").textContent = userData.message;
    chatBody.appendChild(outgoingMessageDiv);
    
setTimeout(()=>{
    const messageContent = `<p>...</p> `
    const incomingMessageDiv = createMessageElement(messageContent, "messageBot");
  
    chatBody.appendChild(incomingMessageDiv);
}, 600);
}

inputUser.addEventListener('keydown', (e)=>{
const userMsg = e.target.value.trim();
if(e.key === 'Enter' && userMsg ){
    handleOutgoingMessage(e);
}

})

btnsubmitMessage.addEventListener('click', (e)=> handleOutgoingMessage(e))