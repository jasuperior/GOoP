
export var __ =  Symbol(",");
// export var _terminators = {};

export function Node ( name, value ) {
    if(!name) return;
    if( typeof value == "object"){
        var prototype = new Node();
        prototype.__proto__.__proto__ = value.__proto__;
        value.__proto__ = prototype;
    }

    var context = this;
    if(this == window || !this) context = exports;
    if(value && value.__type){
            context.__types[name] = value.__type;    //sets up the type in the gootypes registry.
    }
// console.log(context, exports, this, context=exports);
    if( typeof value === "function"){
        var fn_reg = /^\(?(.*?)\)?\s*?=>\s*{?([\s\S]*?)}?$/;
        var fn = Edge.transformEdges(value);
        context[name] = eval(`(${fn})`);
        for(var key in value ){
            context[name][key] = value[key];
        }
        context[name].__type = value.__type;
        if(value.__count) context[name].__count = value.__count;
    }else if ( typeof value === "object"){
        Object.defineProperty(value, "name", {
            get: function (){
                return name;
            }
        })
        context[name] = value;
    }else{
        context[name] = value;
    }
}

export function Edge ( object, trail ) {
    trail = trail || [];
    return new Proxy(object, {
        get: (target, prop) => {
            // console.log(object, prop);
            if(prop == Symbol.toPrimitive ){
                return () => { return trail }
            }else if( prop == "_" ){
                object.__state.push(trail);
                console.log(" action is terminating [%O] [%O] [%O]",object, trail, object.__state);
                return Edge.connect(object, trail);
            }else if( prop == "__inject" ){
                // var fn = ;
                return Edge(()=>object, trail);
            }else if( prop == "__insert"){
                return (args)=>Edge(object, trail.concat(args))
            }else{
                if ( prop in object._terminators &&  typeof object._terminators[prop] == "function") {
                    console.log(object._terminators, prop, object._terminators[prop]);
                    return object._terminators[prop].call(object, trail);
                }
                var new_trail = trail.concat(prop);
                return Edge(target, new_trail)
            }
        },
        apply: function(target, thisArg, argumentsList) {
            // console.log(target());
            var new_trail = [...trail,...argumentsList];
            return Edge(target(), new_trail)
        },
        set : (target, prop, value ) => {

        }
    })
}

Edge.connect = function (object, trail ){
    var combined = [], count = 0, rule = [];
    // console.log(trail);
    console.log("THE OBEJCT IN CONNECT [%O]", object);
    trail.reverse().forEach((prop, key)=>{
        // console.log("%s %O %O", prop, object, exports[prop]);
        var result = object[prop] || exports[prop], current = combined[count];
        if(typeof prop == "object"){
            if(current)
                return combined[++count] = prop;
            return combined[count] = prop;
        }
        if( Object.getOwnPropertyNames(object.__types).includes(prop) && object._rules[object.__types[prop]]) {
            rule.push({ key, fn: object._rules[object.__types[prop]]});
        }
        if(prop == "this"){ //this used for single object
            // var result = Object.create(object);
            result = object;
            if(typeof current == "object")
                return combined[count] = Object.assign(current,result.__proto__);
            else {
                count++;
                return combined[count] = result;
            }
        }
        if(prop == "$this"){ //this used for single object apart of collection;
            if( Array.isArray(object) ){
                count+=object.length;
                return combined= combined.concat(object.reverse());
            }
            count++;
            return combined[count] = object;
        }
        // if(typeof result == "object") result = Object.create(result);
        // console.log(prop, result, $goop.__, result == $goop.__);
        if(result){
            // if(result == __){
            //     return count++;
            // }
            if(current){
                switch (typeof result) {
                    // case "object":
                    //     if(typeof current == "object")
                    //         combined[count] = Object.assign(current,result.__proto__);
                    //     else {
                    //         count++;
                    //         combined[count] = result;
                    //     }
                    //     break;
                    default:
                        count ++;
                        combined[count] = result;
                        break;
                }
            }else{
                // console.log()
                combined[count] =  result;
            }

        }else{
            combined.push( isNaN(prop)? prop: parseFloat(prop));
            count++;
        }
    });
    // console.log("Combined 1 [%O]",combined);
    combined.reverse();
    // console.log("Combined 2 [%O]",combined);
    var result;
    if(rule.length){
        rule = rule.reverse()[0]; trail.reverse();
        console.log("RULE [%O] [%O]",rule, combined);
        if(rule.key == 0){
            result = rule.fn.call(
                combined.slice(combined.length-1)[0],
                combined.slice(0, combined.length-1),
                [],
                trail.slice(0, combined.length-1),
                [],
                object
             )
        }else
        result = rule.fn.call(
            combined.slice((-rule.key)-1, (-rule.key))[0],
            combined.slice(0, -(rule.key)-1),
            combined.slice(-(rule.key)),
            trail.slice(0, -(rule.key)-1),
            trail.slice(-(rule.key)),
            object
         )
    }else result = Edge.combine(combined);
    // console.log("Result [%O]", result);
    if(result && result.length <= 1) return result[0];
    return result;
}
Edge.combine = function ( combined ) {
    console.log("combiner",combined);
        if(!combined.length) return combined;
        // console.log("after combiner");
        for(var i = 0; i < combined.length ; i++ ){
            if(typeof combined[i] == "number" && typeof combined[i+1] == "object" ){
                // console.log("number baby");
                return Edge.combine(
                    combined.slice(0,i).concat(multipy(combined[i],combined[i+1]), combined.slice(i+2))
                );
            }
            if(typeof combined[i] == "function"){
                // console.log("its a function");
                if(combined[i].__count){
                    // console.log("combining baby", i+1, combined.slice(i+1, (i+1)+combined[i].__count));
                    let before = combined.slice(0,i).reduce((a, b) => a.concat(b), []),
                        after  = combined.slice(i+1, (i+1)+combined[i].__count)
                                        .reduce((a, b) => a.concat(b), []),
                        rest   =  combined.slice((i+1)+combined[i].__count, combined.length);
                    return Edge.combine(
                        [].concat(
                            combined[i].apply(before.length==1?before[0]:Edge.combine(before), after),
                            rest
                        )
                    )
                }
                // console.log("about to before")
                let before = combined.slice(0,i).reduce((a, b) => a.concat(b), []),
                    after  = combined.slice(i+1, combined.length)
                                    .reduce((a, b) => a.concat(b), []);
                // console.log("before",before, combined[i], after);
                if(before.length){
                    return Edge.combine(before).map((v)=>{
                        return combined[i].apply(v, after);
                    })
                }
                return [].concat(combined[i].apply(
                    before.length==1?before[0]: Edge.combine(before), Edge.combine(after)
                ));
                break;
            }
        }
        return combined;
}
Edge.transformEdges = function ( fn ) {
    var fn_reg = /^\(?(.*?)\)?\s*?=>\s*{?([\s\S]*?)}?$/;
    if( typeof fn == "string") return transformEdgesInString(` ${fn} `);
    fn = fn.toString().replace(fn_reg, "function($1){$2}").replace(/".*?"/g, transformEdgesInString);
    return fn;
}
function multipy (num, obj) {
    return new Array(num).fill(Object.create(obj));
}
function transformEdgesInString (match){
    var parens = [];
    var str = match.slice(1, match.length-1)
    .replace(/\((.*?)\)/g,(match)=>{
        // parens.push(Edge.transformEdges(`"${match.slice(1,match.length-1).trim()}"`));
        parens.push(match);
        return `(${parens.length-1})`;
    })
    .split(/\s+/)
    str = str.map((word, k)=>{
        if(!isNaN(word)){
            word = word
            .replace(/(\d+)(\.\d+)?(\.)?/,"[$1$2]$3");
        }
        var punct;
        if (k == str.length - 1){
            var match;
            if(match = word.match(/('\w+|[!\#$%&'*+\-,/:;<=>?@\\^`|~])$/)){
                word = word.replace(/('\w+|[!\#$%&'*+\-,/:;<=>?@\\^`|~])$/, "_______").replace(/('\w+|[!\#$%&'*+\-,/:;<=>?@\\^`|~])/, "[`$1`]@@@@@").replace(/_______/,`[\`${match[0]}\`]`);
                // console.log(match[0]);
            }else{
                word = word.replace(/('\w+|[!\#$%&'*+\-,/:;<=>?@\\^`|~])/, "[`$1`]@@@@@");
            }
        }else{
            var match;
            if(match = word.match(/('\w+|[!\#$%&'*+\-,/:;<=>?@\\^`|~])$/)){
                word = word.replace(/('\w+|[!\#$%&'*+\-,/:;<=>?@\\^`|~])$/, "_______").replace(/('\w+|[!\#$%&'*+\-,/:;<=>?@\\^`|~])/, "[`$1`]@@@@@").replace(/_______/,`[\`${match[0]}\`]`);
                // console.log(match[0]);
            }else{
                word = word.replace(/('\w+|[!\#$%&'*+\-,/:;<=>?@\\^`|~])/, "[`$1`]@@@@@");
            }
            // word = word.replace(/('\w+|[!\#$%&'*+\-,/:;<=>?@\\^`|~])/, "[`$1`]")
        }
        word = word
        .replace(/\{(.*)\}/, "[$1.name]")
        .replace(/\.$/, str.length-1>k?"._._":"._")
        // .replace(/\#\#\#\#/, ".")
        // .replace(/,$/, ".__")
        .replace(/@@@@@/,".");

        return word;
    }).join(".")
    .replace(/\.\[/g,"[")
    .replace(/\.\((.*?)\)/g,(match)=>{
        var num = match.slice(2,match.length-1);
        return `.__inject${parens[num]}`;
    });
    if(str.match(/^\[/))
        return "this._"+str;
    return "this._."+str;
}
Edge.fromString = function _Edge ( name, value ) { //public edge constructor. need to change this to be the "main" Edge and the other as the _Edge as well as applying the methods to this constructor exclusively.
    var edge = Edge.transformEdges(value);
    Object.defineProperty( this, name, {
        get(target, prop){
            return eval(edge)
        },
        configurable: true,
        immutable: false
    })
}
// Object.keys(Edge).map((key)=>_Edge[key] = Edge[key]);

var _ = Edge(exports);
export function Graph ( fn, context ) {
    if( typeof fn !== "function" ) {
        return null;
    }
    // console.log(this instanceof Graph);
    var _default = {Graph, Node, Terminator, Alias, __: __ };
    context = (context && Object.assign(context, _default) ) || (this instanceof Graph && Object.assign(this, _default)) || (this !== window && this) || _default;
    fn = Edge.transformEdges(fn);
    eval(`(${fn})`).call(context);
    if(context == _default || this instanceof Graph) return context;
}

export function Terminator( symbol, fn  ) {
    var context = this;
    if(!this || this == window) context = exports;

    if(Array.isArray(symbol)){
        return context._arrTerminators.push(symbol)
    }
    return context._terminators[symbol] = fn;
}

export function Alias ( name, property ){
    var context = this;
    if(!this || this == window) context = exports;
        // context.__aliases[name] = true;
    if(property){
        return Object.defineProperty(Object.prototype, name, {
            get: function(){ return this[property]  },
            enumerable: false
        });
    }
    Object.defineProperty(Object.prototype, name, {
        get: function(){ return this  },
        enumerable: false
    });
}

export function Rule ( type, fn ) {
    var context = this;
    if(!this || this == window) context = exports;
    if( typeof type == "string" && typeof fn == "function")
        context._rules[type] = fn;
}
Object.defineProperty(Object.prototype, "_", {
    get: function(){ return Edge(this) },
    enumerable: false
});
Object.defineProperty(Object.prototype, "__types", {
    value:{},
    enumerable: false
});
Object.defineProperty(Object.prototype, "_rules", {
    value:{},
    enumerable: false
});
Object.defineProperty(Object.prototype, "__state", {
    get(){
        if(!this.__records) this.__records = [];
        return this.__records;
    },
    enumerable: false
});
Object.defineProperty(Object.prototype, "_terminators", {
    value: {},
    // get: function(){
    //     if(!this.__terminators) this.__terminators = {}
    //     return this.__terminators;
    // },
    enumerable: false
});
Object.defineProperty(Object.prototype, "$$", {
    get: function getKeyedProto(){ return Object.keys(this).length?this:getKeyedProto.call(this.__proto__) }
});

Function.prototype.limit = function limit ( number ) {
    this.__count = number;
    return this;
}
// Function.prototype.memorize = function memorize () {
//     var fn = this;
//     function memorizedFunct (...__input) {
//         try{
//             var __output =  fn.apply(this, arguments);
//             memorizedFunct.results.push({__input, __output});
//         }catch(__error){
//             memorizedFunct.errors.push({__input, __error})
//         }
//     }
//     memorizedFunct.toString = function () { return fn.toString() }
//     memorizedFunct.results = new $et();
//     memorizedFunct.errors = new $et();
//     return memorizedFunct;
// }
// Node("walk", function(speed){
//     console.log(this, speed);
//     speed = speed || {speed: 1};
//     return "this is (speed)."
// });
// Node("I", { speed: 3,  });
// Node("is", function(value){
//     Object.assign(this,value.$$);
//     return this;
// })
// Node("fast", { speed: 15 });
// Node("slow", { speed: 5 });
// Node("of", {
//     get ( value ) {
//         if (value instanceof Node || typeof value == "function")
//             return this[value.name]
//         else
//
//     },
//     set() {
//
//     }
// })

// Remember this side effect for future binding of values;
// function withThis( obj , fn ) {
//     with(obj){
//         eval(`(${fn.toString()}())`);
//     }
// }
// _.I.walk.fast._
