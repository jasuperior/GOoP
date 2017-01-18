function GoopMap () {
    var keys = [];
    this.keys = keys;
    this.map = new Map();
    this.map.set = function set ( key, value ){
        console.log("setting");
        this.__proto__.set.call(this, key, value);
        if(!keys.includes(key)){
            console.log("adding");
            keys.push(key);
        }

    }
    this.map.altget = function altget( value ) {
        console.log("getting alt");
        var result;
        this.forEach((v,k)=>{if(v==value)return result=k});
        console.log(result);
        return result;
    }
    this.map.altset = function altset ( value, key ){
        console.log("setting alt");
        var rvalue = this.altget(value);
        if(rvalue){
            console.log(rvalue);
            if(Array.isArray(rvalue)){
                rvalue.push(key);
            }
            if(typeof rvalue == "object")
                Object.assign(rvalue,key);
            if(typeof rvalue == "function") return;
            else this.set(key, value)
        }

    }

    return new Proxy(this, {
        get( $this, prop){
            var returnKey;
            if(prop[0] == "_"){
                returnKey = true;
                prop = prop.slice(1);
            }
            var key = $this.keys.find((key)=>{
                if(Array.isArray(key))
                    return key.find((val)=>val==prop);
                if(typeof key == "object")
                    return key[prop];
                if(typeof key == "function"){
                    var result = key(prop);
                    return result&&key;
                }
                return key == prop;
            });
            if(key){
                if(returnKey) return key;
                return $this.map.get(key);
            }
            var value = $this.map[prop];
            if(typeof value == "function")
                value = value.bind($this.map);
            return value;
        },
        set($this, prop, value){
            console.log(this);
            if(this.get($this,prop)){
                console.log("setting");
                $this.map.set(this.get($this, `_${prop}`), value);
            }else{
                $this.map.altset(value, prop);
            }
        }
    })
}
