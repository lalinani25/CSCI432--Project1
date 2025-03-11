<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter} from 'vue-router'; 

const route = useRoute();
console.log(route.params)
const userId = route.params.userId; 
const userName = route.params.userName; 
const token = localStorage.getItem('token'); 
const newMessage = ref(''); 
const messageError = ref(''); 
const router = useRouter();


async function sendMessage() {
  if (newMessage.value.trim()) {
    try {
      const response = await fetch(`https://hap-app-api.azurewebsites.net/message/${userId}`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: newMessage.value }),
      });

      if (response.ok) {
        newMessage.value = ''; 
        messageError.value = '';  

    
      } else {
        messageError.value = 'Failed to send the message. Please try again.';
      }
    } catch (error) {
      messageError.value = 'An error occurred while sending the message.';
      console.error(error);
    }
  } else {
    messageError.value = 'Please enter a message before sending.';
  }
}
</script>

<template>
  <div class="message-form-container">
    <h1>Send a Message {{ userName }}</h1>


    <div v-if="messageError" class="error-message">{{ messageError }}</div>

    <div class= "send-message">
    <input v-model="newMessage" placeholder="Type a new message...">

    <button id = "send-message-button"  @click="sendMessage"><img src="/sendMessage.png" id="send-message-icon"></button>
    </div>
  </div>
</template>

<style scoped>
.message-form-container {
  padding: 20px;
  font-family: Arial, sans-serif;
}

img {
  max-width: 100%; 
  height: auto; 
  padding: 5px;
  margin-top: 10px;
  margin-bottom: 10px;
}


h1{
  text-align: center;
  font-family: Brush Script MT, Brush Script Std, cursive;
  font-size: 30px;
  margin-top: 200px;
}

.send-message{
  display: flex;
  gap: 10px
}

#send-message-icon{
  width: 30px;
  height: 30px;
  margin-top: -2px;
  cursor: pointer;
}

#send-message-button{
  height: 30px;
  background-color: hsl(0, 0%, 0%);
}

input{
  width: 80%;
  margin-left: 20px;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-bottom: 10px;
}
</style>
