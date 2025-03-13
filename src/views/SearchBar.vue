<script setup>
import { ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router'; 
import User from '../components/User.vue'
import { storeToRefs } from 'pinia';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore()
const { token} = storeToRefs(userStore)

const url = 'https://hap-app-api.azurewebsites.net/users';

const selectedField = ref('');
const fieldQuery = ref(''); 
const sortBy = ref('');
const skip = ref(''); 
const limit = ref('5'); 
const users = ref([]); 
const message = ref(''); 
//const token = localStorage.getItem('token'); 

const router = useRouter();
const route = useRoute();


watch(route, (newRoute, oldRoute) => {
  if (newRoute.name === 'userDetails') {
    resetForm();
  }
}, { immediate: true });

function resetForm() {
  selectedField.value = '';
  fieldQuery.value = '';
  sortBy.value = '';
  skip.value = '';
  limit.value = '5';
  users.value = [];
  message.value = '';
}

async function search() {
  console.log('Searching');

  let requestUrl = `${url}?`;

  if (selectedField.value && fieldQuery.value) {
    requestUrl += `search=${selectedField.value}:${fieldQuery.value}&`;
  }

  if (sortBy.value) {
    requestUrl += `sortBy=name:${encodeURIComponent(sortBy.value)}&`;
  }

  if (skip.value) {
    requestUrl += `skip=${encodeURIComponent(skip.value)}&`;
  }

  if (limit.value) {
    requestUrl += `limit=${encodeURIComponent(limit.value)}&`;
  }

  if (requestUrl.endsWith('&')) {
    requestUrl = requestUrl.slice(0, -1);
  }

  if (!token.value) {
    message.value = 'Something went wrong. Please try again!';
    return;
  }

  try {
    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.value}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 200) {
      const data = await response.json();
      users.value = data.map(user => ({
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.userName
      }));

      message.value = 'Search successful!';
    } else {
      message.value = 'Error fetching data!';
    }
  } catch (error) {
    message.value = 'An error occurred during search.';
  }
}

function viewUserDetails(userId, userName) {
  router.push(`/user/${userId}?name=${userName}`);
}

</script>

<template>
  <div class="search-container">
    <form @submit.prevent="search" class="search-form">
      <h1>Search Users</h1>

   
      <h4>SEARCH BY:</h4>
      <div class="search-field">
        <label>
          <input type="radio" v-model="selectedField" value="firstName" /> First Name
        </label>
        <label>
          <input type="radio" v-model="selectedField" value="lastName" /> Last Name
        </label>
        <label>
          <input type="radio" v-model="selectedField" value="userName" /> User Name
        </label>
      </div>

 
      <div class="search-field" v-if="selectedField">
        <input
          type="text"
          v-model="fieldQuery"
          placeholder="Enter search text"
          class="search-input"
        />
      </div>

   
      <div class="sort-fields">
        <h4>SORT BY:</h4>
        <div class="sort-options">
          <label>
            <input type="radio" v-model="sortBy" value="asc" /> Ascending
          </label>
          <label>
            <input type="radio" v-model="sortBy" value="desc" /> Descending
          </label>
        </div>
      </div>

  
      <div class="pagination-fields">
        <h4>SKIP:</h4>
        <input
          type="number"
          v-model="skip"
          class="pagination-input"
        />
        <h4>LIMIT:</h4>
        <input
          type="number"
          v-model="limit"
          placeholder="Limit (pagination)"
          class="pagination-input"
        />
      </div>


      <button type="submit" class="search-button">Search</button>
    </form>


    <div v-if="users.length > 0" class="user-list">
      <h1>Results:</h1>

  

    <div v-for="user in users" :key="user._id" class="user-item">
    <RouterLink :to="`user/${user._id}/${user.userName}`">
      {{ user.firstName }} {{ user.lastName }}
    </RouterLink>
    </div>
</div>
  </div>
</template>


<style scoped>

.search-container {
  padding: 20px;
  font-family: Arial, sans-serif;
}


.search-form {
    margin-top: 50px;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 600px;
  padding: 20px;
  border-radius: 8px;
  background-color: hsl(60, 1%, 17%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.search-form h2 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: hsl(0 0% 100%);
}

.search-field,
.sort-options {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 15px;
}

.search-field label,
.sort-options label {
  font-size: 16px;
}

.search-input {
  width: 100%;
  padding: 8px;
  font-size: 16px;
  border-radius: 4px;
  border: 1px solid #ccc;
}

.sort-fields label {
  font-size: 16px;
  margin-right: 10px;
}

.pagination-fields {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}

.pagination-fields input {
  margin-right: 10px;
}

.search-button {
  padding: 10px 15px;
  background-color: var(--clr-accent-100);
  color: white;
  font-size: 16px;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.search-button:hover {
  background-color:hsl(0, 0%, 9%);
}


.user-list {
  margin-top: 20px;
}

.user-item {
    text-align: center;
  padding: 8px;
  border-bottom: 1px solid hsl(0 0% 100%);
}

.user-item span {
  font-size: 16px;
  color: #333;
}

.user-link {
  display: block;
  font-size: 16px;
  color: #493e64;
  text-decoration: none;
}

.user-link:hover {
  text-decoration: underline;
}

p {
  margin-top: 20px;
  font-size: 18px;
  color: hsl(0 0% 100%);
}

h1 {
    color: white;
    text-align: center;
    font-family: Brush Script MT, Brush Script Std, cursive;
    font-size: 30px;
    margin: 10px;
}

h4 {
    color: white;
    text-align: center;
    margin: 5px;
}
</style>
