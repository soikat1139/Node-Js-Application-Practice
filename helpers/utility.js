//Title Utilities
//Description:Important Utilities

//Dependencies
const crypto=require('crypto');

const utilities={};

//parse JSON STRING to object;

utilities.parseJSON =(jsonString)=>{
    let output={};
    try{
        output=JSON.parse(jsonString);

    }
    catch(err){
        console.log(err)
        output={};

    }
    return output;
}

//Hash String

utilities.hash=(str)=>{

    if(typeof(str)==='string' && str.length>0){
// The key for the HMAC function
const key = '01772057472s';

// The data to create the HMAC from
const data = str;

// Create the HMAC
const hmac = crypto.createHmac('sha256', key);

// Update the HMAC with the data
hmac.update(data);

// Get the final HMAC as a hexadecimal string
const hmacHex = hmac.digest('hex');

 return  hmacHex ;// Outputs the HMAC as a hexadecimal string

    }
    else{
        return false;
    }



}

//Token Id GenerATor

//Generate Token Id

utilities.genTokenId=(strLength)=>{

    let str='abcdefghijklmnopqrstuvwxyz0123456789';

    let tokenId='';

    for(let i=0;i<strLength;i++){

        let choosenWord=str.charAt(Math.floor(Math.random()*36));
        tokenId+=choosenWord;
    }

return tokenId;

}




module.exports=utilities;