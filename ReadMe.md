# GOoP.js
### The Graph Object-Oriented Programming Library for Javascript
![GOoP Logo][logo]

#### [GOoP.TheIncrediblyTalentedJa.com](http://goop.theincrediblytalentedja.com)

GOoP is not just a library, its a new programming paradigm inspired by graph libraries, databases, and query languages all over the net.

### The Problem?
When I watch videos, or read up on graph programming, and the amazing things one can do with it -- I literally explode with excitement over the possibilities of what I can create. But, lo and behold, I am thwarted by the commingled and obtuse syntax, and absurd to understand theories on which they're based, and my life slowly spirals into flotsam and jetsam.

> #### Oh, wo is me! How will I ever learn all this stuff?

This is the prime issue GOoP aims to solve -- beautiful relational data; low mental overhead.  It does this through the power of ES6 Proxies, and a little clever hacking. The end result is a program that thinks the way you do.
### So, What is it?
```javascript
Node("hello", function(){ //this is a Node declaration
    return "a message to the world." //this is an Edge
});
Node("init", function(){
    return "hello."
})
```
This is a valid GOoP program. In GOoP, `"double-quoted"` strings are executable data.

> **Note:** If  an actual String is desired, one should opt for using ` `` `  template strings or `''` single quoted strings, inside of node declarations.  

More than anything, GOoP is a programming paradigm. The idea is that one constructs their program in terms of [Nodes](#nodes) and [Edges](#edges). *Nodes*  , are data points. They can be any String, Array, Object, or Function. You construct them using the `Node()` constructor. You connect Nodes using  *Edges* -- which is essentially just a chain of Nodes (but a little more fancy).  Edges allow you to activivate your Nodes in a particular order, creating new meaning, and adding clarity to your code. Nodes and Edges can be interwoven into your existing codebase, to create expressive code which is self documenting.

Using this Graph Model, and a well formatted graph, even documentation like **this** could become rich, usable data.   

![Goop Model][Model]
### Goals
* Easy Learning Curve
* Small Footprint
* Fast
* Memory Efficient

### Getting Started
...
#### GOoP Global Object
To access all of the GOoP Primitives, you must import the global object.
```javascript
    import {Terminator, Alias, Graph, Node, Edge, Rule} from "GOoP";
```

### Primitives
The Primitives are methods which act as the entry point into the programming  paradigm. Using any of the below methods, you can begin constructing your graph in the fashion which matches your intent.

#### Node
#### Edge
#### Rule
#### Terminator
#### Alias
#### Graph

### Syntax
#### Expression
#### Declaration


### Common GOoP
Common Goop is a set of rules and nodes which allow you to get started with some common English words and parts of speech which make it easy to start coding hassle free. It is not required to use, however, using Common Goop in most cases would be preferred by most who wish to write code like English Sentences.

Example:
```javascript
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
    return this;
}.gtype("verb"))
Node("years",  function( amount ){
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

Graph(()=>{
console.log("jamel grow 2 years."); //Node {age: 19, skin: "brown", hair: "bald", __records: Array[3]}
console.log("jamel is smart.")//Node {age: 19, skin: "brown", hair: "bald", __records: Array[3], intelligence: 1000}
console.log("jamel's age.") //19
console.log("jamel shotup.")//Node {age: 25, skin: "brown", hair: "bald", __records: Array[3], intelligence: 1000}
})
```
### Roadmap
*  Interpolation of Data in Edge : Being able to place variable data within Edge calls.
* d

[logo]: ./goop.logo.png
[Model]:  ./Goop-Interface.png
