(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else if (typeof exports !== "undefined") {
        factory();
    } else {
        var mod = {
            exports: {}
        };
        factory();
        global.$et = mod.exports;
    }
})(this, function () {
    "use strict";

    // Define the collection class.
    window.$et = function () {

        // I am the constructor function.
        function $et() {

            // When creating the collection, we are going to work off
            // the core array. In order to maintain all of the native
            // array features, we need to build off a native array.
            var collection = Object.create(Array.prototype);

            // Initialize the array. This line is more complicated than
            // it needs to be, but I'm trying to keep the approach
            // generic for learning purposes.
            collection = Array.apply(collection, arguments) || collection;

            // Add all the class methods to the collection.
            $et.injectClassMethods(collection);

            // Return the new collection object.
            return collection;
        }

        // ------------------------------------------------------ //
        // ------------------------------------------------------ //

        // Define the static methods.
        $et.injectClassMethods = function (collection) {

            // Loop over all the prototype methods and add them
            // to the new collection.
            for (var method in $et.prototype) {

                // Make sure this is a local method.
                if ($et.prototype.hasOwnProperty(method)) {

                    // Add the method to the collection.
                    collection[method] = $et.prototype[method];
                }
            }

            // Return the updated collection.
            return collection;
        };

        // I create a new collection from the given array.
        $et.fromArray = function (array) {

            // Create a new collection.
            var collection = $et.apply(null, array);

            // Return the new collection.
            return collection;
        };

        // I determine if the given object is an array.
        $et.isArray = function (value) {

            // Get it's stringified version.
            var stringValue = Object.prototype.toString.call(value);

            // Check to see if the string represtnation denotes array.
            return stringValue.toLowerCase() === "[object array]";
        };

        // ------------------------------------------------------ //
        // ------------------------------------------------------ //

        // Define the class methods.
        $et.prototype = {
            __has: function __has(values, result) {
                var _this = this;

                return !!values.find(function (value) {
                    return _this.__equals(value, result);
                });
            },
            __hasN: function __hasN(N, values, match) {
                var _this2 = this;

                return values.find(function (value) {
                    return _this2.__equals(value[N], match);
                });
            },
            __equals: function __equals(x, y) {
                var _this3 = this;

                // if(x.__input) x = x.__input;
                // if(y.__input) y = y.__input;
                if (x === null || x === undefined || y === null || y === undefined) {
                    return x === y;
                }
                // after this just checking type of one would be enough
                if (x.constructor !== y.constructor) {
                    return false;
                }
                // if they are functions, they should exactly refer to same one (because of closures)

                if (x instanceof Function) {
                    return x === y;
                }
                // if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
                if (x instanceof RegExp) {
                    return x === y;
                }
                if (x === y || x.valueOf() === y.valueOf()) {
                    return true;
                }
                if (Array.isArray(x) && x.length !== y.length) {
                    return false;
                }
                // if they are dates, they must had equal valueOf
                if (x instanceof Date) {
                    return false;
                }

                // if they are strictly equal, they both need to be object at least
                if (!(x instanceof Object)) {
                    return false;
                }
                if (!(y instanceof Object)) {
                    return false;
                }

                for (var p in x) {
                    if (p == "__proto__") console.log("PROTO");
                    if (!this.__equals(x[p], y[p])) return false;
                }
                for (var p in y) {
                    if (!this.__equals(x[p], y[p])) return false;
                }
                return true;
                // recursive object equality check
                var p = Object.keys(x);
                return Object.keys(y).every(function (i) {
                    return p.indexOf(i) !== -1;
                }) && p.every(function (i) {
                    return _this3.__equals(x[i], y[i]);
                });
            },

            concat: function concat() {
                var _this4 = this;

                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                return this.__proto__.concat.call(this, args.filter(function (v) {
                    var found = _this4.findIndex(function (v2) {
                        return _this4.__equals(v, v2);
                    });
                    return found == -1;
                }));
            },
            push: function push() {
                var _this5 = this;

                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    args[_key2] = arguments[_key2];
                }

                return args.map(function (v) {
                    var found = _this5.findIndex(function (v2) {
                        return _this5.__equals(v, v2);
                    });
                    if (found == -1) {
                        return _this5.__proto__.push.call(_this5, v) - 1;
                    };
                    return found;
                });
            },
            add: function add(value) {

                // Check to see if the item is an array.
                if ($et.isArray(value)) {

                    // Add each item in the array.
                    for (var i = 0; i < value.length; i++) {

                        // Add the sub-item using default push() method.
                        Array.prototype.push.call(this, value[i]);
                    }
                } else {

                    // Use the default push() method.
                    Array.prototype.push.call(this, value);
                }

                // Return this object reference for method chaining.
                return this;
            },

            // I add all the given items to the collection.
            addAll: function addAll() {

                // Loop over all the arguments to add them to the
                // collection individually.
                for (var i = 0; i < arguments.length; i++) {

                    // Add the given value.
                    this.add(arguments[i]);
                }

                // Return this object reference for method chaining.
                return this;
            }

        };

        // ------------------------------------------------------ //
        // ------------------------------------------------------ //
        // ------------------------------------------------------ //
        // ------------------------------------------------------ //

        // Return the collection constructor.
        return $et;
    }.call({});

    function functionResult(obj) {
        obj;
    }
});
//# sourceMappingURL=C:\wamp\www\Relate.js\GOoP\$et.js.map