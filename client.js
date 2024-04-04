const axios = require('axios');

class Stack{

  constructor(){

    this.index=-1;
    this.fillSz_arr = [];
    this.fee_arr = [];

  }

  push( fillSz, fee ){

    this.index++;
    this.fillSz_arr[ this.index ] = fillSz;
    this.fee_arr[ this.index ] = fee;

  }

  top(){

    if( this.index == -1 ){

        console.log( "stack is empty ");
        return null;

    } 

    return {
        
        fillSz: this.fillSz_arr[this.index],
        fee: this.fee_arr[this.index]
    };

  }

  pop(){

    if (this.index==-1){

        console.log( "stack is empty ");
        return null;
    }

    this.index--;

  }

  empty(){

    return this.index==-1;
  }
  
}


async function getData( callback ){


  const res = axios.get('//localhost:3000/data' )
                .then( (response)=>{

                  callback( null, response );
                })
                .catch( (err)=>{

                  console.log(err);
                })
                

}

{

  let history=[] //  to store history of trading

  let pos_num_pnl=0.0 // the number of positive pnl
  let neg_num_pnl=0.0 // the number of negative pnl

  let pos_quan_pnl=0.0 //  the quantity of positive pnl
  let neg_quan_pnl=0.0// the quantity of negative pnl

  let MDD=0.0 //  to record max drawdown
  let max_price=0.0 //  to record max price

  let total_pnl=0.0  // sum of pnl

  let pnl_arr=[] // pnl array

  let sharpo_ratio;

  let close_counter=0; // the count the number of closing long and closing short

  getData( (err, res)=>{

    history = res.data.data;

    long_st = new Stack();
    short_st = new Stack();

    let counter=0;

    let tmp = 0;
    
    for( const [, trade] of Object.entries(history) ){

      tmp++;
      // calculate MMD

      MDD = Math.max( MDD, ( max_price-parseFloat(trade.fillPx) )*100/max_price );
      max_price = Math.max( max_price, parseFloat(trade.fillPx) );

      // construct pnl array

      if ( trade.posSide == "long" ){

        if( trade.side == "buy" ){

          long_st.push( parseFloat(trade.fillSz), parseFloat(trade.fee) );

        }else if( trade.side == "sell" ){

          prev = long_st.top();
          long_st.pop();

          tmp_st = new Stack();

          while( prev.fillSz != parseFloat(trade.fillSz) ){

            tmp_st.push( prev.fillSz, prev.fee );
            prev = long_st.top();
            long_st.pop();

          } 

          //console.log( "buy fee = "+ prev.fee + " sell fee = "+trade.fee + " pnl = "+ trade.fillPnl + " new pnl = "+ parseFloat( parseFloat(trade.fillPnl) + prev.fee + parseFloat(trade.fee )) );
          pnl_arr.push( parseFloat( parseFloat(trade.fillPnl) + prev.fee + parseFloat(trade.fee )) );

          while( !tmp_st.empty() ){

            long_st.push( tmp_st.top().fillSz, tmp_st.top().fee );
            tmp_st.pop();
          }


        }else{

          console.log( "side is empty ");
        }


      }else if( trade.posSide == "short"){

        if( trade.side == "sell" ){

          short_st.push( parseFloat(trade.fillSz), parseFloat(trade.fee) );

        }else if( trade.side == "buy" ){

          prev = short_st.top();
          short_st.pop();

          tmp_st = new Stack();

          while( prev.fillSz != parseFloat(trade.fillSz) ){

            tmp_st.push( prev.fillSz, prev.fee );
            prev = short_st.top();
            short_st.pop();

          }

          //console.log( "buy fee = "+ prev.fee + " sell fee = "+trade.fee + " pnl = "+ trade.fillPnl + " new pnl = "+ parseFloat( parseFloat(trade.fillPnl) + prev.fee + parseFloat(trade.fee )) );
          pnl_arr.push( parseFloat( parseFloat(trade.fillPnl) + prev.fee + parseFloat(trade.fee )) );
          
          while( !tmp_st.empty() ){

            short_st.push( tmp_st.top().fillSz, tmp_st.top().fee );
            tmp_st.pop();
          }

        }else{

          console.log( "side is empty ");
        }

      }else{

        console.log("posSide is empty");
      }
    }

    if( !long_st.empty() ) console.log( "long stack is not empty ");
    if( !short_st.empty() ) console.log( "short stack is not empty ");

    // calculate fillPnl

    for( const [, fillPnl] of Object.entries(pnl_arr) ){

        if( fillPnl!=0 ){

          if( fillPnl>0 ){
  
            pos_num_pnl++;
            pos_quan_pnl+=fillPnl;
  
          }else if( fillPnl<0 ){
  
            neg_num_pnl++;
            neg_quan_pnl+= fillPnl;
  
          }
          
          close_counter++;
          //console.log( parseFloat(trade.fillPnl)+parseFloat(trade.fee) );
  
          total_pnl+=fillPnl;
  
        }
  
    }

    //calculate ROI:
    ROI = pos_quan_pnl/total_pnl;
    
    //calculate win rate:
    win_rate = pos_num_pnl/close_counter;
    
    //calculate odds ratio:
    odds_ratio = pos_num_pnl/neg_num_pnl;
    
    //calculate profit factor:

    profit_factor = pos_quan_pnl/neg_quan_pnl;

    //calculate sharpo ratio:
    mean = total_pnl/close_counter;
    sqr_sum = 0.0;

    for( value of pnl_arr ){

      sqr_sum+=Math.pow( mean-value, 2 );

    }


    std = Math.sqrt( sqr_sum/close_counter);
    sharpo_ratio = mean/std;

    console.log( "ROI: "+ROI );
    console.log( "MDD: "+MDD );
    console.log( "Win Rate: "+win_rate );
    console.log( "Odds ratio: "+odds_ratio );
    console.log( "Profit factor: "+profit_factor );
    console.log( "Sharpo ratio: "+sharpo_ratio );

  });

}