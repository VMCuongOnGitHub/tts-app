import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

/* eslint-disable */
Vue.use(Vuex)

const stores = new Vuex.Store({
  state:{
    wordList: []
  },
  getters:{
    getWordList(state){
      console.log(state.wordList)
      return state.wordList
    }
  },
  mutations:{
    addTextToSpeechEditor(state, payload){
      state.wordList.push({wordID: payload[0], word: payload[1]})
    },
    readAs(state, payload){
      state.wordList.forEach(element => {
        if(element.wordID == payload[0]){
          element.readAs = payload[1]
          element.fileID = payload[2]
        }
      });
    }
  },
  actions:{
    addTextToSpeechEditor(context, data){
      return new Promise((resolve, reject) => {
        let payload = [data.wordID, data.word]
        // console.log(payload)
        context.commit('addTextToSpeechEditor', payload)
        resolve()
      })
    },
    readAs(context, data){
      return new Promise((resolve, reject) => {
        let payload = [data.wordID, data.wordReadAs]
        console.log(payload)
        context.commit('readAs', payload)
      })
    }


  }
})


export default stores
