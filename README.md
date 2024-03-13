# array-extensions-ts

Handy extensions to Array.

Includes new APIs and promise variants of higher-ranked functions.

```typescript
[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    .filterNonNull()
    .isEmpty();
```

## Installation

## Import Library

### CommonJS

### ESModules

## API Reference

### head

Takes the first element and the rest of array.

```javascript
Array.prototype.head(): [T, T[]] | undefined
```

Example:

```javascript
const actual = [1, 2, 3].head();
expect(actual).toEqual([1, [2, 3]]);
```

### last

Takes the last element and the rest of array.

```javascript
Array.prototype.last(): [T[], T] | undefined
```

Example:

```javascript
const actual = [1, 2, 3].last();
expect(actual).toEqual([[1, 2], 3]);
```

### isEmpty and isNotEmpty

`isEmpty` returns `true` if the array has no elements.

`isNotEmpty` returns `true` if the array has at least 1 element.

```javascript
Array.prototype.isEmpty(): boolean
Array.prototype.isNotEmpty(): boolean
```

Examples:

```javascript
const actual = [].isEmpty();
expect(actual).toEqual(true);
```

```javascript
const actual = [].isNotEmpty();
expect(actual).toEqual(false);
```

### ifEmpty

Gets a default value from a supplier if the array has no elements. Returns itself otherwise.

```javascript
Array.prototype.ifEmpty(defaultValue: () => T[]): T[]
```

Exmpales:

```javascript
const actual = [1, 2, 3].ifEmpty(() => [4, 5, 6]);
expect(actual).toEqual([1, 2, 3]);
```

```javascript
const actual = [].ifEmpty(() => [4, 5, 6]);
expect(actual).toEqual([4, 5, 6]);
```

### intersperse

Inserts an element between each element of an array.

```javascript
Array.prototype.intersperse(element: T): T[]
```

Example:

```javascript
const actual = [1, 2, 3, 4, 5].intersperse(0);
expect(actual).toEqual([1, 0, 2, 0, 3, 0, 4, 0, 5]);
```

### filterMap and filterMapP

Do mapping and filtering at the same time. Especially, `undefined` values are skipped.

```javascript
Array.prototype.filterMap<U>(mapper: _Mapper<T, U | undefined>): Array<U>
Array.prototype.filterMapP<U>(mapper: _Mapper<T, Promise<U | undefined>>): Promise<U[]>
```

Example:

```javascript
const actual = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].filterMap(e => {
    if (e % 2 === 0) {
        return e * 2;
    }
});
expect(actual).toEqual([4, 8, 12, 16, 20]);
```

### filterNotNull, filterNotUndefined and filterNotNullNorUndefined

Skips null values, undefined values or both of them respectively.

```javascript
Array.prototype.filterNotNull(): Array<NotNull<T>>
Array.prototype.filterNotUndefined(): Array<NotUndefined<T>>
Array.prototype.filterNotNullNorUndefined(): Array<NonNullable<T>>
```

Example:

```javascript
const actual: Array<number | undefined> = [1, null, 2, undefined, 3].filterNotNull();
expect(actual).toEqual([1, 2, undefined, 3]);
```

### groupBy

Groups array elements by the key selector and returns `Map`.

```javascript
Array.prototype.groupBy<K>(keySelector: (value: T) => K): Map<K, T[]>
```

Example:

```javascript
const actual = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].groupBy(value => {
    return value % 2 === 0 ? "even" : "odd";
});
expect(actual).toEqual(
    new Map([
        ["even", [2, 4, 6, 8, 10]],
        ["odd", [1, 3, 5, 7, 9]],
    ])
);
```

### mapP_

Do the same thing to `forEachP`. The callback functions are called in parallel.

```javascript
Array.prototype.mapP_(mapper: _Mapper<T, Promise<void>>): Promise<void>
```

Example:

```javascript
["https://example.com", "https://example.com"].mapP_(async url => {
    await fetch(url);
});
```

### permutations

Enumerates all permutations of the array.

```javascript
Array.prototype.permutations(): T[][]
```

Example:

```javascript
const actual = [1, 2, 3].permutations();
expect(actual).toEqual([
    [1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]
]);
```

### take

Takes the first `n` elements of the array.

```javascript
Array.prototype.take(n: number): T[]
```

Example:

```javascript
const actual = [1, 2, 3, 4, 5].take(3);
expect(actual).toEqual([1, 2, 3]);
```

### takeWhile and taleWhileP

Takes the first elements while the predicate returns `true`.

```javascript
Array.prototype.takeWhile(pred: (value: T) => boolean): T[]
Array.prototype.takeWhileP(pred: (value: T) => Promise<boolean>): Promise<T[]>
```

Example:

```javascript
const actual = [1, 2, 3, 4, 5, 4, 3, 2, 1].takeWhile(n => n < 5);
expect(actual).toEqual([1, 2, 3, 4]);
```

### drop

Drops the first `n` elements of the array.

```javascript
Array.prototype.drop(n: number): T[]
```

Example:

```javascript
const actual = [1, 2, 3, 4, 5].drop(3);
expect(actual).toEqual([4, 5]);
```

### dropWhile and dropWhileP

```javascript
Array.prototype.dropWhile(pred: (value: T) => boolean): T[]
Array.prototype.dropWhileP(pred: (value: T) => Promise<boolean>): Promise<T[]>
```

Example:

```javascript
const actual = [1, 2, 3, 4, 5, 4, 3, 2, 1].dropWhile(n => n < 5);
expect(actual).toEqual([5, 4, 3, 2, 1]);
```

### zip

Zips two arrays into an array of pairs.

```javascript
Array.prototype.zip<U>(values: Iterable<U>): [T, U][]
```

Example:

```javascript
const actual = [1, 2, 3].zip(['a', 'b', 'c']);
expect(actual).toEqual([[1, 'a'], [2, 'b'], [3, 'c']]);
```

### zipWith, zipWithP and zipWithP_

Zips two arrays with the given zipper function.

```javascript
Array.prototype.zipWith<U, V>(b: Iterable<U>, zipper: (a: T, b: U, index: number) => V): V[]
Array.prototype.zipWithP<U, V>(b: Iterable<U>, zipper: (a: T, b: U, index: number) => Promise<V>): Promise<V[]>
Array.prototype.zipWithP_<U>(b: Iterable<U>, zipper: (a: T, b: U, index: number) => Promise<void>): Promise<void>
```

Example:

```javascript
const actual = [1, 2, 3, 4, 5].zipWith([10, 9, 8, 7, 6], (a, b) => a + b);
expect(actual).toEqual([11, 11, 11, 11, 11]);
```

## Promise variants

Functions with suffix `P` are higher-ranked functions but each callback function returns a promise.

For instance, the built-in `map` function has the following signature:

```javascript
Array.prototype.map<U>(callbackFn: (element: T) => U): Array<U>
```

But the promise variant for `map`, which is named `mapP`, has the following signature:

```javascript
Array.prototype.mapP<U>(callbackFn: (element: T) => Promise<U>): Promise<Array<U>>
```

Implementing status:

1. [] everyP
2. [x] filterP
3. [x] findP
4. [x] findIndexP
5. [x] findLastP
6. [x] findLastIndexP
7. [x] flatMapP
8. [x] forEachP
9. [x] mapP
10. [x] reduceP
11. [] reduceRightP
12. [] someP
