<script setup>
import { ref } from 'vue'

const showModal = ref(false)

defineExpose({
    open, close
})

function open() {
    showModal.value = true
}

function close(e) {
    console.log('on close')
    console.log('t: ' + e.target + ' ct: ' + e.currentTarget)
    showModal.value = false
}

</script>

<template>
    <div v-show="showModal" class="modal-backdrop" @click.self="close">
        <div class="modal">
            <header>
                <slot name="header"></slot>
                <img src ="/close.png"
                    class="modal-button" @click.stop="close" />
            </header>

            <main>
                <slot name="main"></slot>
            </main>

            <footer>
                <slot name="footer"></slot>
            </footer>
        </div>
    </div>
</template>

<style scoped>
.modal-backdrop {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: var(--modal-backdrop-clr);
    backdrop-filter: blur(10px);
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal {
    position: relative;
    justify-content: space-between;
    max-width: 500px;
    margin-bottom: 10px;
    background-color: hsl(60, 1%, 17%);
    border-radius: 10px;
    padding: var(--size-300);
}

header{
    background-color: hsla(60, 1%, 17%, 0);

}

.modal-button{
    width: 20px;
    height: 20px;
    cursor: pointer;
    margin-top: 20px;
    margin-left: 80px;
}
.modal-button:hover {
    background-color: var(--clr-accent-100);
    border-radius: 70%;
}

header {
    display: flex;
    margin-bottom: var(--size-100);
    justify-content: space-between;
}

footer {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: var(--size-400);
}

</style>