const router = require("express").Router();
const { addMessage, getMessages } = require("../controllers/messageController");

router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);

module.exports = router;
