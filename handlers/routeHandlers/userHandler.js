//Title:UserHandler
//Descriptiopn:Application Router
//Author:Coping EveryThinG .So I am Not The OriGinal Writter

//Dependencies:

const data =require('../../lib/data');
const {hash}=require('../../helpers/utility');
const {parseJSON}=require('../../helpers/utility');
const { first } = require('lodash');
const tokenHandler=require('./tokenHandler')




const handler={};

handler.userHandler=(requestProperties,callBack)=>{
    
console.log(requestProperties);

const acceptedMethods=['get','post','put','delete'];

if(acceptedMethods.includes(requestProperties.method)){
    handler._users[requestProperties.method](requestProperties,callBack)


}
else{
    callBack(405)
}
};

handler._users={};

handler._users.post=(requestProperties,callback)=>{
    const firstName=typeof(requestProperties.body.firstName)==='string' && requestProperties.body.firstName.trim().length>0  ? requestProperties.body.firstName : false;



    const lastName=typeof(requestProperties.body.lastName)==='string' && requestProperties.body.lastName.trim().length>0  ? requestProperties.body.lastName : false;



    const phone=typeof(requestProperties.body.phone)==='string' && requestProperties.body.phone.trim().length===11  ? requestProperties.body.phone : false;



    const password=typeof(requestProperties.body.password)==='string' && requestProperties.body.password.trim().length>0  ? requestProperties.body.password : false;

    const tosAgreement=typeof(requestProperties.body.TersmsANdAgree)==='boolean'? requestProperties.body.TersmsANdAgree: false;
    


    

    if(firstName && lastName && phone && password && tosAgreement){
        ///Making Sure That User Doesn't Exist 

        data.read('users',phone,(err)=>{
            if(err){
                let userObject={
                    firstName,
                    lastName,
                    phone,
                    password:hash(password),
                    tosAgreement,

                }
                ///Storing The Users To THe DataBase:
                data.create('users',phone,userObject,(err)=>{
                    if(!err){
                        callback(200,{
                            meesge:'User Was Created SuccessFully'
                        })

                    }
                    else{
                        callback(500,{
                            'error':'Could Not Create User'
                        })
                    }
                })


            }
            else{
                callback(500,{
                    error:'There Was An Error On the Server Side'
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
handler._users.get=(requestProperties,callback)=>{
    //Check The phone Number Is Valid
    const phone=typeof(requestProperties.queryStringObject.phone)==='string' && requestProperties.queryStringObject.phone.trim().length===11  ? requestProperties.queryStringObject.phone : false;

    if(phone){

        //verify the User

        let token=typeof(requestProperties.headerObject.token)==='string' ? requestProperties.headerObject.token : false;

        tokenHandler.tokenVerification(token,phone,(tokenId)=>{
            if(tokenId){

                data.read('users',phone,(err,u)=>{
                    const user={...parseJSON(u)}
                    if(!err && user){
                        delete user.password;
                        callback(200,user)
        
                    }
                    else{
                        callback(404,{
                            'error':'requested Users Was Not Found'
                        })
        
                    }
                })

            }else{
                callback(403,{
                    msg:'User AuthenTication Failed'
                })
            }
        })

      

    }
    else{
        callback(404,{
            'error':'requested Users Was Not Found'
        })
    }



    
};
handler._users.put=(requestProperties,callback)=>{
    const firstName=typeof(requestProperties.body.firstName)==='string' && requestProperties.body.firstName.trim().length>0  ? requestProperties.body.firstName : false;



    const lastName=typeof(requestProperties.body.lastName)==='string' && requestProperties.body.lastName.trim().length>0  ? requestProperties.body.lastName : false;



    const phone=typeof(requestProperties.body.phone)==='string' && requestProperties.body.phone.trim().length===11  ? requestProperties.body.phone : false;



    const password=typeof(requestProperties.body.password)==='string' && requestProperties.body.password.trim().length>0  ? requestProperties.body.password : false;

    if(phone){
        if(firstName || lastName || password){

            let token=typeof(requestProperties.headerObject.token)==='string' ? requestProperties.headerObject.token : false;

            tokenHandler.tokenVerification(token,phone,(tokenId)=>{
                if(tokenId){

                    data.read('users',phone,(err,uData)=>{

                        const userData={...parseJSON(uData)};
        
                        if(!err && userData){
        
                            if(firstName){
                                userData.firstName=firstName;
                            }
                            if(lastName){
                                userData.lastName=lastName;
                            }
                            if(password){
                                userData.password=hash(password);
                            }
        
                            //store to database
        
                            data.update('users',phone,userData,(err)=>{
                                if(!err){
                                    callback(200,{
                                        meesge:'User was Updated Successfully'
                                    })
        
                                }
                                else{
                                    callback(500,{
                                        error:'There is a Problem In Server Site'
                                    })
                                }
                            })
        
        
        
        
        
                        }else{
                            callback(400,{
                                error:'You have A problrm putting The request'
                            })
        
                        }
                    })
    
                    
    
                }else{
                    callback(403,{
                        msg:'User AuthenTication Failed'
                    })
                }
            })












           

        }
        else{
            callback(400,{
                error:'You have A problrm putting The request'
            })
        }






    }
    else{
        callback(400,{
            errror:'Phone Number is on valid'
        })
    }










};
handler._users.delete=(requestProperties,callback)=>{
    const phone=typeof(requestProperties.queryStringObject.phone)==='string' && requestProperties.queryStringObject.phone.trim().length===11  ? requestProperties.queryStringObject.phone : false;


    if(phone){

        let token=typeof(requestProperties.headerObject.token)==='string' ? requestProperties.headerObject.token : false;

        tokenHandler.tokenVerification(token,phone,(tokenId)=>{
            if(tokenId){

               
        data.read('users',phone,(err,userdata)=>{
            if(!err && userdata){
                data.delete('users',phone,(err)=>{
                    if(!err){
                        callback(200,{
                            message:"User Deleted SuccessFully"
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

            }else{
                callback(403,{
                    msg:'User AuthenTication Failed'
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




module.exports=handler;