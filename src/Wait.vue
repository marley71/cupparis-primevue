<template>
    <div v-show="visible" class="overlay-body" :style="'heigth:'+myHeight()">
    <span class="wait-msg" :class="msg=='...'?'':'text-lg font-bold'">
      {{ msg }}
    </span>
    </div>
</template>

<script>
import CrudCore from "./lib/CrudCore.js";

export default {
    name: 'Wait',
    mounted() {
        CrudCore.event().on('wait-start', this.waitStart);
        CrudCore.event().on('wait-end', this.waitEnd);
    },
    beforeUnmount() {
        CrudCore.event().off('wait-start', this.waitStart);
        CrudCore.event().off('wait-end', this.waitEnd);
    },
    data() {
        return {
            msg : '...',
            visible : false,
        }
    },
    methods: {
        myHeight() {
            let body = document.body;
            let html = document.documentElement;

            let height = Math.max(body.scrollHeight, body.offsetHeight,
                html.clientHeight, html.scrollHeight, html.offsetHeight);
            return height;
        },
        waitStart(options) {
            console.log('component wait start',options);
            this.msg = options? options.msg || '...':'...';
            this.visible = true;

        },
        waitEnd() {
            console.log('component wait end');
            this.msg = '';
            this.visible = false;
        },
    }
}
</script>

<style scoped>
.overlay-body {
    background-color: rgba(1, 1, 1, 0.3);
    bottom: 0;
    left: 0;
    position: fixed;
    right: 0;
    top: 0;
    z-index:100000;
    cursor : wait;
}
.overlay {
    background-color: rgba(1, 1, 1, 0.3);
    bottom: 0;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    z-index:100000;
    cursor : wait;
}

.wait-msg {
    position:absolute;
    width:100%;
    top:100px;
    text-align:center;
    color:white;
    font-size: 1.1em;
}
</style>
