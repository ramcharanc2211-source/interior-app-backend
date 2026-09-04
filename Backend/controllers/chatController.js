const Message = require("../models/message");

exports.sendMessage = async (req, res) => {
  const msg = await Message.create(req.body);
  res.json(msg);
};