// Define the collection class.
window.$et = (function(){


    // I am the constructor function.
    function $et(){

        // When creating the collection, we are going to work off
        // the core array. In order to maintain all of the native
        // array features, we need to build off a native array.
        var collection = Object.create( Array.prototype );

        // Initialize the array. This line is more complicated than
        // it needs to be, but I'm trying to keep the approach
        // generic for learning purposes.
        collection = (Array.apply( collection, arguments ) || collection);

        // Add all the class methods to the collection.
        $et.injectClassMethods( collection );

        // Return the new collection object.
        return( collection );

    }


    // ------------------------------------------------------ //
    // ------------------------------------------------------ //


    // Define the static methods.
    $et.injectClassMethods = function( collection ){

        // Loop over all the prototype methods and add them
        // to the new collection.
        for (var method in $et.prototype){

            // Make sure this is a local method.
            if ($et.prototype.hasOwnProperty( method )){

                // Add the method to the collection.
                collection[ method ] = $et.prototype[ method ];

            }

        }

        // Return the updated collection.
        return( collection );

    };


    // I create a new collection from the given array.
    $et.fromArray = function( array ){

        // Create a new collection.
        var collection = $et.apply( null, array );

        // Return the new collection.
        return( collection );

    };


    // I determine if the given object is an array.
    $et.isArray = function( value ){

        // Get it's stringified version.
        var stringValue = Object.prototype.toString.call( value );

        // Check to see if the string represtnation denotes array.
        return( stringValue.toLowerCase() === "[object array]" );

    };


    // ------------------------------------------------------ //
    // ------------------------------------------------------ //


    // Define the class methods.
    $et.prototype = {

        // I add the given item to the collection. If the given item
        // is an array, then each item within the array is added
        // individually.
        __has ( values, result ) {
            return !!values.find(value=>this.__equals(value,result));
        },
        __hasN ( N, values, match ) {
            return values.find(value=>this.__equals(value[N], match));
        },
        __equals (x, y) {
            // if(x.__input) x = x.__input;
            // if(y.__input) y = y.__input;
            if (x === null || x === undefined || y === null || y === undefined) { return x === y; }
            // after this just checking type of one would be enough
            if (x.constructor !== y.constructor) { return false; }
            // if they are functions, they should exactly refer to same one (because of closures)

            if (x instanceof Function) { return x === y; }
            // if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
            if (x instanceof RegExp) { return x === y; }
            if (x === y || x.valueOf() === y.valueOf()) { return true; }
            if (Array.isArray(x) && x.length !== y.length) { return false; }
            // if they are dates, they must had equal valueOf
            if (x instanceof Date) { return false; }

            // if they are strictly equal, they both need to be object at least
            if (!(x instanceof Object)) { return false; }
            if (!(y instanceof Object)) { return false; }

            for( var p in x ){
                if(p == "__proto__") console.log("PROTO")
                if(!this.__equals(x[p], y[p])) return false;
            }
            for( var p in y ){
                if(!this.__equals(x[p], y[p])) return false;
            }
            return true;
            // recursive object equality check
            var p = Object.keys(x);
            return Object.keys(y).every(function (i) { return p.indexOf(i) !== -1; }) &&
                p.every((i)=>{ return this.__equals(x[i], y[i]); });
        },
        concat: function(...args) {
            return this.__proto__.concat.call(this,args.filter((v)=>{
                var found = this.findIndex((v2)=>this.__equals(v,v2));
                return found==-1;
            }));
        },
        push: function (...args) {
            return args.map((v)=>{
                var found = this.findIndex((v2)=>this.__equals(v,v2));
                if(found==-1){
                    return (this.__proto__.push.call(this,v)-1);
                };
                return found;
            })
        },
        add: function( value ){

            // Check to see if the item is an array.
            if ($et.isArray( value )){

                // Add each item in the array.
                for (var i = 0 ; i < value.length ; i++){

                    // Add the sub-item using default push() method.
                    Array.prototype.push.call( this, value[ i ] );

                }

            } else {

                // Use the default push() method.
                Array.prototype.push.call( this, value );

            }

            // Return this object reference for method chaining.
            return( this );

        },


        // I add all the given items to the collection.
        addAll: function(){

            // Loop over all the arguments to add them to the
            // collection individually.
            for (var i = 0 ; i < arguments.length ; i++){

                // Add the given value.
                this.add( arguments[ i ] );

            }

            // Return this object reference for method chaining.
            return( this );

        }

    };


    // ------------------------------------------------------ //
    // ------------------------------------------------------ //
    // ------------------------------------------------------ //
    // ------------------------------------------------------ //


    // Return the collection constructor.
    return( $et );


}).call( {} );

function functionResult ( obj ) {
    obj
}
