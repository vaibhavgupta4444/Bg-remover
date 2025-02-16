import axios from 'axios'
import fs from 'fs'
import FormData from 'form-data'
import userModel from '../models/userModel.js'

//Controller function to remove bg from image

const removeBgImage= async(req,res)=>{
    try {
        const {clerkId}=req.body;
        
    
        const user=await userModel.findOne({clerkId});

        if(!user){
            return res.json({success:false,message:'User Not Found'});
        }
        
        if(user.CreditBalance===0){
            return res.json({success:false,message:'No Credit Balance',CreditBalance:user.CreditBalance});
        }

        const imagePath=req.file.path;

        const imageFile=fs.createReadStream(imagePath);

        const formdata=new FormData();
        formdata.append('image_file',imageFile);
        

        const {data}=await axios.post('https://clipdrop-api.co/remove-background/v1',formdata,{
            headers:{
                'x-api-key':process.env.CLIPDROP_API,
            },
            responseType:'arraybuffer'
        });   
            
        const base64Image=Buffer.from(data,'binary').toString('base64');

        const resultImage=`data:${req.file.mimetype};base64,${base64Image}`

        await userModel.findByIdAndUpdate(user.id,{CreditBalance:user.CreditBalance-1})

        res.json({success:true,resultImage,CreditBalance:user.CreditBalance-1,message:'Background Removed'});
    } catch (error) {
        console.log(error);
        res.json({success:false,message:error.message});
    }
}

export default removeBgImage