<template>
  <input type="hidden" :name="name" v-model="value"/>
  <Editor v-show="!showHtml" v-model="value" :modules="modules"
          :placeholder="placeholder"
          @text-change="_change" editorStyle="height: 320px" @load="addHtmlButton">
    <template #toolbar>
      <div></div> <!-- mi serve per nascondere la toolbar di default -->
    </template>
    {{value}}
  </Editor>
  <div v-show="showHtml">
    <ssh-pre language="html" label="Sorgente Html" :editable="true" :copy-button="true" @copied="saveHtml" style="height: 320px">
      <template #copy-button>
        Salva
      </template>
      <div class="mt-5">
        {{value}}
      </div>
    </ssh-pre>

  </div>
</template>

<script>
import _wEditor from '../../widgets/_wEditor.vue'
import Editor from 'primevue/editor';
import SshPre from 'simple-syntax-highlighter'
import 'simple-syntax-highlighter/dist/sshpre.css'

export default {
  name: "wBase",
  extends: _wEditor,
  components : {Editor,SshPre},
}
</script>



<style scoped>

</style>
