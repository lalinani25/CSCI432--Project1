<script setup>
import { ref } from 'vue'
import Header from '../components/Header.vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const { setUser } = userStore

const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')
const userLoggedIn = ref(false)

async function signIn(e) {

	e.preventDefault()

	errorMessage.value = ''

	if (!email.value || !password.value) {

		errorMessage.value = "Please fill in all the required fields!"
		return;

	}

	const data = {
		 email: email.value, 
		 password: password.value }

	const url = 'https://hap-app-api.azurewebsites.net/user/login'

	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	}

	let response = await fetch(url, options)

	if (response.status === 200) {
		const data = await response.json()

		localStorage.setItem("token", data.token)
		console.log(data)
		console.log(data.token)
	
		const user = data.user
		console.log(user)
		
		const username = user.userName
		const firstname = user.firstName
		const lastname = user.lastName
		const email = user.email
		const token = data.token

		setUser(firstname, lastname, username, email, token)

		//localStorage.setItem('username', username);
		//localStorage.setItem('firstname', firstname);
		//localStorage.setItem('lastname', lastname);
		//localStorage.setItem('email', email);
	

		router.push(('/main'))
		
		userLoggedIn.value = true

		const userlog = userLoggedIn.value

		localStorage.setItem('userLog', userlog)
		console.log(localStorage.getItem('userLog'))
	}
	else if (response.status === 400) {
		errorMessage.value = "Invalid credentials. Please try again."
		console.log("Invalid email or password.")
	
		const userlog = userLoggedIn.value
		localStorage.setItem('userLog', userlog)
		console.log(localStorage.getItem('userLog'))
	}
}
</script>

<template>
	<Header>
		<nav>
			<RouterLink to="/">Home</RouterLink>
			<RouterLink to="/join">Join</RouterLink>
		</nav>
	</Header>

	<main class="padding-block-700">
		<div class=" container1">
		<section class="container center">
			<div id="form">
				<label for="email">Email</label>
				<input type="text" id="email" v-model="email" />

				<label for="password">Password</label>
				<input type="password" id="password" v-model="password" />

				<button class="button" @click="signIn">Sign In</button>

				<p v-if="errorMessage"> {{ errorMessage }}</p>
			</div>
		</section>

		<div class="static-part">
				<img src="/Background5.jpg" alt="Static Image" />
			</div>
		</div>
	</main>
</template>

<style scoped>
:deep(a) {
	text-decoration: none;
	color: hsl(0 0% 100%);
	margin: 20px;
}

main {
  height: 100vh;
}

.center {
  width: 100%;
  height: 40%;
  max-width: 350px;
  text-align: center;
  background-color: var(--clr-accent-500);
  padding: 20px;
  border-radius: 20px;
  box-shadow: 0 4px 8px var(--clr-accent-500);
}

.container1 {
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 100vh;
	flex-wrap: wrap;
	margin-top: -40px;
}

.static-part {
	width: 60%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
}

img {
	max-width: 100%;
	height: auto;
	object-fit: cover;
	width: 100%;
	height: 100%;
}
@media (max-width: 768px) {
  .container1 {
    flex-direction: column; 
    align-items: center;
    height: auto;
  }

  .form-container {
    width: 80%; 
    margin-bottom: 20px; 
  }

  .static-part {
    width: 80%; 
    margin-top: 20px; 
  }

  .static-part img {
    width: 80%; 
    height: auto; 
  }
}
</style>