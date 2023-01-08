
//Not Found Handlers



const handler={};

handler.notFoundHandler=(requestProperties,callBack)=>{
    
    callBack(404,{
        message:'Your Requested UrL Not FounD'
    })
}

module.exports=handler;