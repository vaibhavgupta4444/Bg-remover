import {Webhook} from 'svix'
import userModel from '../models/userModel.js';

const clerkWebhooks = async (req,res) => {
    try {
        
        const whook=new Webhook(process.env.CLERK_WEBHOOKS_SECRET);

        await whook.verify(JSON.stringify(req.body),{
            "svix-id":req.headers["svix-id"],
            "svix-timestamp":req.headers["svix-timestamp"],
            "svix-signature":req.headers["svix-signature"]
        });

        const {data,type}=req.body;

        switch (type) {
            case "user.created":{

                const userData={
                    clerkId:data.id,
                    email:data.email_addresses[0].email_address,
                    firstName:data.first_name,
                    lastName:data.last_name,
                    photo:data.image_url
                }

                await userModel.create(userData);
                res.json({});
                break;
            }

            case "user.update":{

                const userData={
                    email:data.email_addresses[0].email_address,
                    firstName:data.first_name,
                    lastName:data.last_name,
                    photo:data.image_url
                }

                await userModel.findOneAndUpdate({clerkId:data.id},userData);
                res.json({});
                break;
            }

            case "user.destroy":{
                await userModel.findOneAndDelete({clerkId:data.id});
                res.json({});
                break;
            }
        
            default:{
                break;
            }    
        }

    } catch (error) {
        console.log(error.message);
        res.JSON({success:false,message:error.message});           
    }
}

export {clerkWebhooks}