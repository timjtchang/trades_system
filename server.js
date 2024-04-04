const express = require('express');
const app = express();
const fs = require('fs');

class TradesSourceJson{

    constructor( file ){

      const path = file;
      let res;
      let data;

      try{

        const res = fs.readFileSync( path );
        this.trades = JSON.parse(res);

      } catch( err ){

        if( err instanceof SyntaxError ){ 
          console.error('invalid JSON file');
          process.exit(2);

        }else{

          console.error(err);
          process.exit(1);
        }

      }

    }

    getCode(){

      return this.trades;
    }

};



let psj = new TradesSourceJson('./config/trades.json');
let data = psj.getCode();

app.get('/data', (req, res, next) => {

  res.send(data);

});


app.listen(3000);

//player?fname=1111&lname=22222