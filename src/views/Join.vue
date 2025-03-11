<script setup>
import { ref } from 'vue'
import Header from '../components/Header.vue'
import { useRouter } from 'vue-router'
import validator from 'validator';


const router = useRouter()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const userName = ref('')
const password = ref('')
const confirmPassword = ref('')
const userLoggedIn = ref(false)

const errorMessage = ref('')

async function join(e) {

	e.preventDefault()

	errorMessage.value = ''

	
	if (!firstName.value || !lastName.value || !email.value || !userName.value || !password.value || !confirmPassword.value) {
		errorMessage.value = "Please fill in all the required fields!"
		return;
	}

	if(validator.isEmail(email.value) === false){
		errorMessage.value = "Please enter a valid email address!"
		return;
	}

	const p = password.value;

	if((p.length >= 8) === false){
		errorMessage.value = "Your password needs to be at least 8 characters!"
		return;
	}

	if (password.value !== confirmPassword.value) {
		errorMessage.value = "Passwords do not match! Please try again!"
		return;
	}


	const data = {
		email: email.value,
		password: password.value,
		firstName: firstName.value,
		userName: userName.value,
		lastName: lastName.value,
	}

	console.log(data)

	const jsonData = JSON.stringify(data)

	const url = 'https://hap-app-api.azurewebsites.net/user'

	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: jsonData,
	}

	console.log(url)
	console.log(options)

	let response = await fetch(url, options)

	console.log(response.status)

	if (response.status === 201) {
		const data = await response.json()

		localStorage.setItem("token", data.token)
		console.log(data)

		const user = data.user
		console.log(user)

		const username = user.userName
		const firstname = user.firstName
		const lastname = user.lastName
		const email = user.email

		localStorage.setItem('username', username);
		localStorage.setItem('firstname', firstname);
		localStorage.setItem('lastname', lastname);
		localStorage.setItem('email', email);

		userLoggedIn.value = true

		const userlog = userLoggedIn.value

		localStorage.setItem('userLog', userlog)
		console.log(localStorage.getItem('userLog'))

		router.push(('/main'))
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
			<RouterLink to="/signin">Sign In</RouterLink>
		</nav>
	</Header>

	<main class="padding-block-700">
		<div class=" container1">
			<section class="container center">
				<div id="form">
					<label for="first_name">First Name</label>
					<input type="text" id="firstName" v-model="firstName" />

					<label for="last_name">Last Name</label>
					<input type="text" id="lastName" v-model="lastName" />

					<label for="email">Email</label>
					<input type="email" id="email" v-model="email" />

					<label for="username">Username</label>
					<input type="text" id="username" v-model="userName" />

					<label for="password">Password</label>
					<input type="password" id="password" v-model="password" />

					<label for="confirm_password">Confirm Password</label>
					<input type="password" id="confirmPassword" v-model="confirmPassword" />

					<button class="button" @click="join">Join</button>

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
	margin: 20px;
}

main {
	height: 100vh;
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