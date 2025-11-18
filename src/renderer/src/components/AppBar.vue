<script setup lang="ts">
function on_minimize() {
    window.ipcRenderer.send("app:minimize", {});
}
function on_cropsquare() {
    window.ipcRenderer.send("app:cropsquare", {});
}
function on_close() {
    // window.ipcRenderer.send("app:close", {});
    window.ipcRenderer.send("app:hide", {});

}
function on_mouse_down() {
    window.ipcRenderer.send("app:windows_drag_start", {});

}
function on_mouse_up() {
    window.ipcRenderer.send("app:windows_drag_end", {});
}
</script>

<template>
    <div class="flex bg-red-50 select-none w-full place-content-between" v-on:mouseup.self="on_mouse_up()"
        v-on:mousedown.self="on_mouse_down()">
        <div class="pl-5">
            App
        </div>

        <div class="flex justify-end gap-1">
            <div @click.stop="on_minimize()">mini</div>
            <div class="app-bar-button" @click.stop="on_cropsquare()">
                crop
            </div>
            <div class="app-bar-button-close" @click.stop="on_close()">close</div>
        </div>

    </div>

</template>
<style>
.app-bar-button {
    transition: all ease-in-out 0.2s;

}

.app-bar-button:hover {
    background-color: rgb(195, 205, 232);
}

.app-bar-button-close {
    transition: all ease-in-out 0.2s;
}

.app-bar-button-close:hover {
    background-color: rgb(248, 50, 50);
}


.btn {
    color: white;
    user-select: none;
    text-align: center;
    background-color: rgb(255, 0, 0);
    width: 4rem;
    height: 1.5rem;
    margin: 2px;
    border-radius: 4px;
}

.btn:hover {
    background-color: rgb(245, 103, 103);
}
</style>