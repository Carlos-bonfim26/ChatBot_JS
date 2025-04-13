[GEMINI_BADGE]:https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white
[CSS_BADGE]:https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white
[HTML_BADGE]:https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white
[JAVASCRIPT_BADGE]:https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E
# ChatBot

![HTML][HTML_BADGE]
![CSS][CSS_BADGE]
![JAVASCRIPT][JAVASCRIPT_BADGE]
![GEMINI][GEMINI_BADGE]

## Inspiração

O projeto não é originalmente meu, apenas alguns ajustos para o meu código, mas o original desse [vídeo](https://youtu.be/B21G6tUI4L0?si=h4Tgu4C1vjv0M1TU) do canal [CodingNepal.](https://www.youtube.com/@CodingNepal)

## por que fiz? 

Apenas para testar minhas habilidades e ver aumentar meu aprendizado sobre javascript e aplicação de API.

## API usada

utilizei a API do Google Gemini, mas especificadamente a parte de geração de texto, aqui o link da documentação [https://ai.google.dev/gemini-api/docs?hl=pt-br](https://ai.google.dev/gemini-api/docs?hl=pt-br)

## Indo ao Código 💻

O HTML e o CSS eu não irei explicar, apenas algumas funções do Javascript, inclusive texte o chatbot por favor: [https://carlos-bonfim26.github.io/ChatBot_JS/](https://carlos-bonfim26.github.io/ChatBot_JS/)

### 🔁 Ciclo da Mensagem

1. Usuário digita e envia a mensagem (com ou sem imagem);
2. A mensagem é exibida no chat;
3. O bot simula um carregamento ("pensando...");
4. A requisição é feita para a API Gemini;
5. A resposta gerada é exibida no chat;
6. O histórico da conversa é salvo para manter o contexto.

## 📌 Principais Funções

### Geração da resposta

Essa é a principal função para o funcionamento da API, tendo as requisições, tratamento de erros, salvamento de contexto, como vem dizendo nos próprios comentários, sendo uma função complexa e nada génerica.

```bash

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

```

### User data e váriaveis da API

use o link e a sua chave pessoal, o meu não funcionará no seu código, ele será fornecida lá no mesmo documento da documentação da API

``` bash

const userData ={
    message :null,
    file:{
        data:null,
        mime_type:null,
    }
}

const chatHistory = [];

//variaveis para a API, use o link e a sua chave pessoal, o meu não funcionará no seu código
const API_KEY = "AIzaSyCKuk2AnaOgcCvS1zd2g-xwNtNwUQRHLxs";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`

```
### Criação de Elementos

A criação dos blocos de mensagem é via JS sendo necessário os parâmetros de conteúdo para fornecer a mensagem e as classes para diferencias de uma mensagem do usuário e do chat

``` bash

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

```

## 📤 Enviar Imagens

Uma das partes essencias para o envio de imagens na aplicaçao está aqui

``` bash

const handleOutgoingMessage = (e) =>{
    e.preventDefault();
   userData.message = inputUser.value.trim();
    inputUser.value = "";
    fileUploadWrapper.classList.remove('file-uploaded');

    // enviar imagens
    const messageContent = `
  ${userData.message}
  ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" alt="file" class="imgFileUChat" />` : ""}
`; 
// a função continua...

```
## ✍️ enviar mensagem

### via enter 

``` bash

inputUser.addEventListener('keydown', (e)=>{
const userMsg = e.target.value.trim();
if(e.key === 'Enter' && userMsg ){
    handleOutgoingMessage(e);
}

})
```
### via input/button
``` bash

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

```

### ❌ Cancelar mensagem

``` bash
fileCancelButton.addEventListener('click', ()=>{

    userData.file ={};
    fileUploadWrapper.classList.remove('file-uploaded');
})
```

### 😊 enviar emoji

``` bash

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
```
