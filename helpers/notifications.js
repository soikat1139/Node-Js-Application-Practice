//Title: Notifications Library
//Description:Important function to notify users 
//Author Fucking no one is The Writter Just copying From someone
//


//dependendencies

const https=require('https');
const querystring = require('querystring');



//module scaffolding

const notifications={};


//Send sms to user using Twilio api

notifications.sendTwilioSms=(phone,msg,callback)=>{

    //Input Validation
    const userPhone=typeof(phone)==='string' && phone.trim().length===11 ? phone:false;
    const userMsg=typeof(msg)==='string' && msg.trim().length<=1600 ? msg.trim() : false;

    if(userPhone && userMsg){
        //configure the request payload 

        const payLoad={
            From:'+16692198709',
            To:`+88${userPhone}`,
            Body:userMsg,
        }

        //Stringify the Payload

        const stringifyPayload=querystring.stringify(payLoad);

        //configure the request Details:

        const requestDetailsObject={
            hostname:'api.twilio.com',
            method:'POST',
            path:'/2010-04-01/Accounts/AC124b10dff4f00d5b45a7d9c6c845d63f/Messages.json',
            auth:'AC124b10dff4f00d5b45a7d9c6c845d63f:f1b16ea9b7b0f4ebd1924a41cdcd9582',
            headers:{
                'Content-Type':'application/x-www-form-urlenconded'
            }
        }


        ///Instantiate the request object  

        const req=https.request(requestDetailsObject,(res)=>{
            const status=res.statusCode;
            //callback successful if the request went through

            if(status===200 || status===201){
                callback(false);

            }
            else{
                callback(`Status Code Returned was ${status}`);
            }
        })
        req.on('error',(e)=>{
            callback(e);
        })



        req.write(stringifyPayload);
        req.end();


    }
    else{
        callback('Given Parameters were missing or invalid')
    }


}

//Exports The Module:

module.exports=notifications;

