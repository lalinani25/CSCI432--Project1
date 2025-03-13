<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted, nextTick } from 'vue'
import Message from '../components/Message.vue'
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore()
const {token} = storeToRefs(userStore)

const router = useRouter()
//const token = localStorage.getItem('token')


const items = ref([])  
const firstFetchedDate = ref(null)  
const newMessagesCount = ref(0)  
const resetTime = ref(null)  

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString("en-US", { timeZone: 'America/New_York' }) + " EST"
}

const currentTime = new Date().toISOString()  

const time = ref()
let hasFetchedNewMessages = ref(false)  

const fetchData = async (date) => {
  const formattedDate = date || `before=${firstFetchedDate.value || currentTime}`;

  let url = `https://hap-app-api.azurewebsites.net/messages?limit=10&${formattedDate}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token.value}`
      },
    });

    if (response.ok) {
      const data = await response.json();

      if (data.length > 0) {
        const newMessages = data.filter(item =>
          !items.value.some(existingItem => existingItem.updatedAt === item.updatedAt)
        );

        if (newMessages.length > 0) {
          items.value = [...items.value, ...newMessages.map(item => ({
            senderName: item.senderName,
            text: item.text,
            updatedAt: formatDate(item.updatedAt)
          }))];

          time.value = newMessages[0].updatedAt;
          firstFetchedDate.value = newMessages[newMessages.length - 1].updatedAt;
        }
      }
    } else {
      console.log("Error: An error occurred while fetching data");
    }
  } catch (error) {
    console.log("Error: " + error.message);
  }
};


const fetchNewMessagesCount = async () => {

  const newCount = await countNewMessages();

  newMessagesCount.value = newCount;
};


const countNewMessages = async () => {
  let url = `https://hap-app-api.azurewebsites.net/messages/count?after=${resetTime.value || currentTime}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token.value}`
      },
    });

    if (response.ok) {
      const data = await response.json();

      return data.total;
    } else {
      console.log("Error: An error occurred while fetching count data");
    }
  } catch (error) {
    console.log("Error: " + error.message);
  }
  return 0; 
};


const loadMoreMessages = async (entry) => {
  if (entry.isIntersecting) {
    console.log('Reached the bottom, loading more messages...')
    await fetchData()  
    await fetchNewMessagesCount()  
  }
}

let observer

const loadNewMessages = async () => {
  const newfetchData = async () => {
    let url = `https://hap-app-api.azurewebsites.net/messages?limit=10&after=${time.value}`;

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          "Authorization": `Bearer ${token.value}`
        },
      });

      if (response.ok) {
        const data = await response.json();

        if (data.length > 0) {
          const newMessages = data.filter(item =>
            !items.value.some(existingItem => existingItem.updatedAt === item.updatedAt)
          );

          if (newMessages.length > 0) {
           
            items.value = [...newMessages.map(item => ({
              senderName: item.senderName,
              text: item.text,
              updatedAt: formatDate(item.updatedAt)
            })), ...items.value];

            time.value = newMessages[0].updatedAt;
            firstFetchedDate.value = newMessages[newMessages.length - 1].updatedAt;
          }
        }
      } else {
        console.log("Error: An error occurred while fetching data");
      }
    } catch (error) {
      console.log("Error: " + error.message);
    }
  };

  await newfetchData();  
  hasFetchedNewMessages.value = true;  
  newMessagesCount.value = 0;  

  
  resetTime.value = new Date().toISOString();

  
  const container = document.querySelector('#scrollable-container');
  if (container) {
    nextTick(() => {
      container.scrollTop = 0; 
    });
  }
};


onMounted(() => {
  
  fetchData()

  const options = {
    root: document.querySelector('#scrollable-container'),
    rootMargin: '0px',
    threshold: 1.0, 
  }

  observer = new IntersectionObserver(([entry]) => loadMoreMessages(entry), options)

  const target = document.querySelector('#bottom')
  if (target) {
    observer.observe(target)
  }

  fetchNewMessagesCount()
})
</script>

<template>
  <div class="flex justify-center align-center">
    <div class="flex align-center" @click="router.back()">
      <img src="/leftArrow.png" class="icon back-button" />
    </div>
    <h1>Read Some Thoughts</h1>

    <div v-if="newMessagesCount > 0" class="new-messages-count">
      <button @click="loadNewMessages">
        {{ newMessagesCount }} new thought{{ newMessagesCount > 1 ? 's' : '' }}!
      </button>
    </div>

    <div id="scrollable-container" class="scrollable-container">
      <Message 
        v-for="item in items" 
        :key="item.updatedAt" 
        :sender-name="item.senderName"
        :text="item.text"
        :updated-at="item.updatedAt"
      />
      
      <div id="bottom"></div>
    </div>
  </div>
</template>

<style scoped>
img {
  max-width: 30px;
  max-height: 30px;
}

h1 {
  text-align: center;
  font-family: Brush Script MT, Brush Script Std, cursive;
  font-size: 30px;
}

.scrollable-container {
  width: 100%;
  max-height: 400px;
  overflow-y: auto;
  padding-bottom: 50px;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
  gap: 15px;
}

.scrollable-container .card {
  width: 80%;
  max-height: 100px;
  border-radius: 5px;
  margin-left: 35px;
}

.new-messages-count {
  text-align: center;
  font-size: 18px;
  margin-bottom: 10px;
  color: var(--clr-accent-500);
  font-weight: bold;
}

button {
  background-color: var(--clr-accent-500);
  color: white;
  padding: 10px 20px;
  font-size: 16px;
  border: none;
  cursor: pointer;
  border-radius: 5px;
}

button:hover {
  background-color: var(--clr-accent-300);
}
</style>
