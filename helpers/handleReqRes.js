

//Dependencies
const url=require('url');

const {StringDecoder}=require('string_decoder')

const routes=require('../routes');

const{notFoundHandler}=require('../handlers/routeHandlers/notFoundHandler')





const handler={};





handler.handleReqRes=(req,res)=>{
    //response handle

    //get the url and parse it
  
    const parseUrl=url.parse(req.url,true);
    const path=parseUrl.pathname;
    const trimPath=path.replace(/^\/+|\/+$/g,'')
    const method=req.method.toLowerCase();
    const queryStringObject=parseUrl.query;
    const headerObject=req.headers;
    const{parseJSON}=require('./utility');

    const requestProperties={
      parseUrl,
      path,
      trimPath,
      method,
      queryStringObject,
      headerObject,
    }
  
    const decoder=new StringDecoder('utf-8')
  
    let realData='';

    const chosenHandler=routes[trimPath] ?  routes[trimPath] :notFoundHandler;

    







  
    req.on('data',(buffer)=>{
      realData+=decoder.write(buffer);
  
    });
  
    req.on('end',()=>{
      realData+=decoder.end();
      console.log(realData);

      requestProperties.body=parseJSON(realData);

      chosenHandler(requestProperties,(statusCode,payLoad)=>{
        statusCode=typeof(statusCode) ==='number' ? statusCode:500;
        payLoad=typeof(payLoad)==='object' ? payLoad:{};
        const payLoadString=JSON.stringify(payLoad);

        res.setHeader('Content-Type','application/json')
        res.writeHead(statusCode);
        res.end(payLoadString);
      });








      
    })
}

module.exports=handler;