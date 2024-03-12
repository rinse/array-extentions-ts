import "./extensions";

describe("Array#head", () => {
    test("takes the first element and the rest of elements", () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const actual = input.head();
        expect(actual).toEqual([1, [2, 3, 4, 5, 6, 7, 8, 9, 10]]);
    });
});

describe("Array#last", () => {
    test("takes the last element and the rest of elements", () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const actual = input.last();
        expect(actual).toEqual([[1, 2, 3, 4, 5, 6, 7, 8, 9], 10]);
    });
});

describe("Array#isEmpty", () => {
    test("returns true if the array is empty", () => {
        const actual = [].isEmpty();
        expect(actual).toBe(true);
    });
});

describe("Array#isNotEmpty", () => {
    test("returns true if the array is not empty", () => {
        const actual = [1, 2, 3].isNotEmpty();
        expect(actual).toBe(true);
    });
});

describe("Array#ifEmpty", () => {
    test("returns the given input as it is if it is not empty", () => {
        const actual = [1, 2, 3].ifEmpty(() => [4, 5, 6]);
        expect(actual).toEqual([1, 2, 3]);
    });
});

describe("Array#intersperse", () => {
    test("inserts an element between each element of an array", () => {
        const actual = [1, 2, 3, 4, 5].intersperse(0);
        expect(actual).toEqual([1, 0, 2, 0, 3, 0, 4, 0, 5]);
    });
});

describe("Array#filterP", () => {
    test("normal case", async () => {
        const actual = await [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filterP(async e => {
            return e % 2 === 0;
        });
        expect(actual).toEqual([2, 4, 6, 8, 10]);
    });
});

describe("Array#filterMap", () => {
    test("normal case", () => {
        const actual = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filterMap(e => {
            if (e % 2 === 0) {
                return e * 2;
            }
        });
        expect(actual).toEqual([4, 8, 12, 16, 20]);
    });
});

describe("Array#filterMapP", () => {
    test("normal case", async () => {
        const actual = await [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filterMapP(async e => {
            if (e % 2 === 0) {
                return e * 2;
            }
        });
        expect(actual).toEqual([4, 8, 12, 16, 20]);
    });
});

describe("Array#filterNotNull", () => {
    test("returns an array of a nonnull type", () => {
        const actual: Array<number | undefined> = [1, 2, 3, 4, 5, null, 6, 7, 8, undefined, 9, 10].filterNotNull();
        expect(actual).toEqual([1, 2, 3, 4, 5, 6, 7, 8, undefined, 9, 10]);
    });
});

describe("Array#filterNotUndefined", () => {
    test("returns an array of a non-undefined type", () => {
        const actual: Array<number | null> = [1, 2, 3, 4, 5, null, 6, 7, 8, undefined, 9, 10].filterNotUndefined();
        expect(actual).toEqual([1, 2, 3, 4, 5, null, 6, 7, 8, 9, 10]);
    });
});

describe("Array#filterNotNullNorUndefined", () => {
    test("returns an array of a not null nor undefined type", () => {
        const actual: Array<number> = [1, 2, 3, 4, 5, null, 6, 7, 8, undefined, 9, 10].filterNotNullNorUndefined();
        expect(actual).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
});

describe("Array#forEachP is the same to mapP_", () => {
    test("normal case", async () => {
        const fn = jest.fn();
        await [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].forEachP(async e => {
            fn();
        });
        expect(fn).toHaveBeenCalledTimes(10);
    });
});

describe("Array#groupBy", () => {
    test("groups by a given key", () => {
        const actual = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].groupBy(value => {
            return value % 2 === 0 ? "even" : "odd";
        });
        expect(actual).toEqual(
            new Map([
                ["even", [2, 4, 6, 8, 10]],
                ["odd", [1, 3, 5, 7, 9]],
            ]));
    });
});

describe("Array#mapP", () => {
    test("normal case", async () => {
        const actual = await [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].mapP(async e => {
            await sleep(0);
            return e;
        })
        expect(actual).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
});

describe("Array#mapP_", () => {
    test("normal case", async () => {
        const fn = jest.fn();
        await [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].mapP_(async e => {
            fn();
        });
        expect(fn).toHaveBeenCalledTimes(10);
    });
});

describe("Array#reduceP", () => {
    test("behaves the save to reduce except handling of promise", async () => {
        const input = [[0, 1], [2, 3], [4, 5]];
        const init = [6, 7];
        const actual = await input.reduceP(async (acc, e) => acc.concat(e), init);
        const expected = input.reduce((acc, e) => acc.concat(e), init);
        expect(actual).toEqual(expected);
    });
});

describe("Array#take", () => {
    test("takes the first n items from an array", async () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const actual = input.take(3);
        expect(actual).toEqual([1, 2, 3]);
    });
});

describe("Array#drop", () => {
    test("drops the first n items from an array", () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const actual = input.drop(3);
        expect(actual).toEqual([4, 5, 6, 7, 8, 9, 10]);
    });
});

describe("Array#zip", () => {
    test("zips two arrays in a pair", () => {
        const input1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const input2 = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
        const actual = input1.zip(input2);
        expect(actual).toEqual([[1, 'a'], [2, 'b'], [3, 'c'], [4, 'd'], [5, 'e'], [6, 'f'], [7, 'g'], [8, 'h'], [9, 'i'], [10, 'j']]);
    });
});

describe("Array#zipWith", () => {
    test("zips two arrays with a given function", () => {
        const input1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const input2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const actual = input1.zipWith(input2, (a, b) => a + b);
        expect(actual).toEqual([2, 4, 6, 8, 10, 12, 14, 16, 18, 20]);
    });
});

describe("Array#zipWithP", () => {
    test("behaves the same expect handing of promise", async () => {
        const input1 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const input2 = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        const actual = await input1.zipWithP(input2, async (a, b) => a + b);
        const expected = input1.zipWith(input2, (a, b) => a + b);
        expect(actual).toEqual(expected);
    });
});

function sleep(milliseconds: number): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, milliseconds);
    });
}
