const fs=require('fs');
const path=require('path');
const { callbackify } = require('util');


const lib={};

//Base Directory of Data Folder

lib.basedir=path.join(__dirname,'../.data/');


///Write Data To tO fILE:

lib.create=function(dir,file,data,callBack){
    //open file for writing

    fs.open(`${lib.basedir+dir}/${file}.json`,'wx',function(err,fileDescriptor){
        if(!err && fileDescriptor){
            //convert data to string

            const stringData=JSON.stringify(data);

            fs.writeFile(fileDescriptor,stringData,function(err){
                if(!err){

                    fs.close(fileDescriptor,function(err){
                        if(!err){
                            callBack(false);
                        }
                        else{
                            callBack('Error Closing The new File!');
                        }
                    });

                }
                else{
                    callBack('There was an error')
                }
            })

        }
        else{
            callBack('Couldn"t create new file It may Already Exists')
        }
    })
}


///Read Data From File

lib.read=(dir,file,callBack)=>{
    fs.readFile(`${lib.basedir+dir}/${file}.json`,'utf8',(err,data)=>{
        callBack(err,data);

    })
}

lib.update=(dir,file,data,callBack)=>{
    fs.open(`${lib.basedir+dir}/${file}.json`,'r+',function(err,fileDescriptor){
        if(!err && fileDescriptor){
            const stringData=JSON.stringify(data);

            fs.ftruncate(fileDescriptor,(err)=>{
                if(!err){
                    //Write to the file and close it

                    fs.writeFile(fileDescriptor,stringData,(err)=>{
                        if(!err){
                            fs.close(fileDescriptor,(err)=>{
                                if(!err){
                                    callBack(false)

                                }
                                else{
                                    callBack('Error closing Data')
                                }
                            })
                        }
                        else{
                            callBack('Error Writting To The FiLE')
                        }
                    })

                }
                else{
                    console.log('Error Truncating File')
                }
            })

        }
        else{
            console.log('FileDescriptor may not exists')
        }

    })


}
lib.delete=(dir,file,callBack)=>{
    fs.unlink(`${lib.basedir+dir}/${file}.json`,(err)=>{
        if(!err){
            callBack(false);
        }
        else{
            callBack("Error Deleting File")
        }
    })
}
    


module.exports=lib;