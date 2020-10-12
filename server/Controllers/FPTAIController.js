const { length } = require("file-loader");
const FPT_AI_API =  require("../APIs/fptai");
const https = require('https');
const fs = require('fs');
const { log } = require("console");
// use a map to save a lot of resolve()
const taskMap = new Map(); // biến đánh dấu trạng thái sync

function getQuotient(dividend, divisor){
  let remainder = dividend % divisor
  return (dividend - remainder) / divisor
}
function idAutoGen(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

exports.getMP3 = async (req,res) =>{
  let breakAt = 50
  let textInput = req.body.text
  let textInputArray = textInput.split(" ")
  let quotientOfArrayLength = getQuotient(textInputArray.length, breakAt)
  let poolOfTextInputUnderFiveThousand = []
  let poolOfTextDataUnderFiveThousand = []
  let uniqueForderForAudioFiles = ''
  let audioData = ""
  let callBackResult = ""
  let finalMP3 = ""

  console.log(textInputArray.length)

  if(quotientOfArrayLength > 0){
    uniqueForderForAudioFiles = idAutoGen(10)
    if (!fs.existsSync("mp3Files/" + uniqueForderForAudioFiles)){
      fs.mkdirSync("mp3Files/" + uniqueForderForAudioFiles)
    }

    while (quotientOfArrayLength > 0) {
      for (let i = breakAt; i > 0; i--) {
        // console.log(textInputArray[i])
        if (textInputArray[i].includes(",") || textInputArray[i].includes(".")) {
          poolOfTextInputUnderFiveThousand.push(textInputArray.slice(0, i+1).join(" "))
          textInputArray = textInputArray.slice(i+1, textInputArray.length-1)
          break
        }
      }
      quotientOfArrayLength--
    }
    poolOfTextInputUnderFiveThousand.push(textInputArray.join(" "))

    for (let i = 0; i < poolOfTextInputUnderFiveThousand.length; i++) {
      audioData = await FPT_AI_API.FPT_TTS(poolOfTextInputUnderFiveThousand[i], req.body.fileID)
      // callBackResult = await waitForCallback(audioData)
      poolOfTextDataUnderFiveThousand.push(audioData)

    }
    console.log(poolOfTextDataUnderFiveThousand);

    for (let i = 0; i < poolOfTextDataUnderFiveThousand.length; i++) {
      var file = fs.createWriteStream("mp3Files/" + uniqueForderForAudioFiles + "/file" + i + ".mp3");
      var request = https.get(poolOfTextDataUnderFiveThousand[i], function(response) {
        response.pipe(file)
      })
      fs.open("mp3Files/" + uniqueForderForAudioFiles + "/file" + i + ".mp3", 'r', function(status, fd) {
          if (status) {
              console.log(status.message);
              return;
          }
          var buffer = Buffer.alloc(100);
          fs.read(fd, buffer, 0, 100, 0, function(err, num) {
              console.log(buffer.toString('utf8', 0, num));
          });
      });
    }

  }else{
    const data = await FPT_AI_API.FPT_TTS(req.body.text, req.body.fileID)
    // console.log(data)
    const result = await waitForCallback(data)
    // console.log(result)
    res.status(200).json({"mp3":data})
  }
}

exports.saveModel = (req,res) =>{
  FPT_AI_API.FPT_DICT_TTS(req.body.fileID, req.body.word, req.body.readAs)
  console.log(req.body.fileID)
}

const waitForCallback = (taskId) => { // hàm trung gian
  console.log("start waitForCallback")
  return new Promise((resolve, reject) => {
    const task = {}
    task.id = taskId // khai báo biến này để check trạng thái

    task.onComplete = (data) => { // resolved
        resolve(data)
        console.log("Resolved process")
    }
    task.onError = () => {
        reject();
    }
    taskMap.set(task.id, task); // set taskMap để đợi đến khi callBackUrl xong
  });
};

exports.CallBackUrl = (req,res) =>{
  console.log("CallBackUrl is called")
  let result;
  let taskId = req.body.message

  if(req.body.success == "true") {
    //success == true => file MP3 đã sẵn sàng
    result = "solved"
    console.log("solve")
  } else result = "rejected"
  //báo complete để trả về resolve cho waitForCallback
  console.log("Received Callback")
  taskMap.get(taskId).onComplete(result);
  console.log("Completed Callback")
  //clean
  taskMap.delete(taskId);
}
