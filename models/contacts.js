const mongoose = require("mongoose");
const contactSchema = new mongoose.Schema({
    name: {
         type: String, 
         required: true 
        },
    phone: {
         type: Number,
         required: true
         },
    email: { 
         type: String 
        },
     createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        }
});

const Contact = mongoose.model("Contact",contactSchema);
module.exports = Contact