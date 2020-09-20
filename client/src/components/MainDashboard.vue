<template>
  <div id="main-dashboard">
    <div class="container-fluid" style="background-color: #1d6bdf; height:50px"></div>
    <div style="height:50px" id="header-title">
      <!-- <img src="../assets/icon-tts.png"/> -->
      <h5>TTS Advanced</h5>
    </div>

    <div class="container-fluid">
      <div class="row" style="width:100%">
        <div class="col-md-4" style="height: 60px">
          <div>
            <input
                style="border:1px solid black"
                v-model="textInput"
                v-on:change="onChangedTextArea()"
                id="processInput"
                class="col-md-8"
            />
            <button style="height: 40px;width: 80px" class="col-md-4">Process</button>
          </div>
          <hr style="margin-top:0px">
          <div v-for="word in wordList" :key="word.wordID">
            <SpeechEditor v-bind:wordID=word.wordID v-bind:word=word.word v-bind:fileID=fileID></SpeechEditor>
          </div>
        </div>
        <div class="col-md-8">
          <!-- <div style="height: 60px">
            <h6 style="float:left;margin: 20px 0px 20px 5px">Content:</h6>
            <input v-model="valueSearch" v-on:change="onChangedSearch()" type="text" placeholder="Search Text" id="keyword-input" />
          </div> -->

          <div>
            <div class="card" id="maker">
              <div @mouseup="textToSpans()" style="height:550px; text-align: left">{{textInput}}</div>

              <div class="row justify-content-md-center">
                <div class="col-md-auto" id="btn-submit">
                  <button @click="sendRequest()">Listen</button>
                </div>
              </div>

              <audio controls ref="foo" :src=voicerecord>
              </audio>
              <h1>hello</h1>
              <av-waveform
                ref-link="foo"
                :audio-controls="true"
                :playtime-clickable="true"
                :canv-width="800"
                :canv-height="200"
              />


              <!-- <av-line ref-link="foo" /> -->
                <!-- <div class="text-center" style="margin-left:20px">
                          <b-button size="h1" class="mb-2" :letiant="isReady?'success':'secondary'" v-on:click="$router.push(voicerecord)">
                            <b-icon icon="cloud-download" aria-hidden="true"></b-icon>
                          </b-button>
                      </div> -->
            </div>
          </div>
        </div>

      </div>
    </div>

    <b-modal id="modal-spinner" title="BootstrapVue" hide-footer hide-header no-close-on-backdrop no-close-on-esc >
      <div>
        <b-spinner label="Loading..."></b-spinner>
      </div>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios'
import HighlightableInput from 'vue-highlightable-input'
import AudioVisual from 'vue-audio-visual'
import SpeechEditor from './SpeechEditor'
import { mapGetters } from 'vuex'

export default {
  name: 'MainDashboard',
  components : {
    HighlightableInput,
    AudioVisual,
    SpeechEditor
  },
  data() {
    return {
      readAsValue:'',
      box: false,
      textSend: '',
      voicerecord:'',
      textInput: '',
      isReady:false,
      highlight: [],
      highlightEnabled: true,
      wordList: this.$store.getters.getWordList,
      fileID: '',
    }
  },
  methods:{
    onChangedSearch(value)
    {
      let randomColor = 'background-color:#'+(Math.random()*0xFFFFFF<<0).toString(16);
      this.highlight.push({text:value, style:randomColor})
    },
    readAs(oldValue, value){
      console.log(oldValue + " read as " + value)
    },
    textToSpans() {
      let selection = (document.all) ? document.selection.createRange().text : document.getSelection();
      let selection_text = selection.toString().trim()
      let genID = Date.now().toString()

      if(selection_text !== "" && selection_text !== " "){
        this.$store.dispatch('addTextToSpeechEditor',{
          word : selection_text,
          wordID: genID
      }).then(response => {
          let span = document.createElement('SPAN');
          span.style.cssText = "background-color: #1d6bdf; height:20px"
          span.textContent = selection_text;

          let range = selection.getRangeAt(0)
          range.deleteContents()
          range.insertNode(span)

          this.wordList = this.$store.getters.getWordList
      })
      }

    },
    onChangedTextArea(){
      let genID = Date.now().toString()
      this.fileID = genID
    },
    getVoice(voiceResponse){
      let interval = setInterval(() => {
        axios.get(voiceResponse).then(() => {
          this.voicerecord = voiceResponse
          clearInterval(interval)
        })
      }, 5000)
    },
    sendRequest(){
      var itemsProcessed = 0
      this.wordList = this.$store.getters.getWordList
      if(this.wordList.length > 0){
        this.wordList.forEach(element => {
          console.log(element.readAs)
          axios.post('http://localhost:3000/saveModel',{
            fileID: this.fileID,
            word: element.word,
            readAs: element.readAs
          })
          itemsProcessed++
          if(itemsProcessed == this.wordList.length){
            axios.post('http://localhost:3000/getMP3',{
              text: this.textInput,
              fileID: this.fileID
            })
            .then( response => {
              this.voicerecord = response.data.mp3
              // alert(this.voicerecord)
              this.isReady = true
              this.$bvModal.hide('modal-spinner')
            })
            .catch(e => {
              this.errors.push(e)
            })
          }
        })
      }else{
        axios.post('http://localhost:3000/getMP3',{
              text: this.textInput,
              fileID: this.fileID
            })
            .then( response => {

              axios.post('http://localhost:3000/callbackurl',{
                message: response.data.mp3,
                success: "true"
              }).then( response => {
                this.voicerecord = response.data.mp3
                alert(this.voicerecord)
                this.isReady = true
                this.$bvModal.hide('modal-spinner')
              }).catch(error => {
                this.errors.push(error)
              })

            })
            .catch(e => {
              this.errors.push(e)
            })
      }


    }

  }
}
</script>
<style lang="">
  #header-title img{
    margin: 18px 0px 20px 20px;
    height:20px;
    width:40px;
    float:left
  }
  #header-title h5{
    margin: 15px 0px 15px 5px;
    font-weight:bold;
    font-size:24px;
    float:left
  }
  #keyword-input{
    width: 300px;
    height: 40px;
    float: right;
    margin: 10px 0px 10px 0px;
  }
  #processInput{
    width: 300px;
    height: 40px;
    margin: 10px 0px 10px 0px;
  }
</style>
