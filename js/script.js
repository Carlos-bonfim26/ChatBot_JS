
const btnStartChat = document.querySelector('.btnChat');
const chatBox = document.querySelector('.sectionChat');
const btnIcon = document.querySelector('.btnChat i')
const inputUser = document.getElementById('inputUser');
const btnsubmitMessage = document.querySelector('.submitMessage');
const fileInput = document.querySelector('#fileInput');
const fileUploadWrapper = document.querySelector('.file-upload-wrapper');
const fileCancelButton = document.querySelector('.cancel-file')

const userData ={
    message :null,
    file:{
        data:null,
        mime_type:null,
    }
}

const chatHistory = [];

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
const text = document.createElement('div');
text.classList.add('textMessage');
text.innerHTML = content;

div.appendChild(text);

return div;
}
const generateBotResponse = async (incomingMessageDiv)=>{
const messageElement = incomingMessageDiv.querySelector('.messageBot .textMessage');
chatHistory.push({
    //para manter o contexto da conversa puxa informações das mensagens anteriores com o usuário
    role: "user",
    parts: [{text: userData.message}, ...(userData.file.data? [{inline_data: userData.file}]: [])]
})

    //api requisição de opções
const requestOptions = {
    method: 'POST',
    Headers: {
        "Content-Type": "application/json"},
    body: JSON.stringify({
        contents:chatHistory
    })
} 
try {
   const response = await fetch(API_URL, requestOptions ) 
   const data = await response.json();
   if(!response.ok) throw new Error(data.error.message);


//extração da resposta do bot para texto na tela
   const apiResponseText = data.candidates[0].content.parts[0].text.replace(/\*\*(.*?)\*\*/g, "$1").trim();
   messageElement.innerHTML = apiResponseText;

   //puxa as informações da API
   chatHistory.push({
    role: "model",
    parts: [{text: apiResponseText}]
})
} catch (error) {
    //tratamento de erro
    console.log(error);
    messageElement.innerText = "Desculpe mas ouve um erro na requisição, tente novamente mais tarde!";
    messageElement.style.color = "red";
} finally{
    //reseta e tira a foto bo bot
    userData.file = {};
    incomingMessageDiv.classList.remove('thinking-indicator');
    chatBody.scrollTo({top: chatBody.scrollHeight, behavior: "smooth"});
}
}

const handleOutgoingMessage = (e) =>{
    e.preventDefault();
   userData.message = inputUser.value.trim();
    inputUser.value = "";
    fileUploadWrapper.classList.remove('file-uploaded');

    const messageContent = `
  ${userData.message}
  ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" alt="file" class="imgFileUChat" />` : ""}
`;

const outgoingMessageDiv = createMessageElement(messageContent, "messageUser");
chatBody.appendChild(outgoingMessageDiv);


  

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

fileInput.addEventListener('change', ()=>{
    const file = fileInput.files[0];
    if(!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {

fileUploadWrapper.querySelector('img').src = e.target.result;

fileUploadWrapper.classList.add('file-uploaded');
const base64String = e.target.result.split(',')[1];

        userData.file ={
            data:base64String,
            mime_type:file.type
        }

        fileInput.value= "";
    }
  console.log("arquivo enviado", userData.file);
    reader.readAsDataURL(file);
})

fileCancelButton.addEventListener('click', ()=>{

    userData.file ={};
    fileUploadWrapper.classList.remove('file-uploaded');
})


const picker = new EmojiMart.Picker({
theme: "light",
skinTonePosition: "none",
previewPosition: "none",
onEmojiSelect:(emoji) =>{
    const{selectionStart: start, selectionEnd: end} = inputUser;
    inputUser.setRangeText(emoji.native, start, end, "end");
    inputUser.focus();
},
onClickOutside: (e)=>{
    if(e.target.id == "emoji-btn"){
        document.body.classList.toggle('emoji-open');
    }else{
        document.body.classList.remove('emoji-open');
    }
}
});
document.querySelector(".inputOptions").appendChild(picker);


btnsubmitMessage.addEventListener('click', (e)=> handleOutgoingMessage(e))
document.querySelector('.file-upload').addEventListener('click', ()=>{
fileInput.click();
});