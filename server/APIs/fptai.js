const rq = require('request');
const { resolve } = require('path');

exports.FPT_TTS = (text, fileID) => {
  return promise = new Promise((resolve,reject)=>{
    const options = {
      url: 'https://api.fpt.ai/hmi/tts/v5',
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Accept-Charset': 'utf-8',
          'User-Agent': 'my-reddit-client',
          'api-key': process.env.FPT_AI_KEY_API,
          'voice': process.env.FPT_AI_VOICE,
          'callback_url': process.env.CALLBACK_URL,
          'custom_model' : fileID
      },
      body: text
  };
  rq(options, function(err, res, body) {
      if(err) {console.log(err);
      reject(err);
    }
      else {
        let data = JSON.parse(res.body)
        data = data.async
        resolve(data)
      }
  });
});
}


exports.FPT_DICT_TTS = (fileID, word, readAs) => {
  return promise = new Promise((resolve,reject)=>{
    const options = {
      url: 'https://api.fpt.ai/hmi/tts/model/' + fileID + '/entry',
      method: 'POST',
      headers: {
        'api-key': process.env.FPT_AI_KEY_API,
        'Content-Type': 'application/json'
      },
      body: {
        'model' : fileID,
        'text' : word,
        'pronounce' : readAs
      },
      json: true
    }
    rq(options, (err, res, body) => {
      if(err) {
        console.log("error")
        reject(err)
      } else {
        let data = res.body
        data = data.message
        resolve(data)
      }
    })

  })
}
