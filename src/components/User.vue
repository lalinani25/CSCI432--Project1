<script setup>

const props = defineProps({ firstName: String, lastName: String, userName: String })

</script>

<template>
    <div class="card">
        <h1 class="primary-heading"></h1>
        <span>Name: {{ firstName}} {{lastName }}</span>
        <span>Username: {{ userName }} </span>

    </div>

</template>

<style scoped>

h1{
    font-family: Brush Script MT, Brush Script Std, cursive;
    font-size: 20px;
}

.card {

    background-color: var(--clr-accent-300);
    color: var(--clr-neutral-100);

    width: 100%;
    min-height: 100px;

    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

</style>