export type _CallbackFn<T, R> = (value: T, index: number, array: T[]) => R;

/**
 * Takes the first element and the rest of array.
 *
 * @param values
 * @returns {@code undefined} if a given array is empty.
 */
export function head<T>(values: T[]): [T, T[]] | undefined {
    const ret = [...values];
    const head = ret.shift();
    return head !== undefined ? [head, ret] : undefined;
}

/**
 * Takes the last element and the rest of array.
 *
 * @param values
 * @returns {@code undefined} if a given array is empty.
 */
export function last<T>(values: T[]): [T[], T] | undefined {
    const ret = [...values];
    const last = ret.pop();
    return last !== undefined ? [ret, last] : undefined;
}

/**
 * True if a given array is empty.
 *
 * @param values
 * @returns
 */
export function isEmpty<T>(values: T[]): boolean {
    return values.length === 0;
}

/**
 * True if a given array is not empty.
 *
 * @param values
 * @returns
 */
export function isNotEmpty<T>(values: T[]): boolean {
    return values.length !== 0;
}

/**
 * Gets a default value from a supplier if a given array is empty.
 * Returns itself otherwise.
 *
 * @param values
 * @param defaultValue Runs only when the array is empty.
 * @returns
 */
export function ifEmpty<T>(values: T[], defaultValue: () => T[]): T[] {
    return isNotEmpty(values) ? values : defaultValue();
}

/**
 * Inserts an element between each element of an array.
 *
 * @param values
 * @param element An element to be inserted.
 * @returns
 */
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

/**
 * Selects elements satisfy a given predicate.
 * This is a concurrent function; elements are evaluated in parallel.
 *
 * @param values
 * @param pred
 * @returns
 */
export async function filterP<T>(values: T[], pred: _CallbackFn<T, Promise<boolean>>): Promise<T[]> {
    const ret: T[] = [];
    await mapP_(values, async (value, index, array) => {
        if (await pred(value, index, array)) {
            ret.push(value);
        }
    });
    return ret;
}

/**
 * Do mapping and filtering at the same time.
 *
 * @param values
 * @param mapper Mapping function. Return {@code undefined} to skip the element.
 * @returns
 */
export function filterMap<T, U>(values: T[], mapper: _CallbackFn<T, U | undefined>): U[] {
    return filterNotUndefined(values.map(mapper));
}

/**
 * Do mapping and filtering at the same time.
 * This is a concurrent function; elements are evaluated in parallel.
 *
 * @param values
 * @param mapper Mapping function. Return {@code undefined} to skip the element.
 * @returns
 */
export async function filterMapP<T, U>(values: T[], mapper: _CallbackFn<T, Promise<U | undefined>>): Promise<U[]> {
    return filterNotUndefined(await mapP(values, mapper));
}

/**
 * Removes null values.
 *
 * @param values
 * @returns
 */
export function filterNotNull<T>(values: (T | null)[]) : T[] {
    return values.flatMap(value => value !== null ? [value] : []);
}

/**
 * Removes undefined values.
 *
 * @param values
 * @returns
 */
export function filterNotUndefined<T>(values: (T | undefined)[]) : T[] {
    return values.flatMap(value => value !== undefined ? [value] : []);
}

/**
 * Removes null values and undefined values.
 *
 * @param values
 * @returns
 */
export function filterNotNullNorUndefined<T>(values: (T | undefined | null)[]): T[] {
    return filterNotUndefined(filterNotNull(values));
}

/**
 * Gets the first value satisfies a given predicate.
 * Returns {@code undefined} if no elements satisfies the predicate.
 * This is a non-concurrent function; elements are evaluated in series.
 *
 * @param values
 * @param pred
 * @returns
 */
export async function findP<T>(values: T[], pred: _CallbackFn<T, Promise<boolean>>): Promise<T | undefined> {
    const i = await findIndexP(values, pred);
    if (i !== -1) {
        return values[i];
    }
}

/**
 * Gets an index of the first value satisfies a given predicate.
 * Returns {@code -1} if no elements satisfies the predicate.
 * This is a non-concurrent function; elements are evaluated in series.
 *
 * @param values
 * @param pred
 * @returns
 */
export async function findIndexP<T>(values: T[], pred: _CallbackFn<T, Promise<boolean>>): Promise<number> {
    for (let i = 0; i < values.length; ++i) {
        const value = values[i];
        if (await pred(value, i, values)) {
            return i;
        }
    }
    return -1;
}

/**
 * Gets the last value satisfies a given predicate.
 * Returns {@code undefined} if no elements satisfies the predicate.
 * This is a non-concurrent function; elements are evaluated in series.
 *
 * @param values
 * @param pred
 * @returns
 */
export async function findLastP<T>(values: T[], pred: _CallbackFn<T, Promise<boolean>>): Promise<T | undefined> {
    const i = await findLastIndexP(values, pred);
    if (i !== -1) {
        return values[i];
    }
}

/**
 * Gets an index of the last value satisfies a given predicate.
 * Returns {@code -1} if no elements satisfies the predicate.
 * This is a non-concurrent function; elements are evaluated in series.
 *
 * @param values
 * @param pred
 * @returns
 */
export async function findLastIndexP<T>(values: T[], pred: _CallbackFn<T, Promise<boolean>>): Promise<number> {
    for (let i = values.length - 1; 0 <= i; --i) {
        const value = values[i];
        if (await pred(value, i, values)) {
            return i;
        }
    }
    return -1;
}

/**
 * Maps each elements and then flattens the result.
 * This is a concurrent function; elements are evaluated in parallel.
 *
 * @param values
 * @param mapper
 * @returns
 */
export async function flatMapP<T, U>(values: T[], mapper: _CallbackFn<T, Promise<U[]>>): Promise<U[]> {
    const a = await mapP(values, mapper);
    return a.flat();
}

/**
 * Runs a given processor for each element.
 * This is a concurrent function; elements are evaluated in parallel.
 *
 * @param values
 * @param proc
 * @returns
 */
export async function forEachP<T>(values: T[], proc: _CallbackFn<T, Promise<void>>): Promise<void> {
    return mapP_(values, proc);
}

/**
 * Makes a map by grouping an array with a given key selector.
 *
 * @param values
 * @param keySelector
 * @returns
 */
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

/**
 * Makes a map by grouping an array with a given key selector.
 * This is a concurrent function; elements are evaluated in parallel.
 *
 * @param values
 * @param keySelector
 * @returns
 */
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

/**
 * Maps a value by an asynchronous mapper.
 * This is a concurrent function; elements are evaluated in parallel.
 *
 * @param values
 * @param mapper
 * @returns
 */
export async function mapP<T, U>(values: T[], mapper: _CallbackFn<T, Promise<U>>): Promise<U[]> {
    return Promise.all(values.map(mapper));
}

/**
 * Maps a value by an asynchronous mapper but the mapper returns {@code void}.
 * This is the same function to the {@link forEachP}.
 * This is a concurrent function; elements are evaluated in parallel.
 *
 * @param values
 * @param mapper
 * @returns
 */
export async function mapP_<T>(values: T[], mapper: _CallbackFn<T, Promise<void>>): Promise<void> {
    await mapP(values, mapper);
}

/**
 * Enumerates all permutations of the array.
 *
 * @param values
 * @returns
 */
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

/**
 * Do reduction by an asynchronous reducer.
 * This is a non-concurrent function; elements are evaluated in series.
 *
 * @param values
 * @param reducer
 * @param initialValue
 * @returns
 */
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

/**
 * Do right-to-left reduction by an asynchronous reducer.
 * This is a non-concurrent function; elements are evaluated in series.
 *
 * @param values
 * @param reducer
 * @param initialValue
 * @returns
 */
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

/**
 * Takes the first `n` elements of the array.
 * Returns an empty array if {@code n <= 0}.
 *
 * @param values
 * @param n
 * @returns
 */
export function take<T>(values: T[], n: number): T[] {
    let i = 0;
    return takeWhile(values, () => i++ < n);
}

/**
 * Takes the elements while the predicate returns `true`.
 *
 * @param values
 * @param pred
 * @returns
 */
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

/**
 * Takes the elements while the predicate returns `true`.
 * This is a non-concurrent function; elements are evaluated in series.
 *
 * @param values
 * @param pred
 * @returns
 */
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

/**
 * Drops the first `n` elements of the array.
 *
 * @param values
 * @param n
 * @returns
 */
export function drop<T>(values: T[], n: number): T[] {
    let i = n;
    return dropWhile(values, () => 0 < i--);
}

/**
 * Drops elements while the predicate returns true.
 *
 * @param values
 * @param pred
 * @returns
 */
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

/**
 * Drops elements while the predicate returns {@code true}.
 * This is a non-concurrent function; elements are evaluated in series.
 *
 * @param values
 * @param pred
 * @returns
 */
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

/**
 * Returns {@code true} if all elements satisfy a given predicate.
 * This is a concurrent function; elements are evaluated in parallel,
 * which means elements after the first occurrence of a falsy value may be evaluated,
 * unlike {@link Array.prototype.every}.
 *
 * @param values
 * @param pred
 * @returns
 */
export async function everyP<T>(values: T[], pred: _CallbackFn<T, Promise<boolean>>): Promise<boolean> {
    const results = await mapP(values, pred);
    return results.every(identity);
}

/**
 * Returns {@code true} if some elements satisfy a given predicate.
 * This is a concurrent function; elements are evaluated in parallel,
 * which means elements after the first occurrence of a truthy value may be evaluated,
 * unlike {@link Array.prototype.some}.
 *
 * @param values
 * @param pred
 * @returns
 */
export async function someP<T>(values: T[], pred: _CallbackFn<T, Promise<boolean>>): Promise<boolean> {
    const results = await mapP(values, pred);
    return results.some(identity);
}

function identity<T>(a: T): T {
    return a;
}

/**
 * Zips two arrays into an array of pairs.
 * In case two arrays have different lengths,
 * the resulting array has the length of shorter one.
 *
 * @param a The first array.
 * @param b The second array, may be an iterable.
 * @returns
 */
export function zip<A, B>(a: A[], b: Iterable<B>): [A, B][] {
    return zipWith(a, b, (a, b) => [a, b]);
}

/**
 * Zips two arrays with the given zipper function.
 * In case two arrays have different lengths,
 * the resulting array has the length of shorter one.
 *
 * @param a The first array.
 * @param b The second array, may be an iterable.
 * @returns
 */
export function zipWith<A, B, C>(a: A[], b: Iterable<B>, zipper: (a: A, b: B, index: number) => C): C[] {
    const gen = zipWithG(a, b, zipper);
    return [...gen];
}

/**
 * Iterates two arrays at the same time.
 * In case two arrays have different lengths,
 * the zipper function runs a count of a length of the shorter one.
 *
 * @param a The first array.
 * @param b The second array, may be an iterable.
 */
export function zipWith_<A, B>(a: A[], b: Iterable<B>, zipper: (a: A, b: B, index: number) => void) {
    zipWith(a, b, zipper);
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

/**
 * Zips two arrays with the given zipper function.
 * In case two arrays have different lengths,
 * the resulting array has the length of shorter one.
 * This is a concurrent function; elements are evaluated in parallel.
 *
 * @param a The first array.
 * @param b The second array, may be an iterable.
 * @returns
 */
export async function zipWithP<A, B, C>(a: A[], b: Iterable<B>, zipper: (a: A, b: B, index: number) => Promise<C>): Promise<C[]> {
    return Promise.all(zipWith(a, b, zipper));
}

/**
 * Iterates two arrays at the same time.
 * In case two arrays have different lengths,
 * the zipper function runs a count of a length of the shorter one.
 * This is a concurrent function; elements are evaluated in parallel.
 *
 * @param a The first array.
 * @param b The second array, may be an iterable.
 * @returns
 */
export async function zipWithP_<A, B>(a: A[], b: Iterable<B>, zipper: (a: A, b: B, index: number) => Promise<void>): Promise<void> {
    await Promise.all(zipWith(a, b, zipper));
}
