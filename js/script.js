
let btnStartChat = document.querySelector('.btnChat');
let chatBox = document.querySelector('.sectionChat');
let btnIcon = document.querySelector('.btnChat i')
let inputUser = document.getElementById('inputUser');
let btnsubmitMessage = document.querySelector('.submitMessage');
const userData ={
    message :null
}
//variaveis para a API
const API_KEY = "AIzaSyCKuk2AnaOgcCvS1zd2g-xwNtNwUQRHLxs";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`
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

const createMessageElement = (content, ...classes) => {
const div = document.createElement('div');
div.classList.add("message", classes);
if(div.classList.contains("messageBot")){
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
const generateBotResponse = async (incomingMessageDiv)=>{
const messageElement = incomingMessageDiv.querySelector('.messageBot p');

    //api requisição de opções
const requestOptions = {
    method: 'POST',
    Headers: {
        "Content-Type": "application/json"},
    body: JSON.stringify({
        contents:[{
            parts: [{text: userData.message}]
    }]
    })
}
try {
   const response = await fetch(API_URL, requestOptions ) 
   const data = await response.json();
   if(!response.ok) throw new Error(data.error.message);
console.log(data);

//extração da resposta do bot para texto na tela
   const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
   messageElement.innerHTML = apiResponseText;
} catch (error) {
    console.log(error);
} finally{
    incomingMessageDiv.classList.remove('thinking-indicator');
    chatBody.scrollTo({top: chatBody.scrollHeight, behavior: "smooth"});
}
}

const handleOutgoingMessage = (e) =>{
    e.preventDefault();
   userData.message = inputUser.value.trim();
    inputUser.value = "";


    const messageContent = `<p></p>`
    const outgoingMessageDiv = createMessageElement(messageContent, "messageUser");
    outgoingMessageDiv.querySelector(".messageUser p").textContent = userData.message;
    chatBody.appendChild(outgoingMessageDiv);
    chatBody.scrollTo({top: chatBody.scrollHeight, behavior: "smooth"});
//chat bot resposta
setTimeout(()=>{
    const messageContent = `
                  <div class="thinking-indicator">
                    
                    <div class="dot"></div>
                    <div class="dot"></div>
                    <div class="dot"></div>
                  </div> `

    const incomingMessageDiv = createMessageElement(messageContent, "messageBot");
  
    chatBody.appendChild(incomingMessageDiv);
    chatBody.scrollTo({top: chatBody.scrollHeight, behavior: "smooth"});
    generateBotResponse(incomingMessageDiv);
}, 600);
}
//enviar mensagem via enter
inputUser.addEventListener('keydown', (e)=>{
const userMsg = e.target.value.trim();
if(e.key === 'Enter' && userMsg ){
    handleOutgoingMessage(e);
}

})

btnsubmitMessage.addEventListener('click', (e)=> handleOutgoingMessage(e))