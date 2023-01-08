//Title:UserHandler
//Descriptiopn:Application Router
//Author:Coping EveryThinG .So I am Not The OriGinal Writter

//Dependencies:

const data =require('../../lib/data');
const {parseJSON,genTokenId}=require('../../helpers/utility');
const { first } = require('lodash');
const tokenHandler=require('./tokenHandler')




const handler={};

handler.checkHandler=(requestProperties,callBack)=>{
    


const acceptedMethods=['get','post','put','delete'];

if(acceptedMethods.includes(requestProperties.method)){
    handler.check[requestProperties.method](requestProperties,callBack)


}
else{
    callBack(405)
}
};

handler.check={};

handler.check.post=(requestProperties,callback)=>{



    const protocol=typeof(requestProperties.body.protocol)==='string' && ['http','https'].includes(requestProperties.body.protocol)  ? requestProperties.body.protocol : false;

    const method=typeof(requestProperties.body.method)==='string' && ['GET','POST','PUT','DELETE'].includes(requestProperties.body.method)  ? requestProperties.body.method : false;



    const url=typeof(requestProperties.body.url)==='string' && requestProperties.body.url.trim().length>0  ? requestProperties.body.url : false;



    const successCodes=typeof(requestProperties.body.successCodes)==='object' && Array.isArray(requestProperties.body.successCodes) ? requestProperties.body.successCodes : false;

    const timeoutSeconds=typeof(requestProperties.body.timeoutSeconds)=='number' && requestProperties.body.timeoutSeconds%1==0 && requestProperties.body.timeoutSeconds>=1 && requestProperties.body.timeoutSeconds<=5 ? requestProperties.body.timeoutSeconds :false;












    if(url && protocol && method && successCodes&& timeoutSeconds ){

      let token=typeof(requestProperties.headerObject.token)==='string' ? requestProperties.headerObject.token : false;
      ///Looking Up the user Phone:

      data.read('tokens',token,(err,tData)=>{
        if(!err && tData){
            let userPhone=parseJSON(tData).phone;
            data.read('users',userPhone,(err,uData)=>{
                if(!err && uData){
                    tokenHandler.tokenVerification(token,userPhone,(tokenValid)=>{
                        if(tokenValid){
                        let userObject=parseJSON(uData);
                        
                        let userChecks=typeof(userObject.checks)==='object' && Array.isArray(userObject.checks) ? userObject.checks : [];

                        if(userChecks.length<5){
                            let checkId=genTokenId(20);
                            let checkObject={
                                id:checkId,
                                userPhone,
                                protocol,
                                url,
                                method,
                                successCodes,
                                timeoutSeconds,
                            };

                            data.create('checks',checkId,checkObject,(err)=>{
                                if(!err){
                                    //add check id to the users object

                                    userObject.checks=userChecks;
                                    userObject.checks.push(checkId);

                                    data.update('users',userPhone,userObject,(err)=>{
                                        if(!err){
                                            callback(200,checkObject
                                               )

                                        }else{
                                            callback(500,{
                                                error:'There was a server side error'
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
                           callback(401,{
                            error:'User has already reached max check Limit'
                           })
                        }



                        }
                        else{
                            callback(403,{
                                error:'Authentication Problem'
                            })
                        }
                    })

                }
                else{
                    callback(403,{
                        error:'Authentication Problem'
                    })

                }

            })



        }
        else{
            callback(403,{
                error:'Authentication Problem'
            })
        }

      })












    }
    else{
        callback(400,{
            error:'You Have A  FUCKING Problem In Your Request',
        })
    }


   
    

    
};
handler.check.get=(requestProperties,callback)=>{
    const id=typeof(requestProperties.queryStringObject.id)==='string' && requestProperties.queryStringObject.id.trim().length===20  ? requestProperties.queryStringObject.id : false;

    if(id){
        //Lookup The Chceks
       data.read('checks',id,(err,checkData)=>{
        if(!err && checkData){
            let checksData=parseJSON(checkData);

            let token=typeof(requestProperties.headerObject.token)==='string' ? requestProperties.headerObject.token : false;

        tokenHandler.tokenVerification(token,checksData.userPhone,(tokenIsValid)=>{
            if(tokenIsValid){
                callback(200,checksData);

            }
            else{
                callback(403,{
                    error:'Authentication Problem'
                })
            }
        })    



        }
        else{
            callback(400,{
                error:'You have a problem In your Server'
            })
        }
       })




    }
    else{
        callback(404,{
            'error':'requested id is Not valid'
        })
    }

};
handler.check.put=(requestProperties,callback)=>{
    const id=typeof(requestProperties.body.id)==='string' && requestProperties.body.id.trim().length===20  ? requestProperties.body.id : false;


    const protocol=typeof(requestProperties.body.protocol)==='string' && ['http','https'].includes(requestProperties.body.protocol)  ? requestProperties.body.protocol : false;

    const method=typeof(requestProperties.body.method)==='string' && ['GET','POST','PUT','DELETE'].includes(requestProperties.body.method)  ? requestProperties.body.method : false;



    const url=typeof(requestProperties.body.url)==='string' && requestProperties.body.url.trim().length>0  ? requestProperties.body.url : false;



    const successCodes=typeof(requestProperties.body.successCodes)==='object' && Array.isArray(requestProperties.body.successCodes) ? requestProperties.body.successCodes : false;

    const timeoutSeconds=typeof(requestProperties.body.timeoutSeconds)=='number' && requestProperties.body.timeoutSeconds%1==0 && requestProperties.body.timeoutSeconds>=1 && requestProperties.body.timeoutSeconds<=5 ? requestProperties.body.timeoutSeconds :false;

    console.log(requestProperties.body)
    console.log(id)


    if(id){
        if(protocol||method|| successCodes||timeoutSeconds){
            data.read('checks',id,(err,checkData)=>{
                if(!err && checkData){
            const checkObject=parseJSON(checkData);
            let token=typeof(requestProperties.headerObject.token)==='string' ? requestProperties.headerObject.token : false;


            tokenHandler.tokenVerification(token,checkObject.userPhone,(tokenIsValid)=>{
                if(tokenIsValid){
                   if(protocol){
                    checkObject.protocol=protocol
                   }
                   if(url){
                    checkObject.url=url
                   }
                if(method){
                    checkObject.method=method
                   }
                   if(successCodes){
                    checkObject.successCodes=successCodes
                   }
                   if(timeoutSeconds){
                    checkObject.timeoutSeconds=timeoutSeconds
                   }

                   data.update('checks',id,checkObject,(err)=>{
                    if(!err){
                        callback(200,{
                            msg:'Updated Successfullty'
                        })

                    }
                    else{
                        callback(400,{
                            error:'No No No'
                        })
                    }
                   })



    
                }
                else{
                    callback(403,{
                        error:'Authentication Problem'
                    })
                }
            })    
    
    


            





                }
                else{
                    callback(400,{
                        error:'You Have a Problems'
                    })
                }





            })









        }
        else{
            callback(400,{
                error:'You Have A  FUCKING Problem In Your Request',
            })
        }

    }
    else{
        callback(400,{
            error:'You Have A  FUCKING Problem In Your Request',
        })
    }

























};
handler.check.delete=(requestProperties,callback)=>{
    const id=typeof(requestProperties.queryStringObject.id)==='string' && requestProperties.queryStringObject.id.trim().length===20  ? requestProperties.queryStringObject.id : false;

    if(id){
        //Lookup The Chceks
       data.read('checks',id,(err,checkData)=>{
        if(!err && checkData){
            let checksData=parseJSON(checkData);

            let phone=checksData.userPhone;

            let token=typeof(requestProperties.headerObject.token)==='string' ? requestProperties.headerObject.token : false;

        tokenHandler.tokenVerification(token,phone,(tokenIsValid)=>{
            if(tokenIsValid){
               
                data.delete('checks',id,(err)=>{
                    if(!err){

                        data.read('users',phone,(err,uData)=>{
                            if(!err){
                                let userObject=parseJSON(uData);
                                let checkIndex=userObject.checks.indexOf(id);
                                userObject.checks.splice(checkIndex,1);

                                data.update('users',phone,userObject,(err)=>{
                                    if(!err){
                                        callback(200,{
                                            msg:'Data Deleted Successfully'
                                        })

                                    }
                                    else{
                                        callback(500,{
                                            error:'Server Side Error'
                                        })
                                    }
                                })
                                


                        

                            }
                            else{
                                callback(500,{
                                    error:'Server Side Error'
                                })
                            }


                        })

                    }
                    else{
                        callback(500,{
                            error:'Server Side Error'
                        })
                    }
                })

            }
            else{
                callback(403,{
                    error:'Authentication Problem'
                })
            }
        })    



        }
        else{
            callback(400,{
                error:'You have a problem In your Server'
            })
        }
       })




    }
    else{
        callback(404,{
            'error':'requested id is Not valid'
        })
    }

};


















module.exports=handler;