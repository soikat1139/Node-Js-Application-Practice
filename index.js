//Raw node API Project:

//Title:Uptime Monitoring System:

//Dependencies:
const { clear } = require('console');
const http=require('http');

const{sendTwilioSms}=require('./helpers/notifications')



const handler=require('./helpers/handleReqRes');

const data=require('./lib/data')

//App Object 

const app={};

//Hello hello testing 1,2,3 hello
sendTwilioSms('01925750865','Hey mf How AARE yOU',(err)=>{
  console.log('error',err);
})





//configuration

app.config={
   port:3000
};

//create Server

app.createServer=function(){
  const server=http.createServer(handler.handleReqRes);
  server.listen(app.config.port,()=>{

    
    console.log(`Listening To Port ${app.config.port}`)
  })
}









  
   
app.createServer();