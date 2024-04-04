# trades_system

1. environment:
    npm install express
    npm install axios


2. formula:
    
    ROI = positive pnl / total pnl
    Win Rate = ( Number of deals you win / Number of deals you purchase ) * 100%
    MDD = max in a period - min in a period percent ( check percentage instead of actuall quantity )
    Odds ratio = the number of positive pnl / the number of negative pnl
    Profit factor = actual positive pnl / actual negative pnl
    Sharpe Ratio =  expactation / standard deviation
    


3. parameters & data structure:

        history //  to store history of trading

        pos_num_pnl // the number of positive pnl
        neg_num_pnl // the number of negative pnl

        pos_quan_pnl //  the quantity of positive pnl
        neg_quan_pnl // the quantity of negative pnl

        MMD //  to record max drawdown
        max_price //  to record max price

        total_pnl  // sum of pnl with fee

        pnl_arr[] // pnl array

        close_counter=0;

        sharpo_ratio

        long_stack< { fillSz, fee } >     // to record fillSz and fee when buying long
        short_stack< { fillSz, fee} >    // to record fillSz and fee when selling short

        Stack{

            fillSz arr  // array of fillSz
            fee arr     // array of fee
            index       // the index of the last element in both array

            function pop    // pop { fillSz, fee } from the both array
            function push   // push { fillSz, fee } into the both array
            function top    // the top element of th both array and return { fillSz, fee }

        };

4. dataflow:

        request history
        iterate history {

            calculate MMD:

                MMD = max( MMD, (max_price-cur_price)/max_price )
                max_price = max( max_price, cur_price )

            construct pnl array:

                if long:

                    if buy:

                        push { fillSz, fee } into long_stack
                    
                    else if sell:

                        pop { fillSz, fee } from long_stack
                        
                        If Sz is not matched:
                            use another stack to store all the { fillSz, fee } till they match

                        push fillpnl+cur_fee+buy_fee into pnl_arr

                        push all { fillSz, fee } from another stack back to long_stack

                else if short:

                    if sell:

                        pull { fillPz, fee } as Trade into long_stack

                    else if buy:

                        pop Trade from short_stack
                        
                        if Sz is not matched:
                            use another stack to store all the { fillSz, fee } till they match
                        
                        push fillpnl+cur_fee+sell_fee into pnl_arr

                        push all { fillSz, fee } from another stack back to short_stack

            

        }

        // calculate fillPnl

        iterate fillpnl array{

            if fillpnl!="":

            if fillpnl>0:

                pos_num_pnl++
                pos_quan_pnl+=fillpnl

            else if fillpnl<0:

                neg_num_pnl--
                neg_quan_pnl+=fillpnl

            else ALERT!

            total_pnl+=fillpnl

        }

        calculate ROI:

            pos_quan_pnl/total_pnl

        calculate win rate:
            
            win_rate = pos_num_dnl/size of dnl array

        calculate Odd ratio:

            pos_num_pnl / neg_num_pnl
        
        calculate profit factor:

            pos_quan_pnl / neg_quan_pnl

        calculate sharpo ratio:

            mean = total_pnl/ size of pnl array
            sqr_sum = 0

            iterate pnl_arr {

                sqr_sum+=( mean-pnl )^2
            }

            standard_deviation = sqr_sum/mean
            Sharpe Ratio: means/standard_deviation

5. output as PDF

    print ROI
    print win_rate
    print Odd ratio
    print profit factor
    print sharpo ratio



            

                



        
