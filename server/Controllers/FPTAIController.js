const FPT_AI_API =  require("../APIs/fptai");
// use a map to save a lot of resolve()
const taskMap = new Map(); // biến đánh dấu trạng thái sync

exports.getMP3 = async (req,res) =>{
  const data = await FPT_AI_API.FPT_TTS(req.body.text, req.body.fileID)
  console.log(data)
  const result = await waitForCallback(data)
  res.status(200).json({"mp3":data})
}

exports.saveModel = (req,res) =>{
  FPT_AI_API.FPT_DICT_TTS(req.body.fileID, req.body.word, req.body.readAs)
  console.log(req.body.fileID)
}

const waitForCallback = (taskId) => { // hàm trung gian
    console.log("start waitForCallback")
    return new Promise((resolve, reject) => {
        const task = {};
        task.id = taskId; // khai báo biến này để check trạng thái
        task.onComplete = (data) => { // resolved
            resolve(data);
            console.log("Resolved process")
        };
        task.onError = (e) => {
            console.log(e)
            reject()
        };
        taskMap.set(task.id, task); // set taskMap để đợi đến khi callBackUrl xong
    });
};

exports.CallBackUrl = (req,res) =>{
  console.log("CallBackUrl is called")
  let result;
  let taskId = req.body.message
  if(req.body.success == true) {
      //success == true => file MP3 đã sẵn sàng
      result = "solved"
  }else result = "rejected"
  //báo complete để trả về resolve cho waitForCallback
  console.log("Received Callback")
  taskMap.get(taskId).onComplete(result);
  console.log("Completed Callback")
  //clean
  taskMap.delete(taskId);
}

exports.getMp3WithTimestamp = (req,res) =>{

}
