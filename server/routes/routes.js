const router = require('express').Router();
const Controller = require("../Controllers/FPTAIController");

router.post("/getMP3",Controller.getMP3)
router.post("/saveModel",Controller.saveModel)
router.post("/callbackurl",Controller.CallBackUrl)

module.exports = router;
