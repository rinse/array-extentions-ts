export type _Mapper<T, R> = (value: T, index: number, array: T[]) => R;

export function head<T>(values: T[]): [T, T[]] | null {
    const ret = [...values];
    const head = ret.shift();
    return head !== undefined ? [head, ret] : null;
}

export function last<T>(values: T[]): [T[], T] | null {
    const ret = [...values];
    const last = ret.pop();
    return last !== undefined ? [ret, last] : null;
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

export function filterMap<T, U>(values: T[], mapper: _Mapper<T, U | null>): U[] {
    return values.flatMap((value, index, array) => {
        const mapped = mapper(value, index, array);
        return mapped !== null ? [mapped] : [];
    });
}

export async function filterMapP<T, U>(values: T[], mapper: _Mapper<T, Promise<U | null>>): Promise<U[]> {
    return filterNotNull(await mapP(values, mapper));
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

export function groupBy<T, K>(values: T[], keySelector: (value: T) => K): Map<K, T[]> {
    const ret = new Map<K, T[]>();
    for (const value of values) {
        const key = keySelector(value);
        const mapValue = ret.get(key);
        if (mapValue !== undefined) {
            mapValue.push(value);
        } else {
            ret.set(key, [value]);
        }
    }
    return ret;
}

export async function mapP<T, U>(values: T[], mapper: _Mapper<T, Promise<U>>): Promise<U[]> {
    return Promise.all(values.map(mapper));
}

export async function mapP_<T>(values: T[], mapper: _Mapper<T, Promise<void>>): Promise<void> {
    await Promise.all(values.map(mapper));
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

export function zip<A, B>(a: A[], b: B[]): [A, B][] {
    return zipWith(a, b, (a, b) => [a, b]);
}

export function zipWith<A, B, C>(a: A[], b: B[], zipper: (a: A, b: B, index: number) => C): C[] {
    let ret = [];
    for (let i = 0; i < a.length && i < b.length; ++i) {
        ret.push(zipper(a[i], b[i], i));
    }
    return ret;
}

export async function zipWithP<A, B, C>(a: A[], b: B[], zipper: (a: A, b: B, index: number) => Promise<C>): Promise<C[]> {
    return Promise.all(zipWith(a, b, zipper));
}

export async function zipWithP_<A, B>(a: A[], b: B[], zipper: (a: A, b: B, index: number) => Promise<void>): Promise<void> {
    await Promise.all(zipWith(a, b, zipper));
}
