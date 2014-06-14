var defineFormat={
    phone:/^1\d{10}$/,
    passwd:/.{6,}/,
    name:/.{2,}/,
    gender:/[01]/,
    birthday:/(20|19)\d{2}(1|0)\d[0,1,2,3]\d/,
    time:/\d{10}/

};

exports.checkKV=function(k,v){
    if(k in defineFormat){
       return defineFormat[k].test(v);
    }
    return true;
}

exports.validate=function(data){
    for(var k in data){
       if(!this.checkKV(k,data[k])){
           return k;
       }
    }

}