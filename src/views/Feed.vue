<script setup>
import { ref } from 'vue'
import Toast from '@/components/Toast.vue';

const url = 'https://hap-app-api.azurewebsites.net/message'

const thought = ref()
const message = ref('')

const token = localStorage.getItem('token');


async function sendMessage(){

console.log(thought.value)

const options = {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`,
  },
  body: JSON.stringify({text: thought.value}),
}

let response = await fetch(url, options)

if (response.status === 201) {

  const rsp = await response.json()

  console.log(rsp)

  message.value = "Thank you for sharing your thought!"

  thought.value = ''
}
else if (response.status === 400) {
  message.value = "Something went wrong. Mind to share again?"
  console.log("Bad request!")
}
else if(response.status === 401){
  message.value = "Something went wrong. Mind to share again?"
  console.log("Unauthorized!")
}
else if (response.status === 500){
  console.log("Internal server error!")
}
}
</script>

<template>
  <div class="flex justify-center items-center h-screen">
    <h1>Share a Thought</h1>
    <div class= "send-message">
      <input v-model="thought" type="text"/>
      <button id = "send-message-button"  @click="sendMessage"><img src="/sendMessage.png" id="send-message-icon"></button>
    </div>
    <Toast :message></Toast>
    <img src="/feed1.png" alt="Feed Image">
  </div>
</template>

<style scoped>

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
</style>