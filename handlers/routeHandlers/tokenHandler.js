//Title:UserHandler
//Descriptiopn:Application Router
//Author:Coping EveryThinG .So I am Not The OriGinal Writter

//Dependencies:

const data =require('../../lib/data');
const {hash}=require('../../helpers/utility');
const {parseJSON}=require('../../helpers/utility');
const {genTokenId}=require('../../helpers/utility');
const { first } = require('lodash');




const handler={};

handler.tokenHandler=(requestProperties,callBack)=>{
    


const acceptedMethods=['get','post','put','delete'];

if(acceptedMethods.includes(requestProperties.method)){
    handler.token[requestProperties.method](requestProperties,callBack)


}
else{
    callBack(405)
}



};

handler.token={};

handler.token.post=(requestProperties,callback)=>{
    const phone=typeof(requestProperties.body.phone)==='string' && requestProperties.body.phone.trim().length===11  ? requestProperties.body.phone:false;

    const password=typeof(requestProperties.body.password)==='string' && requestProperties.body.password.trim().length>0  ? requestProperties.body.password : false;

   




    if(phone){
        data.read('users',phone,(err,uData)=>{
            console.log(uData)

        let userData=parseJSON(uData);
            
        if(!err && userData){
                          
       let hashedPassword=hash(password);

       if(hashedPassword==userData.password){

        let tokenId=genTokenId(20);
            
        let expires=Date.now()*60*60*1000;

        let tokenObject={
            tokenId,
         phone,
         firstName:userData.firstName,
         lastName:userData.lastName,
         expires,
         }
    

       data.create('tokens',tokenId,tokenObject,(err)=>{
        if(!err){
            callback(200,{
                msg:'User Token Created SuccessFully',
                tokenObject
            })

        }
        else{
            callback(400,{
                msg:'User Token Is Not Created'
            })
        }
       })

       }
       else{
        callback(400,{
            error:'Wrong Password',
        })
       }

        }
        else{
            callback(400,{
                error:'You Have No account'

            })

        }
    })
}
    else{

        callback(400,{
         error:'You Have A problem In your Request',
        })

    }
}


handler.token.get=(requestProperties,callback)=>{
    //Check The phone Number Is Valid
    const tokenId=typeof(requestProperties.queryStringObject.tokenId)==='string' && requestProperties.queryStringObject.tokenId.trim().length===20  ? requestProperties.queryStringObject.tokenId : false;

   

    if(tokenId){

        data.read('tokens',tokenId,(err,u)=>{

            const token={...parseJSON(u)}

            if(!err && token){
                callback(200,token)

            }
            else{
                callback(404,{
                    'error':'requested tokens Was Not Found'
                })

            }
        })

    }
    else{
        callback(404,{
            'error':'requested tokens is Not valid'
        })
    }



    
};

handler.token.put=(requestProperties,callback)=>{
    
    const tokenId=typeof(requestProperties.body.tokenId)==='string' && requestProperties.body.tokenId.trim().length===20  ? requestProperties.body.tokenId : false;
    const extend=typeof(requestProperties.body.extend)==='boolean' && requestProperties.body.extend===true  ?  true:false;


    if(tokenId && extend){
        data.read('tokens',tokenId,(err,tData)=>{
            let tokenData=parseJSON(tData);
            if(!err){
                console.log(tokenData.expires)
                console.log(Date.now())
                if(tokenData.expires>Date.now()){

                    tokenData.expires=Date.now()*60*60*1000;

                    data.update('tokens',tokenId,tokenData,(err)=>{
                        if(!err){
                            callback(200,{
                                msg:'Data Updated SuccessFUlly'
                            })
                        }
                        else{
                            callback(500,{
                                msg:'sERVER sIDE eRROR'

                            })
                        }
                    })


                }
                else{
                    callback(400,{
                         error:'Your token Expired'
                    })
                }


            }
            else{
                callback(400,{
                    error:'User Token Not Found Anywhere In The DataBase'
                })

            }
            

        })






    }
    else{
        callback(400,{
            error:'User Not Found'
        })
    }













    

    
};
    
handler.token.delete=(requestProperties,callback)=>{
    const tokenId=typeof(requestProperties.queryStringObject.tokenId)==='string' && requestProperties.queryStringObject.tokenId.trim().length===20  ? requestProperties.queryStringObject.tokenId : false;


    if(tokenId){
        data.read('tokens',tokenId,(err,tdata)=>{
            if(!err && tdata){
                data.delete('tokens',tokenId,(err)=>{
                    if(!err){
                        callback(200,{
                            message:"token Deleted SuccessFully"
                        })
                        
                    }
                    else{
                        callback(500,{
                            error:'There Was a sERVER sIDE error'
                        })
                    }
                })

            }
            else{
                callback(500,{
                    error:'There was a server side error'
                })
            }

        })

    }
    else{
        callback(400,{
            error:'tHERE WAS A PROBLEM IN YOUR REQUEST'
        })
    }










};


handler.tokenVerification=(id,phone,callBack)=>{
    data.read('tokens',id,(err,tokenData)=>{
        if(!err && tokenData){
            if(parseJSON(tokenData).phone===phone && parseJSON(tokenData).expires>Date.now()){
                callBack(true);

            }
            else{
                callBack(false);
            }

        }
        else{
            callBack(false)
        }
    })
}







module.exports=handler;