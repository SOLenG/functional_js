let emptyList = {};
var list = {value: 1, next: {value: 2, next: {value: 4, next: emptyList}}};

/** adapter curring*/
var curry2 = function (f) {
    return function (arg1) {
        return function (arg2) {
            return f(arg1, arg2)
        };
    };
};

var addHead = function (item) {
    return function (list) {
        return {value: item, next: list}
    }
};

var removeHead = function (list) {
    return list === emptyList ? emptyList : list.next
};

var removeAt = function (idx) {
    return function (list) {
        return list === emptyList ? emptyList
            : idx === 0 ? removeHead(list)
            : {value: list.value, next: removeAt(idx - 1)(list.next)}
    };
};

var chain = function (list) {
    return function (callback) {
        const [head, ...tail] = callback;
        if (typeof head === "function") {
            var result = head(list);
            return chain(result)(tail);
        }
        return list;
    };
};
console.log(JSON.stringify(removeAt(1)(list)));

console.log(
    chain(emptyList)(
        [
            addHead(3),
            addHead(2),
            addHead(1),
            (function (l) {
                console.log(JSON.stringify(l));
                return l;
            })
        ]
    )
);