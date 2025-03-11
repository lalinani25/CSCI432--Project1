<script setup>
import { useRouter } from 'vue-router'
import { ref, useTemplateRef } from 'vue'
import Toast from '@/components/Toast.vue';
import Modal from '@/components/Modal.vue';
import { onMounted } from 'vue';

const router = useRouter();

const token = localStorage.getItem('token');

const username = ref('');
const firstname = ref('');
const lastname = ref('');
const email = ref('');
const password = ref('');
const message = ref('');

const url = "https://hap-app-api.azurewebsites.net/user";

const fetchData = async () => {
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data);

            username.value = data.userName;
            firstname.value = data.firstName;
            lastname.value = data.lastName;
            email.value = data.email;
            password.value = data.password;
        } else {
            message.value = "Error: An error occurred while fetching data";
        }
    } catch (error) {
        message.value = "Error: " + error.message;
    }
};

onMounted(() => {
    fetchData();
});

const modal = useTemplateRef('name-modal');

function cancel(e) {
    message.value = '';
    modal.value.close(e); 
}

async function editProfile(e) {
    const userData = {
        firstName: firstname.value,
        lastName: lastname.value,
        userName: username.value,
        password: password.value,
        email: email.value
    };

    const options = {
        method: "PATCH",
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(userData)
    };

    try {
        const response = await fetch(url, options);

        if (response.ok) {
            message.value = 'Profile Updated!';
            
            localStorage.setItem('username', userData.userName);
            localStorage.setItem('firstName', userData.firstName);
            localStorage.setItem('lastName', userData.lastName);
            localStorage.setItem('email', userData.email);

            username.value = userData.userName;
            firstname.value = userData.firstName;
            lastname.value = userData.lastName;
            email.value = userData.email;
            password.value = userData.password
            message.value = '';
            modal.value.close(e)

        } else {
            const errorData = await response.json();
            message.value = "Error: " + errorData.message;
        }
    } catch (error) {
        console.error('Error during fetch:', error);
        message.value = 'Error with request';
    }
}
</script>

<template>
    <div class="flex justify-center align-center">

        <div class="flex align-center" @click="router.back()">
            <img src="/leftArrow.png" class="icon back-button" />
        </div>

        <div class="flex align-left" @click="modal.open()">
            <img src="/edit.png" class="edit-button" />
        </div>

        <h1 class="primary-heading">My Profile</h1>

        <div class="container">
            <fieldset id="profile-fieldset">
                <legend>Username</legend>
                <p>{{ username }}</p>
            </fieldset>

            <fieldset id="profile-fieldset">
                <legend>First Name</legend>
                <p>{{ firstname }}</p>
            </fieldset>

            <fieldset id="profile-fieldset">
                <legend>Last Name</legend>
                <p>{{ lastname }}</p>
            </fieldset>

            <fieldset id="profile-fieldset">
                <legend>Email</legend>
                <p>{{ email }}</p>
            </fieldset>

        </div>

        <Toast :message="message" />

        <Modal ref="name-modal">
            <template #header>
                <h2 class="primary-heading">Edit Profile</h2>
            </template>

            <template #main>
                <fieldset id="modal-fieldset">
                    <legend>Username</legend>
                <input v-model="username" type="text" placeholder="Username" />
            </fieldset>
            <fieldset id="modal-fieldset">
                <legend>First Name</legend>
                <input v-model="firstname" type="text" placeholder="First Name" />
            </fieldset>
            <fieldset id="modal-fieldset">
                <legend>Last Name</legend>
                <input v-model="lastname" type="text" placeholder="Last Name" />
            </fieldset>
            <fieldset id="modal-fieldset">
                <legend>Email</legend>
                <input v-model="email" type="text" placeholder="Email" />
            </fieldset>
            <fieldset id="modal-fieldset">
                <legend>Password</legend>
                <input v-model="password" type="password" placeholder="Reset Your Password" />
            </fieldset>

            <p v-if="message">{{ message }}</p> 
            </template>

            <template #footer>
                <button @click.stop="cancel" id ="cancel-button">Cancel</button>
                <button @click.stop="editProfile" id ="save-button">Save</button>
            </template>
        </Modal>
    </div>
</template>


<style scoped>
h1 {
    color: white;
    text-align: center;
    text-align: center;
    font-family: Brush Script MT, Brush Script Std, cursive;
    font-size: 30px;
    margin: 10px;
}

h2{
    color: white;
    font-family: Brush Script MT, Brush Script Std, cursive;
    font-size: 30px;
    margin: 10px;
    margin-left: 110px;
}

p {
    margin-left: 15px;
}

.container {
    align-items: center;
}

#profile-fieldset {
    position: relative;
    justify-content: space-between;
    max-width: 300px;
    margin-bottom: 10px;
    padding: 5px;
    background-color: hsl(60, 1%, 17%);
    border-radius: 5px;
}

#modal-fieldset{
    max-width: 500px;
    background-color: hsl(60, 1%, 17%);
    border-radius: 5px;
    padding: 5px;
}

legend {
    font-weight: 600;
    color: hsl(0, 1%, 70%);
    margin-left: 10px;
}

img {
    max-width: 30px;
    max-height: 30px;
}

.edit_profile {
    font-weight: 600;
    color: hsl(0, 1%, 70%);
    margin-left: 10px;
}

.edit-button{
    margin-left: 340px;
    margin-top: -30px;
}

#save-button{
    padding: 10px 20px;
  background-color: var(--clr-accent-100);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  width: 40%;
}

#save-button:hover{
    background-color: hsl(0, 3%, 7%);
}

#cancel-button{
    padding: 10px 20px;
  background-color: var(--clr-accent-100);
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  width: 40%;
  margin-right: 15px;
}

#cancel-button:hover{
    background-color: hsl(0, 3%, 7%);
}

</style>