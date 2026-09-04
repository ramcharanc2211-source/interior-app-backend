const router = require("express").Router();
const Message = require("../models/Message");
const { sendMessage } = require("../controllers/chatController");

router.post("/", async (req, res) => {
    const msg = await Message.create(req.body);
    res.json(msg);
});

module.exports = router;