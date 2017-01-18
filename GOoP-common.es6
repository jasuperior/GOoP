import {Terminator, Alias, Graph, Node, Edge, Rule} from "GOoP";
// Function.prototype.memorize = function memorize () {
//     var fn = this;
//     function memorizedFunct (...input) {
//         var context = this, result;
//         if(result = this.relationships.search({context, input})){
//             return result.output;
//         }
//         try{
//
//             var output =  fn.apply(this, arguments);
//
//             memorizedFunct.results.contexts.push(context);
//             memorizedFunct.results.inputs.push(input);
//             memorizedFunct.results.outputs.push(output);
//
//             memorizedFunct.relationships.push({ context, input, output });
//
//         }catch(__error){
//             memorizedFunct.results.outputs.push(_error)
//         }
//     }
//     memorizedFunct.toString = function () { return fn.toString() }
//     memorizedFunct.results = {
//         contexts: new $et(),
//         inputs: new $et(),
//         outputs: new $et()
//     }
//     memorizedFunct.relationships =  new $et();
//     return memorizedFunct;
// }

var $ = GOoP;
Array.prototype.__flatten = function __flatten (){
    return this.reduce((a,b)=>a.concat(b),[])
}
Array.prototype.__concat = function __concat (...args) {
    return this.concat(args.__flatten().filter((v)=>v));
}
Array.prototype.split = function split (delim) {
    var count = 0, result = [];
    this.forEach((v)=>{
        if(v == delim) return count++;
        if ( !result[count] ) result[count] = [];
        result[count].push(v)
    });

    return result;
}
Object.prototype.GOoPtype = Object.prototype.gtype = function type ( value ) {
    this.__type = value;
    return this;
}
Object.prototype.walk = function walk ( fn, deep, stop, depth ) {
    var result = [], stop = stop || {stop: null}, depth = depth || 0;
    // fn = eval ( `${fn.toString().replace(/return\s*?\(?(.*?)\)?/g,"return ()=>$1")}` );
    function _stop ( value ) {
        stop.stop = value;
        return value;
    }
    var new_depth = depth+1;
    // console.log(depth, deep);
    if(!isNaN(deep) && depth > deep) return;

    for(var i in this ){
        if(i !== "__proto__" && i !== "walk"){
            var root = typeof this[i] == "object";
            if(stop.stop) break;
            var input = [];
            input = input.__concat(fn.apply(this, [this[i], i, _stop ])) // ( value, prop, root?)
            if(deep && root){
                input = input.__concat(this[i].walk(fn, deep, stop, new_depth))
            }
            if(input.length) {
                result = result.__concat(input);
                input = null;
            }
        }
    }
    return result;
}
export function Verb ( name, fn ) {
    // name = !Array.isArray(name)?[name]:name;
    var nameobj = name;
    if(typeof name !== "object"){
        nameobj = {
            present: name
        }
    }
    fn.__verbname = nameobj;
    fn.gtype("verb");
    Node(nameobj.present, fn);
}
Terminator("?", function(trail){
    return Edge.connect(this, trail);
})
// Terminator(",", function(trail){
//     var first = trail.slice(0,1), first_value = this[first], result;
//     if(first_value.__type == "article") result = Edge.connect(this, trail.slice(1))._[first].$this;
//     else result = Edge.connect(this, trail)._.$this;
//     return result;
//
// });
Terminator(";", function(trail){
    var result = Edge.connect(this, trail)._;
    return result;
});
Alias("it");
Rule("verb", function(before, after,$,$$, obj){
    // console.log(this, before.__flatten(), after);
    obj.__state.splice(0);
    var $this = Edge.combine(before.__flatten()), args = Edge.combine(after);

    if(Array.isArray($this)){
        // console.log($this,args);
        return $this.map((v)=>{
            v.__state.push([this.present])
            return this.apply(v, args )
        })
    }
    return this.apply($this.length==1?$this[0]:$this, args );
})

Rule("comma", function(before, after, btrail, atrail ){
    // console.log("in the comma");
    var first = before.slice(0,1)[0], after = after.split(this), article;
    // console.log(first.__type, after[0][0].__type);
    if(first.__type == "article" && after[0][0].__type !== "article" ){
        // before.splice(0,1);
        // console.log("on the article",before);
        var $after = [];
        after.find((v)=>{
            var result = v.findIndex((v2)=>v2.__type == "verb")
            if(result == -1) before = before.concat(v)
            else{
                before = before.concat(v.splice(0,result));
                $after = v;
            }
            return result == -1
        });
        // console.log("before the result",before);
        var result = Edge.combine(before);
        // console.log("after the result", result);
        if($after.length > 0 && result) {
            return Edge.combine([].concat(result,$after))
        };
        return result;
    }else{
        // console.log("not two articles");
        var $after = [], value = Edge.combine(before), $before = [value.length < 2 ? value[0] : value];

        after.find((v)=>{
            var result = v.findIndex((v2)=>v2.__type == "verb");
            if(result == -1){
                // console.log("there is no result so add to before [%O]", v);
                var value = Edge.combine(v);
                $before.push( value.length < 2 ? value[0] : value )
            }
            else{
                // console.log("is result so add to before [%O]", v);
                var value = Edge.combine(v.splice(0,result));
                $before.push(value.length < 2 ? value[0] : value );
                $after = v;
            }
            return result !== -1
        });
        // $before.__series = true;
        // console.log("Before and After [%O] [%O] [%O]", $before, $after, after);
        if($after.length > 0) {
            return Edge.combine([].concat($before,$after))
        }
        return $before;
    }


    var result = this.apply(Edge.combine(before));
    // console.log("this is the result",result);
    if(result){
        return result._.$this.__insert(atrail);
    }
    return []._.$this.__insert(atrail);
    // return "shit"
})
Rule("possession", function(before,after,btrail,atrail, obj){
    var $this = this.call(before.pop(), atrail.shift()), result;
    after.shift(); btrail.pop();
    result = Edge.connect(obj, [...btrail,$this, ...atrail]);
    console.log(result);
    return result;
})
function a ( ...object ){
    // console.log(this);
    var subject = Object.create(object.splice(object.length-1)[0]);
    if(object.length){
        object.map((adjective)=>Object.assign(subject, adjective));
    }
    return subject;
}
a.gtype("article");

Node("a", a);
Node("an", a);
Node("the", function the ( object ){
    return object;
}.gtype("article"));
Node("is", function( value ){
    Object.assign(this,value);
    return this;
}.gtype("verb"));

Node("jamel", { age: 17, skin: "brown", "hair": "bald" });
Node("grow", function( amount ){
    // console.log(this, amount);
    if(amount) this.age+=amount;
    else this.age++;
    return this;
}.gtype("verb"));
// Node(["ran","run"])
Node("shotup",  function( amount ){
    // console.log(this, amount);
    "this grow 6.";
    "this grow 8.";
    console.log(this.__state);
    return this;
}.gtype("verb"))
Node("smart", {intelligence: 1000});
Node("happy", {emotion: "happy"});
Node(",", function(){
    // console.log(this);
    return this;
}.gtype("comma"))
Node("'s", function( key ){
    return this[key];
}.gtype("possession"))
// GOoP.Graph(()=>{
//     /* articles */
//
//
//     /* prepositions */
//     this.Node("of", function a ( object ){
//         if(typeof object == "object"){
//
//         }
//     }.limit(1));
// })
