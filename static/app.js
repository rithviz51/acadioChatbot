class Chatbox {
    constructor() {
       this.args = {
        openButton: document.querySelector('.chatbox__button'),
        chatBox: document.querySelector('.chatbox__support'),
        sendButton: document.querySelector('.send__button')
       }
       
       this.state = false;
       this.messages = [];

    }

    display(){
        const {openButton, chatBox, sendButton} = this.args;

        openButton.addEventListener('click', ()=> this.toggleState(chatBox))

        sendButton.addEventListener('click', ()=> this.onSendButton(chatBox))
        
        const node = chatBox.querySelector('input');
        node.addEventListener('keyup', ({key}) => {
            if(key === "Enter"){
                this.onSendButton(chatBox);
            }
        })
        }

    toggleState(chatbox){
        this.state = !this.state;

        if(this.state){
            chatbox.classList.add('chatbox--active');
        } else {
            chatbox.classList.remove('chatbox--active');
        }
    }

    onSendButton(chatbox){
        var inputText = chatbox.querySelector('input');
        let textValue = inputText.value;
        if(textValue === ""){
            return;
        }

        let msg = {name: "User", message: textValue};
        this.messages.push(msg);
        
        fetch("http://127.0.0.1:5000/predict", {
            method: 'POST',
            body: JSON.stringify({message: textValue}),
            mode: 'cors',
            headers:{
                'Content-Type': 'application/json'
            },
        }).then(r => r.json())
        .then(r => {
            let msg2 = {name: "Acadio", message: r.answer};
            this.messages.push(msg2);
            this.updateChatText(chatbox);
            inputText.value="";

        }).catch(function(err){
            console.log(err);
            this.updateChatText(chatbox);
            inputText.value = '';
        });
        this.messages.forEach(function(msg){
            console.log(msg);
        });

    }

    updateChatText(chatbox){
        var html = '';
        console.log(this.messages);
        this.messages.slice().reverse().forEach(function(item,){
            if(item.name === "Acadio"){
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
            } else {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
            }
        });
        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
    }
            
    }
    const chatbox = new Chatbox();
    chatbox.display();
