//Sample Handlers






const handler={};

handler.sampleHandler=(requestProperties,callBack)=>{
    
console.log(requestProperties);

callBack(200,{
    message:'This is a sample URL',
});

}

module.exports=handler;