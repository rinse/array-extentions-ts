import {
    _Mapper, filterMap, filterMapP, filterNotNull,
    filterNotNullNorUndefined, filterNotUndefined, groupBy, head,
    ifEmpty, isEmpty, isNotEmpty, last, mapP, mapP_,
    reduceP, zip, zipWith, zipWithP, zipWithP_,
} from "./pure";

declare global {
    interface Array<T> {
        head(): [T, T[]] | null
        last(): [T[], T] | null
        isEmpty(): boolean
        ifEmpty(defaultValue: () => T[]): T[]
        isNotEmpty(): boolean
        filterMap<U>(mapper: _Mapper<T, U | null>): Array<U>
        filterMapP<U>(mapper: _Mapper<T, Promise<U | null>>): Promise<U[]>
        filterNotNull(): Array<NotNull<T>>
        filterNotUndefined(): Array<NotUndefined<T>>
        filterNotNullNorUndefined(): Array<NonNullable<T>>
        groupBy<K>(keySelector: (value: T) => K): Map<K, T[]>
        mapP<U>(mapper: _Mapper<T, Promise<U>>): Promise<U[]>
        mapP_(mapper: _Mapper<T, Promise<void>>): Promise<void>
        reduceP<U>(reducer: (acc: U, value: T, index: number, array: T[]) => Promise<U>, initialValue: U): Promise<U>
        zip<U>(values: U[]): [T, U][]
        zipWith<U, V>(b: U[], zipper: (a: T, b: U, index: number) => V): V[]
        zipWithP<U, V>(b: U[], zipper: (a: T, b: U, index: number) => Promise<V>): Promise<V[]>
        zipWithP_<U>(b: U[], zipper: (a: T, b: U, index: number) => Promise<void>): Promise<void>
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
Array.prototype.filterMap = member(filterMap);
Array.prototype.filterMapP = member(filterMapP);
Array.prototype.filterNotNull = member(filterNotNull);
Array.prototype.filterNotUndefined = member(filterNotUndefined);
Array.prototype.filterNotNullNorUndefined = member(filterNotNullNorUndefined);
Array.prototype.groupBy = member(groupBy);
Array.prototype.mapP = member(mapP);
Array.prototype.mapP_ = member(mapP_);
Array.prototype.reduceP = member(reduceP);
Array.prototype.zip = member(zip);
Array.prototype.zipWith = member(zipWith);
Array.prototype.zipWithP = member(zipWithP);
Array.prototype.zipWithP_ = member(zipWithP_);
