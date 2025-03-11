<script setup>
import Header from '../components/Header.vue'
import Logo from '../components/Logo.vue'

</script>

<template>
    <Header>
        <nav>
            <RouterLink to="/join">Join</RouterLink>
            <RouterLink to="/signin">Sign In</RouterLink>
        </nav>
    </Header>

    <main class="padding-block-700">
        <section class="container center vertical" id="homepage">
            <img src="/Aestheticos.png">
            <p>Life is better with Aesthetics in it!</p>
        </section>
    </main>
</template>

<style scoped>

:deep(a) {
    text-decoration: none;
    margin: 20px;
}

img {
   
   max-width: 400px;
}

</style>