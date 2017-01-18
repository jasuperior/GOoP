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


### Primitives
#### Node
#### Edge


### Syntax
#### Expression
#### Declaration
### Roadmap
*  Interpolation of Data in Edge : Being able to place variable data within Edge calls.
* d

[logo]: ./goop.logo.png
[Model]:  ./Goop-interface.png
