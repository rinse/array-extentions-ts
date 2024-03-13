import {
    drop, dropWhile, dropWhileP,
    filterMap, filterMapP, filterNotNull, filterNotNullNorUndefined, filterNotUndefined, filterP,
    findIndexP, findLastIndexP, findLastP, findP, flatMapP, forEachP, groupBy, head, ifEmpty,
    intersperse, isEmpty, isNotEmpty, last, mapP, mapP_, permutations, reduceP,
    take, takeWhile, takeWhileP, zip, zipWith, zipWithP,
} from "./pure";

describe("head", () => {
    test("takes the first element and the rest of elements", () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const actual = head(input);
        expect(actual).toEqual([1, [2, 3, 4, 5, 6, 7, 8, 9, 10]]);
    });
    test("returns undefined for an empty array", () => {
        const actual = head([]);
        expect(actual).toEqual(undefined);
    });
});

describe("last", () => {
    test("takes the last element and the rest of elements", () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const actual = last(input);
        expect(actual).toEqual([[1, 2, 3, 4, 5, 6, 7, 8, 9], 10]);
    });
    test("returns undefined for an empty array", () => {
        const actual = last([]);
        expect(actual).toEqual(undefined);
    });
});

describe("isEmpty", () => {
    test("returns true if the array is empty", () => {
        const actual = isEmpty([]);
        expect(actual).toBe(true);
    });
    test("returns false if the array is not empty", () => {
        const actual = isEmpty([1, 2, 3]);
        expect(actual).toBe(false);
    });
});

describe("isNotEmpty", () => {
    test("returns true if the array is not empty", () => {
        const actual = isNotEmpty([1, 2, 3]);
        expect(actual).toBe(true);
    });
    test("returns false if the array is empty", () => {
        const actual = isNotEmpty([]);
        expect(actual).toBe(false);
    });
});

describe("ifEmpty", () => {
    test("returns the given input as it is if it is not empty", () => {
        const actual = ifEmpty([1, 2, 3], () => [4, 5, 6]);
        expect(actual).toEqual([1, 2, 3]);
    });
    test("returns the value of defaultValue() if an input is empty", () => {
        const actual = ifEmpty([], () => [4, 5, 6]);
        expect(actual).toEqual([4, 5, 6]);
    });
    test("doesn't call defaultValue() if it is not empty", () => {
        const mock = jest.fn(() => [4, 5, 6]);
        ifEmpty([1, 2, 3], () => mock());
        expect(mock).toHaveBeenCalledTimes(0);
    });
});

describe("intersperse", () => {
    test("inserts an element between each element of an array", () => {
        const actual = intersperse([1, 2, 3, 4, 5], 0);
        expect(actual).toEqual([1, 0, 2, 0, 3, 0, 4, 0, 5]);
    });
    test("do nothing if the input array has no elements", () => {
        const actual = intersperse([], 0);
        expect(actual).toEqual([]);
    });
    test("do nothing if the input array has only one element", () => {
        const actual = intersperse([1], 0);
        expect(actual).toEqual([1]);
    });
});

describe("filterP", () => {
    test("normal case", async () => {
        const actual = await filterP([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], async e => {
            return e % 2 === 0;
        });
        expect(actual).toEqual([2, 4, 6, 8, 10]);
    });
    test("process elements asynchronously", async () => {
        const start = performance.now();
        await filterP([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], async e => {
            await sleep(100);
            return e % 2 === 0;
        });
        const end = performance.now();
        const actual = end - start;
        // Expects 90 <= actual <= 110
        expect(actual).toBeGreaterThanOrEqual(90);
        expect(actual).toBeLessThanOrEqual(110);
    });
});

describe("filterMap", () => {
    test("normal case", () => {
        const actual = filterMap([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], e => {
            if (e % 2 === 0) {
                return e * 2;
            }
        });
        expect(actual).toEqual([4, 8, 12, 16, 20]);
    });
    test("gives indices", () => {
        const actual = filterMap([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (e, index) => {
            return index;
        });
        expect(actual).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
    test("gives array", () => {
        const actual = filterMap([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], (e, index, array) => {
            return array;
        });
        expect(actual).toEqual(
            repeat([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 10)
        );
    });
});

describe("filterMapP", () => {
    test("normal case", async () => {
        const actual = await filterMapP([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], async e => {
            if (e % 2 === 0) {
                return e * 2;
            }
        });
        expect(actual).toEqual([4, 8, 12, 16, 20]);
    });
    test("gives indices", async () => {
        const actual = await filterMapP([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], async (e, index) => {
            return index;
        });
        expect(actual).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
    test("gives array", async () => {
        const actual = await filterMapP([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], async (e, index, array) => {
            return array;
        });
        expect(actual).toEqual(
            repeat([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 10)
        );
    });
});

describe("filterNotNull", () => {
    test("returns an array of a nonnull type", () => {
        const actual: Array<number> = filterNotNull([1, 2, 3, 4, 5, null, 6, 7, 8, null, 9, 10]);
        expect(actual).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
    test("leaves undefined values as it is", () => {
        const actual: Array<number | undefined> = filterNotNull([1, 2, 3, 4, 5, undefined, 6, 7, 8, null, 9, 10]);
        expect(actual).toEqual([1, 2, 3, 4, 5, undefined, 6, 7, 8, 9, 10]);
    });
});

describe("filterNotUndefined", () => {
    test("returns an array of a non-undefined type", () => {
        const actual: Array<number> = filterNotUndefined([1, 2, 3, 4, 5, undefined, 6, 7, 8, undefined, 9, 10]);
        expect(actual).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
    test("leaves null values as it is", () => {
        const actual: Array<number | null> = filterNotUndefined([1, 2, 3, 4, 5, undefined, 6, 7, 8, null, 9, 10]);
        expect(actual).toEqual([1, 2, 3, 4, 5, 6, 7, 8, null, 9, 10]);
    });
});

describe("filterNotNullNorUndefined", () => {
    test("returns an array of a not null nor undefined type", () => {
        const actual: Array<number> = filterNotNullNorUndefined([1, 2, 3, 4, 5, null, 6, 7, 8, undefined, 9, 10]);
        expect(actual).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
});

describe("findP", () => {
    test("normal case", async () => {
        const actual = await findP(["Hello", "Beautiful", "World"], async s => s.length === 5);
        expect(actual).toEqual("Hello");
    });
});

describe("findIndexP", () => {
    test("normal case", async () => {
        const actual = await findIndexP(["Hello", "Beautiful", "World"], async s => s.length === 5);
        expect(actual).toBe(0);
    });
});

describe("findLastP", () => {
    test("normal case", async () => {
        const actual = await findLastP(["Hello", "Beautiful", "World"], async s => s.length === 5);
        expect(actual).toEqual("World");
    });
});

describe("findLastIndexP", () => {
    test("normal case", async () => {
        const actual = await findLastIndexP(["Hello", "Beautiful", "World"], async s => s.length === 5);
        expect(actual).toBe(2);
    });
});

describe("flatMapP", () => {
    test("normal case", async () => {
        const actual: Array<number> = await flatMapP([1, 2, 3], async n => [n, -n]);
        expect(actual).toEqual([1, -1, 2, -2, 3, -3]);
    });
});

describe("forEachP is the same to mapP_", () => {
    test("normal case", async () => {
        const fn = jest.fn();
        await forEachP([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], async e => {
            fn();
        });
        expect(fn).toHaveBeenCalledTimes(10);
    });
});

describe("groupBy", () => {
    test("groups by a given key", () => {
        const actual = groupBy([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], value => {
            return value % 2 === 0 ? "even" : "odd";
        });
        expect(actual).toEqual(
            new Map([
                ["even", [2, 4, 6, 8, 10]],
                ["odd", [1, 3, 5, 7, 9]],
            ]));
    });
});

describe("mapP", () => {
    test("normal case", async () => {
        const actual = await mapP([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], async e => {
            await sleep(0);
            return e;
        })
        expect(actual).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
    test("gives indices", async () => {
        const actual = await mapP([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], async (e, index) => {
            return index;
        })
        expect(actual).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
    test("gives array", async () => {
        const actual = await mapP([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], async (e, index, array) => {
            return array;
        });
        expect(actual).toEqual(
            repeat([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 10)
        );
    });
});

describe("mapP_", () => {
    test("normal case", async () => {
        const fn = jest.fn();
        await mapP_([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], async e => {
            fn();
        });
        expect(fn).toHaveBeenCalledTimes(10);
    });
    test("gives indices", async () => {
        const actual: Array<number> = [];
        await mapP_([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], async (e, index) => {
            actual.push(index);
        });
        expect(actual).toHaveLength(10);
    });
    test("gives array", async () => {
        const actual: Array<Array<number>> = [];
        await mapP_([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], async (e, index, array) => {
            actual.push(array);
        });
        expect(actual).toEqual(
            repeat([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 10)
        );
    });
});

describe("permutations", () => {
    test("enumerates permutations", () => {
        const actual = permutations([1, 2, 3])
        expect(actual).toEqual([
            [1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]
        ]);
    });
});

describe("reduceP", () => {
    test("behaves the save to reduce except handling of promise", async () => {
        const input = [[0, 1], [2, 3], [4, 5]];
        const init = [6, 7];
        const actual = await reduceP(input, async (acc, e) => acc.concat(e), init);
        const expected = input.reduce((acc, e) => acc.concat(e), init);
        expect(actual).toEqual(expected);
    });
});

describe("repeat", () => {
    test("repeats an array for the given times", () => {
        const input = [0, 1];
        const actual = repeat(input, 10);
        expect(actual).toEqual([[0, 1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1], [0, 1]]);
    });
});

describe("take", () => {
    test("takes the first n items from an array", () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const actual = take(input, 3);
        expect(actual).toEqual([1, 2, 3]);
    });
    test("returns itself when n >= input.length", () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const actual = take(input, 20);
        expect(actual).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
    test("returns an empty array when n === 0", () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const actual = take(input, 0);
        expect(actual).toEqual([]);
    });
    test("returns an empty array when n < 0", () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const actual = take(input, -1);
        expect(actual).toEqual([]);
    });
});

describe("takeWhile", () => {
    test("takes while the items returns true", () => {
        const input = [1, 2, 3, 4, 5, 4, 3, 2, 1];
        const actual = takeWhile(input, n => n < 5);
        expect(actual).toEqual([1, 2, 3, 4]);
    });
});

describe("takeWhileP", () => {
    test("takes while the items returns true", async () => {
        const input = [1, 2, 3, 4, 5, 4, 3, 2, 1];
        const actual = await takeWhileP(input, async n => n < 5);
        expect(actual).toEqual([1, 2, 3, 4]);
    });
});

describe("drop", () => {
    test("drops the first n items from an array", () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const actual = drop(input, 3);
        expect(actual).toEqual([4, 5, 6, 7, 8, 9, 10]);
    });
    test("returns an empty array when n >= input.length", () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const actual = drop(input, 20);
        expect(actual).toEqual([]);
    });
    test("returns itself when n === 0", () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const actual = drop(input, 0);
        expect(actual).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
    test("returns itself when n < 0", () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const actual = drop(input, -1);
        expect(actual).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
});

describe("dropWhile", () => {
    test("drops while the items returns true", () => {
        const input = [1, 2, 3, 4, 5, 4, 3, 2, 1];
        const actual = dropWhile(input, n => n < 5);
        expect(actual).toEqual([5, 4, 3, 2, 1]);
    });
});

describe("dropWhileP", () => {
    test("drops while the items returns true", async () => {
        const input = [1, 2, 3, 4, 5, 4, 3, 2, 1];
        const actual = await dropWhileP(input, async n => n < 5);
        expect(actual).toEqual([5, 4, 3, 2, 1]);
    });
});

describe("zip", () => {
    test("zips two arrays in a pair", () => {
        const input1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const input2 = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
        const actual = zip(input1, input2);
        expect(actual).toEqual([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd'], [5, 'e'], [6, 'f'], [7, 'g'], [8, 'h'], [9, 'i'], [10, 'j']]);
    });
    test("disposes the remains if the two arrays has different length", () => {
        const input1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
        const input2 = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
        const actual = zip(input1, input2);
        expect(actual).toEqual([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd'], [5, 'e'], [6, 'f'], [7, 'g'], [8, 'h'], [9, 'i'], [10, 'j']]);
    });
    test("can handle infinite iterable", () => {
        const input1 = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
        const actual = zip(input1, iterate(0, n => n + 1));
        expect(actual).toEqual([['a', 0], ['b', 1], ['c', 2], ['d', 3], ['e', 4], ['f', 5], ['g', 6], ['h', 7], ['i', 8], ['j', 9]]);
    });
});

describe("zipWith", () => {
    test("zips two arrays with a given function", () => {
        const input1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const input2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const actual = zipWith(input1, input2, (a, b) => a + b);
        expect(actual).toEqual([2, 4, 6, 8, 10, 12, 14, 16, 18, 20]);
    });
    test("gives indices", () => {
        const input1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const input2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const actual = zipWith(input1, input2, (a, b, index) => index);
        expect(actual).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
});

describe("zipWithP", () => {
    test("behaves the same expect handing of promise", async () => {
        const input1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const input2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const actual = await zipWithP(input1, input2, async (a, b) => a + b);
        const expected = zipWith(input1, input2, (a, b) => a + b);
        expect(actual).toEqual(expected);
    });
    test("gives indices", async () => {
        const input1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const input2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const actual = zipWith(input1, input2, (a, b, index) => index);
        expect(actual).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
});

function sleep(milliseconds: number): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, milliseconds);
    });
}

function repeat<T>(value: T, count: number): T[] {
    const ret = [];
    for (let i = 0; i < count; ++i) {
        ret.push(value);
    }
    return ret;
}

function* iterate<T>(initialValue: T, f: (value: T) => T) {
    let value = initialValue;
    while (true) {
        yield value;
        value = f(value);
    }
}
