const mongoose = require("mongoose");
const Contact = require("./models/contacts")

main().then((result)=>{console.log("mongoDb connected!!!")})
      .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/contact');
}


//new chats
const contacts = [
    {
      name: 'John Doe',
      phone: 1234567890,
      email: 'john.doe@example.com'
    },
    {
      name: 'Jane Smith',
      phone: 2345678901,
      email: 'jane.smith@example.com'
    },
    {
      name: 'Michael Brown',
      phone: 3456789012,
      email: 'michael.brown@example.com'
    },
    {
      name: 'Emily Johnson',
      phone: 4567890123,
      email: 'emily.johnson@example.com'
    },
    {
      name: 'Chris Lee',
      phone: 5678901234,
      email: 'chris.lee@example.com'
    }
  ];

  
Contact.insertMany(contacts);