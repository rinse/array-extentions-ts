export function* take<T>(values: Iterable<T>, count: number) {
    let i = 0;
    for (const value of values) {
        if (i < count) {
            yield value;
        } else {
            break;
        }
        ++i;
    }
}

export function* drop<T>(values: Iterable<T>, count: number) {
    let i = 0;
    for (const value of values) {
        if (i < count) {
            ++i;    // increment i here so it won't overflow
            continue;
        }
        yield value;
    }
}

export function* takeWhile<T>(values: Iterable<T>, pred: (value: T) => boolean) {
    let i = 0;
    for (const value of values) {
        if (pred(value)) {
            yield value;
        } else {
            break;
        }
        ++i;
    }
}

export function* dropWhile<T>(values: Iterable<T>, pred: (value: T) => boolean) {
    let i = 0;
    for (const value of values) {
        if (pred(value)) {
            ++i;    // increment i here so it won't overflow
            continue;
        }
        yield value;
    }
}

export function* filter<T>(values: Iterable<T>, pred: (value: T) => boolean) {
    for (const value of values) {
        if (pred(value)) {
            yield value;
        }
    }
}

export function* iterate<T>(value: T, f: (value: T) => T) {
    yield value;
    yield* unfoldr(value => [f(value), f(value)], value);
}

export function* repeat<T>(value: T) {
    yield* unfoldr(value => [value, value], value);
}

export function* unfoldr<T, U>(f: (value: U) => ([T, U] | null), initialValue: U) {
    let seed = initialValue;
    while (true) {
        const result = f(seed);
        if (result === null) {
            break;
        }
        const [value, newSeed] = result;
        yield value;
        seed = newSeed;
    }
}
