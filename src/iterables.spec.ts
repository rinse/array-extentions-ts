import { drop, dropWhile, iterate, repeat, take, takeWhile, unfoldr } from "./iterables";

describe("take", () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    test("gives a specific number of elements", () => {
        const actual = take(input, 3);
        expect([...actual]).toEqual([1, 2, 3]);
    });
    test("gives the while input in case the count is smaller than the length of the input", () => {
        const actual = take(input, 20);
        expect([...actual]).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
    test("gives nothing in case the count is equal to 0", () => {
        const actual = take(input, 0);
        expect([...actual]).toEqual([]);
    });
    test("gives nothing in case the count is less than 0", () => {
        const actual = take(input, -1);
        expect([...actual]).toEqual([]);
    });
});

describe("drop", () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    test("drops a specific number of elements", () => {
        const actual = drop(input, 7);
        expect([...actual]).toEqual([8, 9, 10]);
    });
    test("drops the while input in case the count is smaller than the length of the input", () => {
        const actual = drop(input, 10);
        expect([...actual]).toEqual([]);
    });
    test("drops nothing in case the count is equal to 0", () => {
        const actual = drop(input, 0);
        expect([...actual]).toEqual(input);
    });
    test("drops nothing in case the count is less than 0", () => {
        const actual = drop(input, -1);
        expect([...actual]).toEqual(input);
    });
});

describe("takeWhile", () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    test("gives a specific number of elements", () => {
        const actual = takeWhile(input, e => e < 5);
        expect([...actual]).toEqual([1, 2, 3, 4]);
    });
});

describe("dropWhile", () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    test("gives a specific number of elements", () => {
        const actual = dropWhile(input, e => e < 5);
        expect([...actual]).toEqual([5, 6, 7, 8, 9, 10]);
    });
});

describe("iterate", () => {
    test("generates an infinate iterable with the given function repeatedly applied", () => {
        const iterated = iterate(1, e => e + 1);
        const actual = take(iterated, 10);
        expect([...actual]).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });
});

describe("repeat", () => {
    test("generates an infinate iterable of repeated elements", () => {
        const repeated = repeat(1);
        const actual = take(repeated, 3);
        expect([...actual]).toEqual([1, 1, 1]);
    });
});

describe("unfoldr", () => {
    test("builds a list from a seed", () => {
        const fizzBuzz = unfoldr(i => {
            if (i % 3 === 0 && i % 5 === 0) {
                return ["fizzBuzz", i + 1];
            } else if (i % 3 === 0) {
                return ["fizz", i + 1];
            } else if (i % 5 === 0) {
                return ["buzz", i + 1];
            } else {
                return [`${i}`, i + 1];
            }
        }, 1);
        const actual = take(fizzBuzz, 15);
        expect([...actual]).toEqual([
            "1", "2", "fizz", "4", "buzz", "fizz", "7", "8", "fizz", "buzz", "11", "fizz", "13", "14", "fizzBuzz",
        ]);
    });
});

