const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

const filepath = path.join(__dirname, 'HospitalData.json');

app.use(express.json());

function readData(){
    try{
        const data = fs.readFileSync(filepath, 'utf-8');
        return JSON.parse(data);
    }catch(error){
        console.error("Error reading data", error)
        return [];
    }
    }
function writeData(data){
    try{
        fs.writeFileSync(filepath, JSON.stringify(data, null, 2),'utf-8');
    }catch(error){
        console.error("Error writing data", error);
    }
}

// get
app.get('/hospital',(req,res)=>{
    const hospital = readData();
    res.json(hospital);
});



// adding value 
app.post('/add',(req,res)=>{
    const add = req.body;
    if(!add.name || !add.patientCount || !add.location){
       return res.status(400).json({message:"Incomplete data"});
    }
    let hospitals = readData();
    hospitals.push(add);
    console.log("Data to be written:", hospitals); 
    writeData(hospitals);
 
    res.status(201).json({ message: "Hospital added successfully", hospital: add });
});

// Update a hospital by name
app.put('/update/:name', (req, res) => {
    const nameToUpdate = req.params.name;
    const updatedHospital = req.body;
    let hospitals = readData();
    const index = hospitals.findIndex(hospital => hospital.name === nameToUpdate);
    if (index !== -1) {
        hospitals[index] = { ...hospitals[index], ...updatedHospital };
        writeData(hospitals);
        res.json({ message: `Hospital '${nameToUpdate}' updated successfully`, hospital: hospitals[index] });
    } else {
        res.status(404).json({ message: `Hospital '${nameToUpdate}' not found` });
    }
});

// Delete a hospital by name
app.delete('/delete/:name', (req, res) => {
    const nameToDelete = req.params.name;
    let hospitals = readData();
    const filteredHospitals = hospitals.filter(hospital => hospital.name !== nameToDelete);
    if (filteredHospitals.length < hospitals.length) {
        writeData(filteredHospitals);
        res.json({ message: `Hospital '${nameToDelete}' deleted successfully` });
    } else {
        res.status(404).json({ message: `Hospital '${nameToDelete}' not found` });
    }
});

app.listen(PORT,(req,res)=>{
    console.log(`Server run on ${PORT}`);
})