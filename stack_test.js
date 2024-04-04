


class Stack{

    constructor(){

        this.index=0;
        this.fillSz_arr = [];
        this.fee_arr = [];

    }

    push( fillSz, fee ){

        this.index++;
        this.fillSz_arr[ this.index ] = fillSz;
        this.fee_arr[ this.index ] = fee;

    }

    top(){

        if( this.index == 0 ){

            console.log( "stack is empty ");
            return null;

        } 

        return {
            
            fillSz: this.fillSz_arr[this.index],
            fee: this.fee_arr[this.index]
        };

    }

    pop(){

        if (this.index==0){

            console.log( "stack is empty ");
            return null;
        }

        this.index--;

    }

    empty(){

        return this.index==0;
    }
    
}


st = new Stack();

st.push( 1,2 );
st.push( 2,3 );
st.push( 3,4 );


while( st.empty()!=1 ){

    console.log( st.top() );
    st.pop();

}

for( i=0 ; i<10 ; i++ ) {

    st.push( i, i+1 );

    if( i%2 == 0 ) st.pop();

}

while( !st.empty() ){

    console.log( st.top() );
    st.pop();
}


