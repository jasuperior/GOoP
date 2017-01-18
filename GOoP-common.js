(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(["exports", "GOoP"], factory);
    } else if (typeof exports !== "undefined") {
        factory(exports, require("GOoP"));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.GOoP);
        global.GOoPCommon = mod.exports;
    }
})(this, function (exports, _GOoP) {
    "use strict";

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.Verb = Verb;

    function _toConsumableArray(arr) {
        if (Array.isArray(arr)) {
            for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
                arr2[i] = arr[i];
            }

            return arr2;
        } else {
            return Array.from(arr);
        }
    }

    var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
        return typeof obj;
    } : function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj;
    };

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
    Array.prototype.__flatten = function __flatten() {
        return this.reduce(function (a, b) {
            return a.concat(b);
        }, []);
    };
    Array.prototype.__concat = function __concat() {
        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return this.concat(args.__flatten().filter(function (v) {
            return v;
        }));
    };
    Array.prototype.split = function split(delim) {
        var count = 0,
            result = [];
        this.forEach(function (v) {
            if (v == delim) return count++;
            if (!result[count]) result[count] = [];
            result[count].push(v);
        });

        return result;
    };
    Object.prototype.GOoPtype = Object.prototype.gtype = function type(value) {
        this.__type = value;
        return this;
    };
    Object.prototype.walk = function walk(fn, deep, stop, depth) {
        var result = [],
            stop = stop || { stop: null },
            depth = depth || 0;
        // fn = eval ( `${fn.toString().replace(/return\s*?\(?(.*?)\)?/g,"return ()=>$1")}` );
        function _stop(value) {
            stop.stop = value;
            return value;
        }
        var new_depth = depth + 1;
        // console.log(depth, deep);
        if (!isNaN(deep) && depth > deep) return;

        for (var i in this) {
            if (i !== "__proto__" && i !== "walk") {
                var root = _typeof(this[i]) == "object";
                if (stop.stop) break;
                var input = [];
                input = input.__concat(fn.apply(this, [this[i], i, _stop])); // ( value, prop, root?)
                if (deep && root) {
                    input = input.__concat(this[i].walk(fn, deep, stop, new_depth));
                }
                if (input.length) {
                    result = result.__concat(input);
                    input = null;
                }
            }
        }
        return result;
    };
    function Verb(name, fn) {
        // name = !Array.isArray(name)?[name]:name;
        var nameobj = name;
        if ((typeof name === "undefined" ? "undefined" : _typeof(name)) !== "object") {
            nameobj = {
                present: name
            };
        }
        fn.__verbname = nameobj;
        fn.gtype("verb");
        (0, _GOoP.Node)(nameobj.present, fn);
    }
    (0, _GOoP.Terminator)("?", function (trail) {
        return _GOoP.Edge.connect(this, trail);
    });
    // Terminator(",", function(trail){
    //     var first = trail.slice(0,1), first_value = this[first], result;
    //     if(first_value.__type == "article") result = Edge.connect(this, trail.slice(1))._[first].$this;
    //     else result = Edge.connect(this, trail)._.$this;
    //     return result;
    //
    // });
    (0, _GOoP.Terminator)(";", function (trail) {
        var result = _GOoP.Edge.connect(this, trail)._;
        return result;
    });
    (0, _GOoP.Alias)("it");
    (0, _GOoP.Rule)("verb", function (before, after, $, $$, obj) {
        var _this = this;

        // console.log(this, before.__flatten(), after);
        obj.__state.splice(0);
        var $this = _GOoP.Edge.combine(before.__flatten()),
            args = _GOoP.Edge.combine(after);

        if (Array.isArray($this)) {
            // console.log($this,args);
            return $this.map(function (v) {
                v.__state.push([_this.present]);
                return _this.apply(v, args);
            });
        }
        return this.apply($this.length == 1 ? $this[0] : $this, args);
    });

    (0, _GOoP.Rule)("comma", function (before, after, btrail, atrail) {
        // console.log("in the comma");
        var first = before.slice(0, 1)[0],
            after = after.split(this),
            article;
        // console.log(first.__type, after[0][0].__type);
        if (first.__type == "article" && after[0][0].__type !== "article") {
            // before.splice(0,1);
            // console.log("on the article",before);
            var $after = [];
            after.find(function (v) {
                var result = v.findIndex(function (v2) {
                    return v2.__type == "verb";
                });
                if (result == -1) before = before.concat(v);else {
                    before = before.concat(v.splice(0, result));
                    $after = v;
                }
                return result == -1;
            });
            // console.log("before the result",before);
            var result = _GOoP.Edge.combine(before);
            // console.log("after the result", result);
            if ($after.length > 0 && result) {
                return _GOoP.Edge.combine([].concat(result, $after));
            };
            return result;
        } else {
            // console.log("not two articles");
            var $after = [],
                value = _GOoP.Edge.combine(before),
                $before = [value.length < 2 ? value[0] : value];

            after.find(function (v) {
                var result = v.findIndex(function (v2) {
                    return v2.__type == "verb";
                });
                if (result == -1) {
                    // console.log("there is no result so add to before [%O]", v);
                    var value = _GOoP.Edge.combine(v);
                    $before.push(value.length < 2 ? value[0] : value);
                } else {
                    // console.log("is result so add to before [%O]", v);
                    var value = _GOoP.Edge.combine(v.splice(0, result));
                    $before.push(value.length < 2 ? value[0] : value);
                    $after = v;
                }
                return result !== -1;
            });
            // $before.__series = true;
            // console.log("Before and After [%O] [%O] [%O]", $before, $after, after);
            if ($after.length > 0) {
                return _GOoP.Edge.combine([].concat($before, $after));
            }
            return $before;
        }

        var result = this.apply(_GOoP.Edge.combine(before));
        // console.log("this is the result",result);
        if (result) {
            return result._.$this.__insert(atrail);
        }
        return []._.$this.__insert(atrail);
        // return "shit"
    });
    (0, _GOoP.Rule)("possession", function (before, after, btrail, atrail, obj) {
        var $this = this.call(before.pop(), atrail.shift()),
            result;
        after.shift();btrail.pop();
        result = _GOoP.Edge.connect(obj, [].concat(_toConsumableArray(btrail), [$this], _toConsumableArray(atrail)));
        console.log(result);
        return result;
    });
    function a() {
        for (var _len2 = arguments.length, object = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
            object[_key2] = arguments[_key2];
        }

        // console.log(this);
        var subject = Object.create(object.splice(object.length - 1)[0]);
        if (object.length) {
            object.map(function (adjective) {
                return Object.assign(subject, adjective);
            });
        }
        return subject;
    }
    a.gtype("article");

    (0, _GOoP.Node)("a", a);
    (0, _GOoP.Node)("an", a);
    (0, _GOoP.Node)("the", function the(object) {
        return object;
    }.gtype("article"));
    (0, _GOoP.Node)("is", function (value) {
        Object.assign(this, value);
        return this;
    }.gtype("verb"));

    (0, _GOoP.Node)("jamel", { age: 17, skin: "brown", "hair": "bald" });
    (0, _GOoP.Node)("grow", function (amount) {
        // console.log(this, amount);
        if (amount) this.age += amount;else this.age++;
        return this;
    }.gtype("verb"));
    // Node(["ran","run"])
    (0, _GOoP.Node)("shotup", function (amount) {
        // console.log(this, amount);
        "this grow 6.";
        "this grow 8.";

        console.log(this.__state);
        return this;
    }.gtype("verb"));
    (0, _GOoP.Node)("smart", { intelligence: 1000 });
    (0, _GOoP.Node)("happy", { emotion: "happy" });
    (0, _GOoP.Node)(",", function () {
        // console.log(this);
        return this;
    }.gtype("comma"));
    (0, _GOoP.Node)("'s", function (key) {
        return this[key];
    }.gtype("possession"));
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
});
//# sourceMappingURL=C:\wamp\www\Relate.js\GOoP\GOoP-common.js.map