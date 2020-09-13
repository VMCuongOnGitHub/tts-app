<template>
  <div id="qna">
    <div class="container-fluid dashboard">
      <div class="row">
        <div class="col-lg-4 col-sm">
          <div v-for="word in wordList" :key="word.wordID">
            <!-- <div>{{word.word}}</div> -->
            <SpeechEditor v-bind:wordID=word.wordID v-bind:word=word.word v-bind:fileID=fileID></SpeechEditor>
          </div>
          <!-- <SpeechEditor v-bind:words="selectedWord.words"/> -->
        </div>
        <div class="col-lg-8 col-sm">
            <div class="card" id="search">
              <!-- <input v-model="valueSearch" v-on:change="onChangedSearch()" type="text" debounce="500" placeholder="Search Text" id="keyword-input" />
              <button v-on:click="onChangedSearch(valueSearch)">Search</button> -->
            </div>

            <div class="col-lg-12 col-sm">
              <div class="card" id="maker">
                <center>
                  <h4 id="title">Type your text here</h4>
                </center>
                <textarea
                  id="sel"
                  style="border:1px solid black; min-height:30vh"
                  v-model="textInput"
                  v-on:change="onChangedTextArea()"
                ></textarea>

                <div @mouseup="textToSpans()">{{textInput}}</div>

                <div class="row justify-content-md-center">
                  <div class="col-md-auto" id="btn-submit">
                    <button @click="sendMsg()">Submit</button>
                  </div>
                </div>

              </div>
            </div>
        </div>

        <div class="col-lg col-sm">
            <div class="card" id="qoutes">
                <div class="card-body">
                    <div class="media align-items-center">
                        <div class="media-body">
                          <aplayer autoplay
                            :music="{
                              title: isReady?'READY TO HEAR':'NOT AVAILABLE',
                              artist: 'FPT AI',
                              src: voicerecord,
                              pic: 'https://moeplayer.b0.upaiyun.com/aplayer/secretbase.jpg',
                              theme:isReady?'rgb(65, 184, 131)':'tomato'
                            }"
                          />

                        </div>
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

      <div class="row">

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
import Aplayer from 'vue-aplayer'
import SpeechEditor from './SpeechEditor'
import { mapGetters } from 'vuex'

export default {
  name: 'MainDashboard',
  components : {
    HighlightableInput,
    Aplayer,
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
      wordList: [],
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
      let selection_text = selection.toString()
      let genID = Date.now().toString()

      this.$store.dispatch('addTextToSpeechEditor',{
        word : selection_text,
        wordID: genID
      }).then(response => {
          let span = document.createElement('SPAN');
          span.textContent = selection_text;

          let range = selection.getRangeAt(0)
          range.deleteContents()
          range.insertNode(span)

          this.wordList = this.$store.getters.getWordList
      })
    },
    sendMsg(){
      axios.post(`http://localhost:3000/getMP3`,{
          text: this.textInput,
          fileID: this.fileID
      })
      .then( response => {
        // console.log("delayed")
        this.voicerecord = response.data.mp3
        this.isReady =  true
      })
      .catch(e => {
        console.log(e)
      })
    },
    onChangedTextArea(){
      let genID = Date.now().toString()
      this.fileID = genID
    }


  }
}
</script>
<style lang="">
  *:focus{
      -webkit-box-shadow: none!important;
      box-shadow: none!important;
      outline: 0;
  }

  #qna {
      margin-top: 10px;
  }

  #search {
      padding: 10px;
  }

  #title {
      margin-top: 10px;
      margin-bottom: 20px;
  }

  .form-search {
      display: inline-block;
  }

  .form-search input {
      width: 90%;
  }

  #keyword-input {
      background-color: #dfe6e9;
  }

  #keyword-input:enabled {
      background-color: white;
  }

  input#keyword-input {
      margin-bottom: 10px;
  }

  #search button {
      width: 100%;
      /* background-color: #F76B1C;
      background-image: linear-gradient(90deg, #F76B1C 0%, #FAD961 100%);     */
      background-color: tomato;
      border: none;
  }

  #search button:hover {
      background-color: #f9e41a;
      color: black;
      /* background-color: #FAD961;
      background-image: linear-gradient(90deg, #FAD961 0%, #F76B1C 100%);    */
  }

  #search button:focus {
      -webkit-box-shadow: none!important;
      box-shadow: none!important;
      outline: 0;
  }

  #qoutes {
      padding: 13px;
  }

  #maker {
      padding-top: 10px;
      padding-right: 20px;
      padding-left: 20px;
      padding-bottom: 20px;
  }

  #preview {
      padding-right: 20px;
      padding-left: 20px;
      padding-bottom: 20px;
  }

  .my-0 textarea {
      margin-bottom: 10px;
  }

  .my-1 input{
      margin-bottom: 10px;
  }

  #btn-submit {
      margin-top: 50px;
      margin-bottom: 20px;
  }

  #btn-submit button {
      width: 200px;
      /* background-color: #F76B1C;
      background-image: linear-gradient(90deg, #F76B1C 0%, #FAD961 100%);     */
      background-color: tomato;
      border: none;
  }

  #btn-submit button:hover {
      background-color: #f9e41a;
      color: black;
      /* background-color: #FAD961;
      background-image: linear-gradient(90deg, #FAD961 0%, #F76B1C 100%);  */
  }

  button#openMessages {
      cursor: pointer;
      position: fixed;
      bottom: 23px;
      right: 28px;

      width: 60px;
      height: 60px;
      border-radius: 100%;

      /* background-color: #F76B1C;
      background-image: linear-gradient(90deg, #F76B1C 0%, #FAD961 100%); */
      background-color: tomato;
      border: none;
  }

  .messages {
      cursor: pointer;
      position: fixed;
      bottom: 23px;
      right: 28px;
  }

  button#openMessages i {
      font-size: 30px;
  }

  #box-mess {
      width: 300px;
      height: 400px;
      background-color: white;
      margin-bottom: 70px;
      border-radius: 10px;
  }

  #title-box {
      width: 100%;
      height: 40px;
      background-color: tomato;
      color: white;
      border-top-right-radius: 10px;
      border-top-left-radius: 10px;
      text-indent: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      height: 10%;
  }

  #show-mess {
      height: 80%;
      overflow: hidden;
      border-bottom: 1px solid #e8e8e8;
  }

  #send {
      height: 10%;
      width: 100%;
      padding: 0;
      margin: 0;
  }

  #send button {
      border-radius: 0%;
      border-bottom-right-radius: 10px;
      border-top-right-radius: 10px;
      background-color: tomato;
      border: none;
  }

  #send button:hover {
      background-color: #f9e41a;
  }

  #send button:hover i {
      color: #000;
  }

  #send input {
      border: none;
  }

  #show-mess {
      overflow-y: scroll;
  }

  .bot-send {
      margin-right: 10px;
      margin-left: 10px;
      margin-top: 10px;
      background-color: #ecf0f1;
      padding-top: 10px;
      padding-bottom: 10px;
      border-radius: 10px;
  }

  .bot-send img {
      width: 100%;
      border-radius: 100%;
  }

  .ava.col-3 {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-left: 10px;
  }

  .ava-people.col-3 {
      display: flex;
      align-items: center;
      justify-content: center;
  }

  .text.col-9 {
      margin-top: auto 0;
  }

  .people-text.col-9 {
      margin-top: auto 0;
  }

  .text p {
      padding: 0;
      margin: 0;
  }

  .people-text p {
      margin: 0;
      padding: 0;
  }

  .people-send {
      margin-right: 10px;
      margin-left: 10px;
      margin-top: 10px;
      background-color: #ecf0f1;
      padding-top: 10px;
      padding-bottom: 10px;
      border-radius: 10px;
  }

  .people-send img {
      width: 100%;
      border-radius: 100%;
  }

  .people-text {
      margin: 10px;
  }

  .question-list {
      height: 620px;
      overflow-y: scroll;
  }

  .question-list td {
      word-wrap:break-word;
  }
</style>
