// λx.λy.y  fun x -> fun y -> y
var False = function (x) {
    return function (y) {
        return y;
    };
};
// λx.λy.x
var True = function (x) {
    return function (y) {
        return x;
    };
};

// λx.y.x y False
var And = function (x) {
    return function (y) {
        return x(y)(function (x) {
            return function (y) {
                return y;
            };
        });
    }
};

var falseAndFalse = And(False)(False);
var falseAndTrue = And(False)(True);
var trueAndFalse = And(True)(False);
var trueAndTrue = And(True)(True);

var churchToBoolean = function (f) {
    return f(true)(false);
};

console.log('And False False', churchToBoolean(falseAndFalse));
console.log('And False True', churchToBoolean(falseAndTrue));
console.log('And True False', churchToBoolean(trueAndFalse));
console.log('And True True', churchToBoolean(trueAndTrue));

// λx.y.x True y
// λx.y.x (λa.λb.a) y
// fun x -> fun y -> x (fun x -> fun y -> x) y
var Or = function (x) {
    return function (y) {
        return x(function (x) {
            return function (y) {
                return x;
            };
        })(y);
    };
};

var trueOrTrue = Or(True)(True);
var trueOrFalse = Or(True)(False);
var falseOrTrue = Or(False)(True);
var falseOrFalse = Or(False)(False);

console.log('Or True True', churchToBoolean(trueOrTrue));
console.log('Or True False', churchToBoolean(trueOrFalse));
console.log('Or False True', churchToBoolean(falseOrTrue));
console.log('Or False False', churchToBoolean(falseOrFalse));

// λx.x False True
// var Not = function (x) { return x(False)(True); };
var Not = function (x) {
    return x(function (x) {
        return function (y) {
            return y;
        };
    })(function (x) {
        return function (y) {
            return x;
        };
    });
};

var notTrue = Not(True);
var notFalse = Not(False);

console.log('Not True', churchToBoolean(notTrue));
console.log('Not False', churchToBoolean(notFalse));

// 0 := λf.λn.n
var _0 = function (f) {
    return function (n) {
        return n;
    };
};
// 1 := λf.λn.f n
var _1 = function (f) {
    return function (n) {
        return f(n);
    };
};
// 2 := λf.λn.f(f n)
var _2 = function (f) {
    return function (n) {
        return f(f(n));
    };
};
// 3 := λf.λn.f(f(f n))
var _3 = function (f) {
    return function (n) {
        return f(f(f(n)));
    };
};
// 4 := λf.λn.f(f(f(f n)))
var _4 = function (f) {
    return function (n) {
        return f(f(f(f(n))));
    };
};

var churchToNumber = function (n) {
    return n(function (x) {
        return x + 1;
    })(0)
};

// Increase := λn.λf.λx.f(n f x)
var Increase = function (n) {
    return function (f) {
        return function (x) {
            return f(n(f)(x));
        }
    }
};

var increase0 = Increase(_0);
var increase4 = Increase(_4);
var increase3_3_times = Increase(Increase(Increase(_3)));

console.log('Increase 0:', churchToNumber(increase0));
console.log('Increase 4:', churchToNumber(increase4));
console.log('Increase(Increase(Increase(3)):', churchToNumber(increase3_3_times));

// Add := λx.λy.x λn.λf.λx.f(n f x) y
var Add = function (x) {
    return function (y) {
        return x(function (n) {
            return function (f) {
                return function (x) {
                    return f(n(f)(x));
                }
            }
        })(y);
    };
};

var add4And3 = Add(_4)(_3);
var add0And0 = Add(_0)(_0);
var add1And0 = Add(_1)(_0);
var add2And2 = Add(_2)(_2);

console.log('Add 4 3 :', churchToNumber(add4And3));
console.log('Add 0 0 :', churchToNumber(add0And0));
console.log('Add 1 0 :', churchToNumber(add1And0));
console.log('Add 2 2 :', churchToNumber(add2And2));

// Mult := λx.λy.x ((λx.λy.x λn.λf.λx.f(n f x) y) y) 0
// var Mult = function (x) { return function (y) { return x(Add(y))(_0);}};
var Mult = function (x) {
    return function (y) {
        return x((function (x) {
            return function (y) {
                return x(function (n) {
                    return function (f) {
                        return function (x) {
                            return f(n(f)(x));
                        }
                    }
                })(y);
            };
        })(y))(_0);
    }
};

var mult3By4 = Mult(_3)(_4);
var mult4By4 = Mult(_4)(_4);
var mult2By3ThenBy4 = Mult(Mult(_2)(_3))(_4);
var mult0By2 = Mult(_0)(_2);

console.log('Mult 3 4 :', churchToNumber(mult3By4));
console.log('Mult 4 4 :', churchToNumber(mult4By4));
console.log('Mult (Mult 2 3) 4 :', churchToNumber(mult2By3ThenBy4));
console.log('Mult 0 2 :', churchToNumber(mult0By2));
