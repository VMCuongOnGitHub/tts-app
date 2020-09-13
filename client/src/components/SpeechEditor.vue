<template>
  <div id="speech-editor">
    <h3>{{word}}</h3>
    <input type="text" placeholder="Read as" v-model="wordReadAs"/>
    <button v-on:click="readAs(wordID, wordReadAs, fileID)">Change</button>
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
        fileID : this.$attrs.fileID
      }
    },
    methods:{
      readAs(wordID, wordReadAs, fileID){
        this.$store.dispatch("readAs", {
          wordID: wordID,
          wordReadAs: wordReadAs,
          fileID: fileID
        })
        axios.post(`http://localhost:3000/saveModel`,{
          fileID: fileID,
          word: this.word,
          readAs: wordReadAs
        }).then(()=>{
          console.log('hello')
        })
      }
    }
}
</script>

<style lang="">
</style>
