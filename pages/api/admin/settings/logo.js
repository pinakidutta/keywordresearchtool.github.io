import  {IncomingForm}  from 'formidable'
const fs = require('fs');

export default async function handler(req, res) {

    const form = new IncomingForm();

    form.parse(req, async function (err, fields, files) {
        if(files.logo){
          
            await saveFile(files.logo);
        }
        return res.status(201).send("Logo uploaded");
      });
}


const saveFile = async (file) => {
    console.log('reading from file', file.filepath);
    const data = fs.readFileSync(file.filepath);
    fs.writeFileSync(`./public/logo.png`, data);
    await fs.unlinkSync(file.filepath);
    return;
  };
  

export const config = {
    api:{
        bodyParser: false
    }
}

