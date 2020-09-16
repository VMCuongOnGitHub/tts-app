<template>
  <div id="speech-editor" style="margin-top:20px">
    <h6 class="text-left">{{word}}</h6>
    <input type="text" placeholder="Read as" v-model="wordReadAs"/>
    <button v-on:click="readAs(wordID, wordReadAs, fileID)">{{buttonChangeTitle}}</button>
    <button v-on:click="removeReadAs()">Remove</button>
  </div>
</template>

<script>
import axios from 'axios'
export default {
    name: 'SpeechEditor',
    data() {
      return {
        wordID: this.$attrs.wordID,
        word: this.$attrs.word,
        wordReadAs: this.wordReadAs,
        fileID : this.$attrs.fileID,
        buttonChangeTitle: "Change"
      }
    },
    methods:{
      readAs(wordID, wordReadAs, fileID){
        this.$store.dispatch("readAs", {
          wordID: wordID,
          wordReadAs: wordReadAs,
          fileID: fileID
        })
        this.buttonChangeTitle = "Unchange"
      }
    }
}
</script>

<style lang="">
</style>
