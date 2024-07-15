const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const path=require('path');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
// Connect to MongoDB
mongoose.connect('mongodb+srv://rongalivasu24:RXjPawvxp9d2D2HZ@backend.0xboack.mongodb.net/?retryWrites=true&w=majority&appName=backend'

).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB', err);
});

// Define Employee schema and model
const employeeSchema = new mongoose.Schema({
  employeeId: String,
  name: String,
  age: Number,
  email: String,
  gender:String, enum: ['male', 'female'],
});

const Employee = mongoose.model('Employee', employeeSchema);

// Middleware
app.use(cors());
app.use(bodyParser.json());
 
//data
 
// Routes
app.post('/employees', async (req, res) => {
  console.log('Request body:', req.body); // Log the request body for debugging
  try {
    const { employeeId, name, age, email ,gender } = req.body;
    const newEmployee = new Employee({ employeeId, name, age, email,gender});
    await newEmployee.save();
    res.status(201).send('Employee added successfully');
  } catch (err) {
    console.error('Error adding employee:', err); // Log the error
    res.status(500).send('Internal Server Error');
  }
});

app.get('/employees', async (req, res) => {
  try {
    const employees = await Employee.find({});
    res.json(employees);
  } catch (err) {
    console.error('Error fetching employees:', err); // Log the error
    res.status(500).send('Internal Server Error');
  }
});

app.get('/employee/filter', async (req, res) => {
  try {
   // console.log(req.query);
    const filters = {};
    if (req.query.gender) filters.gender = req.query.gender;
    if (req.query.age) 
    {
      const agee = parseInt(req.query.age,10);
      if(!isNaN(agee))
        filters.age=agee;
    }
    if (req.query.name) filters.name = { $regex: req.query.name, $options: 'i' };
    // if (req.query.employeeId) 
    //   {
    //     const agee = parseInt(req.query.employeeId,10);
    //     if(!isNaN(agee))
    //       filters.employeeId=agee;
    //   }
   if (req.query.employeeId) filters.employeeId =req.query.employeeId;
    console.log(filters.employeeId);
    
    const employees = await Employee.find(filters);
   // console.log(employees);
  //  console.log(employees);
    res.json(employees);
    
  } catch (err) {
    console.error('Error fetching employees:', err);
    res.status(500).send('Internal server error');
  }
});

app.get('/employee/gender',async(req,res)=>{
  try{
    const gend=req.query.gender;
    const employee=await Employee.find({gender:gend});
    res.json(employee);
  }catch(err){
    console.error('error fetching ',err);
    res.status(500).send('internal server');
  }
});
app.patch('/employee/:id',async(req,res)=>{
   const employeeid=req.params.id;
   const data=req.body;
   console.log(req.body);
   try{
    if(!employeeid)
      {
         return res.status(500).json({message:'Employee not found'})
      }
   const updateemployee= await Employee.findOneAndUpdate(
       { employeeId:employeeid},
        data,
        {new :true}
   );
   res.json(updateemployee);
   }catch(error){
    console.error('error in updating',error);
    res.status(500).send('internal server');
   }
});
app.post('/api/data', (req, res) => {
  const jsonData = req.body; // Assuming it's already parsed by body-parser middleware
  console.log(jsonData); // This will be your array of objects

  // Process jsonData as needed

  res.json({ message: 'Data received successfully' });
});


app.delete('/employee/:id',async(req,res)=>{
     const employeeid=req.params.id;
     try{
      if(!employeeid)
      {
         return res.status(500).json({message:'Employee not found'})
      }
       const deleteemployee=await Employee.findOneAndDelete(
            {employeeId:employeeid}
       );
       res.json('deleted successfully');
     } catch(error){
      console.error('error in deleting',err);
      res.status(500).send('internal server');
     }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
