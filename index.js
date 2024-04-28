// use mongodb 

const {MongoClient}=require('mongodb');


const url ="mongodb+srv://muhammedalbahle:mongo123@clusterdbb.j8w4mhp.mongodb.net/?retryWrites=true&w=majority&appName=Clusterdbb";
// انشاء اتصال
const client = new MongoClient(url);

// اسم الداتابيس
const dbname='testdb'

const main =async()=>{
    // اتصل بداتابيس
 await client.connect();
console.log('secessufyle');
// تحديد اسم داتا بيس
const db =client.db(dbname);
// تحديد collection داتا بيس
const collection=db.collection('imges');
collection.insertOne({imge5:'5'})
// Array جلب الداتا وتحويلها الى اراي 
const data = await collection.find().toArray();
console.log('data',data);

}
main()