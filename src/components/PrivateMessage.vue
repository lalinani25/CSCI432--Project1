<script setup>

const props = defineProps({ senderName: String, updatedAt: Date, text: String })

</script>

<template>
    <div class="card">
        <h1 class="primary-heading">Message:</h1>
        <span>on {{ updatedAt }}</span>
        <span>{{ text }}</span>
        <h1>by {{ senderName }} </h1>
      

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