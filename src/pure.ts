export type _CallbackFn<T, R> = (value: T, index: number, array: T[]) => R;

export function head<T>(values: T[]): [T, T[]] | undefined {
    const ret = [...values];
    const head = ret.shift();
    return head !== undefined ? [head, ret] : undefined;
}

export function last<T>(values: T[]): [T[], T] | undefined {
    const ret = [...values];
    const last = ret.pop();
    return last !== undefined ? [ret, last] : undefined;
}

export function isEmpty<T>(values: T[]): boolean {
    return values.length === 0;
}

export function isNotEmpty<T>(values: T[]): boolean {
    return values.length !== 0;
}

export function ifEmpty<T>(values: T[], defaultValue: () => T[]): T[] {
    return isNotEmpty(values) ? values : defaultValue();
}

export function intersperse<T>(values: T[], element: T): T[] {
    const gen = intersperseGeneric(values, element);
    return [...gen];
}

function* intersperseGeneric<T>(iterable: Iterable<T>, element: T) {
    const iterator = iterable[Symbol.iterator]();
    const result = iterator.next();
    if (result.done) {
        return;
    }
    yield result.value;
    for (const value of eniterable(iterator)) {
        yield element;
        yield value;
    }
}

function eniterable<T>(iterator: Iterator<T>) {
    return {
        [Symbol.iterator]: () => iterator,
    };
}

export async function filterP<T>(values: T[], pred: _CallbackFn<T, Promise<boolean>>): Promise<T[]> {
    const ret: T[] = [];
    await mapP_(values, async (value, index, array) => {
        if (await pred(value, index, array)) {
            ret.push(value);
        }
    });
    return ret;
}

export function filterMap<T, U>(values: T[], mapper: _CallbackFn<T, U | undefined>): U[] {
    return values.flatMap((value, index, array) => {
        const mapped = mapper(value, index, array);
        return mapped !== undefined ? [mapped] : [];
    });
}

export async function filterMapP<T, U>(values: T[], mapper: _CallbackFn<T, Promise<U | undefined>>): Promise<U[]> {
    return filterNotUndefined(await mapP(values, mapper));
}

export function filterNotNull<T>(values: (T | null)[]) : T[] {
    return values.flatMap(value => value !== null ? [value] : []);
}

export function filterNotUndefined<T>(values: (T | undefined)[]) : T[] {
    return values.flatMap(value => value !== undefined ? [value] : []);
}

export function filterNotNullNorUndefined<T>(values: (T | undefined | null)[]): T[] {
    return filterNotUndefined(filterNotNull(values));
}

export async function findP<T>(values: T[], pred: _CallbackFn<T, Promise<boolean>>): Promise<T | undefined> {
    const i = await findIndexP(values, pred);
    if (i !== -1) {
        return values[i];
    }
}

export async function findIndexP<T>(values: T[], pred: _CallbackFn<T, Promise<boolean>>): Promise<number> {
    for (let i = 0; i < values.length; ++i) {
        const value = values[i];
        if (await pred(value, i, values)) {
            return i;
        }
    }
    return -1;
}

export async function findLastP<T>(values: T[], pred: _CallbackFn<T, Promise<boolean>>): Promise<T | undefined> {
    const i = await findLastIndexP(values, pred);
    if (i !== -1) {
        return values[i];
    }
}

export async function findLastIndexP<T>(values: T[], pred: _CallbackFn<T, Promise<boolean>>): Promise<number> {
    for (let i = values.length - 1; 0 <= i; --i) {
        const value = values[i];
        if (await pred(value, i, values)) {
            return i;
        }
    }
    return -1;
}

export async function flatMapP<T, U>(values: T[], mapper: _CallbackFn<T, Promise<U[]>>): Promise<U[]> {
    const a = await mapP(values, mapper);
    return a.flat();
}

export async function forEachP<T>(values: T[], proc: _CallbackFn<T, Promise<void>>): Promise<void> {
    return mapP_(values, proc);
}

export function groupBy<T, K>(values: T[], keySelector: _CallbackFn<T, K>): Map<K, T[]> {
    const ret = new Map<K, T[]>();
    for (let i = 0; i < values.length; ++i) {
        const value = values[i];
        const key = keySelector(value, i, values);
        const mapValue = ret.get(key);
        if (mapValue === undefined) {
            ret.set(key, [value]);
        } else {
            mapValue.push(value);
        }
    }
    return ret;
}

export async function groupByP<T, K>(values: T[], keySelector: _CallbackFn<T, Promise<K>>): Promise<Map<K, T[]>> {
    const ret = new Map<K, T[]>();
    const tasks: Promise<void>[] = [];
    const createTask = async (value: T, i: number) => {
        const key = await keySelector(value, i, values);
        const mapValue = ret.get(key);
        if (mapValue === undefined) {
            ret.set(key, [value]);
        } else {
            mapValue.push(value);
        }
    };
    for (let i = 0; i < values.length; ++i) {
        const value = values[i];
        tasks.push(createTask(value, i));
    }
    await Promise.all(tasks);
    return ret;
}

export async function mapP<T, U>(values: T[], mapper: _CallbackFn<T, Promise<U>>): Promise<U[]> {
    return Promise.all(values.map(mapper));
}

export async function mapP_<T>(values: T[], mapper: _CallbackFn<T, Promise<void>>): Promise<void> {
    await mapP(values, mapper);
}

export function permutations<T>(values: T[]): T[][] {
    return [...permutationsGenerator(values)];
}

function* permutationsGenerator<T>(values: T[]): Generator<T[]> {
    if (isEmpty(values)) {
        yield [];
    }
    for (let i = 0; i < values.length; ++i) {
        const head = values[i];
        const rest = [...values];
        rest.splice(i, 1);
        for (const body of permutationsGenerator(rest)) {
            yield [head, ...body];
        }
    }
}

export async function reduceP<T, U>(
    values: T[],
    reducer: (acc: U, value: T, index: number, array: T[]) => Promise<U>,
    initialValue: U,
): Promise<U> {
    let acc = initialValue;
    for (let i = 0; i < values.length; ++i) {
        const value = values[i];
        acc = await reducer(acc, value, i, values);
    }
    return acc;
}

export async function reduceRightP<T, U>(
    values: T[],
    reducer: (acc: U, value: T, index: number, array: T[]) => Promise<U>,
    initialValue: U,
): Promise<U> {
    let acc = initialValue;
    for (let i = values.length - 1; 0 <= i; --i) {
        const value = values[i];
        acc = await reducer(acc, value, i, values);
    }
    return acc;
}

export function take<T>(values: T[], n: number): T[] {
    let i = 0;
    return takeWhile(values, () => i++ < n);
}

export function takeWhile<T>(values: T[], pred: _CallbackFn<T, boolean>): T[] {
    const ret: T[] = [];
    for (let i = 0; i < values.length; ++i) {
        const value = values[i];
        if (!pred(value, i, values)) {
            break;
        }
        ret.push(value);
    }
    return ret;
}

export async function takeWhileP<T>(values: T[], pred: _CallbackFn<T, Promise<boolean>>): Promise<T[]> {
    const ret: T[] = [];
    for (let i = 0; i < values.length; ++i) {
        const value = values[i];
        if (!await pred(value, i, values)) {
            break;
        }
        ret.push(value);
    }
    return ret;
}

async function asyncGeneratorToArray<T>(gen: AsyncGenerator<T>): Promise<T[]> {
    const ret = [];
    for await (const value of gen) {
        ret.push(value);
    }
    return ret;
}

export function drop<T>(values: T[], n: number): T[] {
    let i = n;
    return dropWhile(values, () => 0 < i--);
}

export function dropWhile<T>(values: T[], pred: _CallbackFn<T, boolean>): T[] {
    const ret = [];
    let dropping = true;
    for (let i = 0; i < values.length; ++i) {
        const value = values[i];
        if (dropping && pred(value, i, values)) {
            continue;
        }
        dropping = false;
        ret.push(value);
    }
    return ret;
}

export async function dropWhileP<T>(values: T[], pred: _CallbackFn<T, Promise<boolean>>): Promise<T[]> {
    const ret = [];
    let dropping = true;
    for (let i = 0; i < values.length; ++i) {
        const value = values[i];
        if (dropping && await pred(value, i, values)) {
            continue;
        }
        dropping = false;
        ret.push(value);
    }
    return ret;
}

export async function everyP<T>(values: T[], pred: _CallbackFn<T, Promise<boolean>>): Promise<boolean> {
    const results = await mapP(values, pred);
    return results.every(identity);
}

export async function someP<T>(values: T[], pred: _CallbackFn<T, Promise<boolean>>): Promise<boolean> {
    const results = await mapP(values, pred);
    return results.some(identity);
}

function identity<T>(a: T): T {
    return a;
}

export function zip<A, B>(a: A[], b: Iterable<B>): [A, B][] {
    return zipWith(a, b, (a, b) => [a, b]);
}

export function zipWith<A, B, C>(a: A[], b: Iterable<B>, zipper: (a: A, b: B, index: number) => C): C[] {
    const gen = zipWithG(a, b, zipper);
    return [...gen];
}

function* zipWithG<A, B, C>(a: Iterable<A>, b: Iterable<B>, zipper: (a: A, b: B, index: number) => C) {
    const aIter = a[Symbol.iterator]();
    const bIter = b[Symbol.iterator]();
    for (let i = 0; true; ++i) {
        const aResult = aIter.next();
        const bResult = bIter.next();
        if (aResult.done || bResult.done) {
            return;
        }
        yield zipper(aResult.value, bResult.value, i);
    }
}

export async function zipWithP<A, B, C>(a: A[], b: Iterable<B>, zipper: (a: A, b: B, index: number) => Promise<C>): Promise<C[]> {
    return Promise.all(zipWith(a, b, zipper));
}

export async function zipWithP_<A, B>(a: A[], b: Iterable<B>, zipper: (a: A, b: B, index: number) => Promise<void>): Promise<void> {
    await Promise.all(zipWith(a, b, zipper));
}
