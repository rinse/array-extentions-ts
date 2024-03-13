import {
    _Mapper, drop, dropWhile, dropWhileP, filterMap, filterMapP, filterNotNull,
    filterNotNullNorUndefined, filterNotUndefined, filterP, forEachP, groupBy, head,
    ifEmpty, intersperse, isEmpty, isNotEmpty, last, mapP, mapP_,
    permutations, reduceP, take, takeWhile, takeWhileP, zip, zipWith, zipWithP, zipWithP_,
} from "./pure";

declare global {
    interface Array<T> {
        head(): [T, T[]] | undefined
        last(): [T[], T] | undefined
        isEmpty(): boolean
        ifEmpty(defaultValue: () => T[]): T[]
        isNotEmpty(): boolean
        intersperse(element: T): T[]
        filterP(mapper: _Mapper<T, Promise<boolean>>): Promise<Array<T>>
        filterMap<U>(mapper: _Mapper<T, U | undefined>): Array<U>
        filterMapP<U>(mapper: _Mapper<T, Promise<U | undefined>>): Promise<U[]>
        filterNotNull(): Array<NotNull<T>>
        filterNotUndefined(): Array<NotUndefined<T>>
        filterNotNullNorUndefined(): Array<NonNullable<T>>
        forEachP(mapper: _Mapper<T, Promise<void>>): Promise<void>
        groupBy<K>(keySelector: (value: T) => K): Map<K, T[]>
        mapP<U>(mapper: _Mapper<T, Promise<U>>): Promise<U[]>
        mapP_(mapper: _Mapper<T, Promise<void>>): Promise<void>
        permutations(): T[][]
        reduceP<U>(reducer: (acc: U, value: T, index: number, array: T[]) => Promise<U>, initialValue: U): Promise<U>
        take(n: number): T[]
        takeWhile(pred: (value: T) => boolean): T[]
        takeWhileP(pred: (value: T) => Promise<boolean>): Promise<T[]>
        drop(n: number): T[]
        dropWhile(pred: (value: T) => boolean): T[]
        dropWhileP(pred: (value: T) => Promise<boolean>): Promise<T[]>
        zip<U>(values: Iterable<U>): [T, U][]
        zipWith<U, V>(b: Iterable<U>, zipper: (a: T, b: U, index: number) => V): V[]
        zipWithP<U, V>(b: Iterable<U>, zipper: (a: T, b: U, index: number) => Promise<V>): Promise<V[]>
        zipWithP_<U>(b: Iterable<U>, zipper: (a: T, b: U, index: number) => Promise<void>): Promise<void>
    }
}

type NotNull<T> = T extends null ? never : T;
type NotUndefined<T> = T extends undefined ? never : T;

// Transform an independent function to a member function
function member<T, A extends any[], R>(f: (self: T, ...args: A) => R): ((this: T, ...args: A) => R) {
    return function (this: T, ...args: A) {
        return f(this, ...args);
    };
}

Array.prototype.head = member(head);
Array.prototype.last = member(last);
Array.prototype.isEmpty = member(isEmpty);
Array.prototype.ifEmpty = member(ifEmpty);
Array.prototype.isNotEmpty = member(isNotEmpty);
Array.prototype.intersperse = member(intersperse);
Array.prototype.filterP = member(filterP);
Array.prototype.filterMap = member(filterMap);
Array.prototype.filterMapP = member(filterMapP);
Array.prototype.filterNotNull = member(filterNotNull);
Array.prototype.filterNotUndefined = member(filterNotUndefined);
Array.prototype.filterNotNullNorUndefined = member(filterNotNullNorUndefined);
Array.prototype.forEachP = member(forEachP);
Array.prototype.groupBy = member(groupBy);
Array.prototype.mapP = member(mapP);
Array.prototype.mapP_ = member(mapP_);
Array.prototype.permutations = member(permutations);
Array.prototype.reduceP = member(reduceP);
Array.prototype.take = member(take);
Array.prototype.takeWhile = member(takeWhile);
Array.prototype.takeWhileP = member(takeWhileP);
Array.prototype.drop = member(drop);
Array.prototype.dropWhile = member(dropWhile);
Array.prototype.dropWhileP = member(dropWhileP);
Array.prototype.zip = member(zip);
Array.prototype.zipWith = member(zipWith);
Array.prototype.zipWithP = member(zipWithP);
Array.prototype.zipWithP_ = member(zipWithP_);
