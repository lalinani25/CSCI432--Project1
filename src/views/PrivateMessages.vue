<script setup>
import { useRouter } from 'vue-router';
import { useRoute } from 'vue-router';
import { ref, onMounted, nextTick } from 'vue';
import PrivateMessage from '@/components/PrivateMessage.vue';

const router = useRouter();
const route = useRoute();
const token = localStorage.getItem('token');
const userId = route.params.userId;

const items = ref([]);
const firstFetchedDate = ref(null);
const time = ref();
const newMessagesCount = ref(0);
let hasFetchedNewMessages = ref(false);

const seenMessages = new Set();
let isFetching = false; 

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString("en-US", { timeZone: 'America/New_York' }) + " EST";
};

const currentTime = new Date().toISOString();

const fetchData = async (date) => {
  if (isFetching) return; 
  isFetching = true;

  const formattedDate = date || `before=${firstFetchedDate.value || currentTime}`;
  let url = `https://hap-app-api.azurewebsites.net/messages/${userId}?${formattedDate}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();

      if (data.length > 0) {
        const newMessages = data.filter(item => !seenMessages.has(item.updatedAt));

        if (newMessages.length > 0) {
          newMessages.forEach(item => seenMessages.add(item.updatedAt));

          items.value = [
            ...newMessages.map(item => ({
              senderName: item.senderName,
              text: item.text,
              updatedAt: formatDate(item.updatedAt),
            })),
            ...items.value,  
          ];

          time.value = newMessages[0].updatedAt;
          firstFetchedDate.value = newMessages[newMessages.length - 1].updatedAt;
        }
      }
    } else {
      console.log("Error: An error occurred while fetching data");
    }
  } catch (error) {
    console.log("Error: " + error.message);
  } finally {
    isFetching = false; 
  }
};

const loadNewMessages = async () => {
  if (isFetching) return;
  isFetching = true;

  let url = `https://hap-app-api.azurewebsites.net/messages/${userId}?after=${time.value}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (response.ok) {
      const data = await response.json();

      if (data.length > 0) {
        const newMessages = data.filter(item => !seenMessages.has(item.updatedAt));

        if (newMessages.length > 0) {
          newMessages.forEach(item => seenMessages.add(item.updatedAt));

          items.value = [
        
            ...newMessages.map(item => ({
              senderName: item.senderName,
              text: item.text,
              updatedAt: formatDate(item.updatedAt),
            })), 
            ...items.value,
          ];

          time.value = newMessages[0].updatedAt;
          firstFetchedDate.value = newMessages[newMessages.length - 1].updatedAt;
        }
      }
    } else {
      console.log("Error: An error occurred while fetching new messages");
    }
  } catch (error) {
    console.log("Error: " + error.message);
  } finally {
    isFetching = false; 
  }
};

const fetchNewMessagesCount = async () => {
  const newCount = await countNewMessages();
  newMessagesCount.value = newCount;
};

const countNewMessages = async () => {
  let url = `https://hap-app-api.azurewebsites.net/messages/${userId}/count?after=${time.value || currentTime}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`,
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

let observer;
const loadMoreMessages = async (entry) => {
  if (entry.isIntersecting && !isFetching) {
    await fetchData();
  }
};

onMounted(() => {
  fetchData();

  const options = {
    root: document.querySelector('#scrollable-container'),
    rootMargin: '0px',
    threshold: 1.0,
  };

  observer = new IntersectionObserver(([entry]) => loadMoreMessages(entry), options);

  const target = document.querySelector('#bottom');
  if (target) {
    observer.observe(target);
  }

  fetchNewMessagesCount();
  setInterval(fetchNewMessagesCount, 5000); 
});
</script>

<template>
  <div class="flex justify-center align-center">
    <div class="flex align-center" @click="router.back()">
      <img src="/leftArrow.png" class="icon back-button" />
    </div>
    <h1>Read Messages</h1>

    <div v-if="newMessagesCount > 0" class="new-messages-count">
      <button @click="loadNewMessages">
        {{ newMessagesCount }} new message{{ newMessagesCount > 1 ? 's' : '' }}!
      </button>
    </div>

    <div id="scrollable-container" class="scrollable-container">
      <div v-if="items.length === 0">You do not have any messages!</div>

      <PrivateMessage
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
