import {
    _CallbackFn, drop, dropWhile, dropWhileP, everyP,
    filterMap, filterMapP, filterNotNull, filterNotNullNorUndefined, filterNotUndefined, filterP,
    findIndexP, findLastIndexP, findLastP, findP, flatMapP, forEachP, groupBy, groupByP, head,
    ifEmpty, intersperse, isEmpty, isNotEmpty, last, mapP, mapP_,
    permutations, reduceP, reduceRightP, someP, take, takeWhile, takeWhileP, zip, zipWith, zipWithP, zipWithP_, zipWith_,
} from "./pure";

declare global {
    interface Array<T> {
        head(): [T, T[]] | undefined
        last(): [T[], T] | undefined
        isEmpty(): boolean
        ifEmpty(defaultValue: () => T[]): T[]
        isNotEmpty(): boolean
        intersperse(element: T): T[]
        filterP(mapper: _CallbackFn<T, Promise<boolean>>): Promise<Array<T>>
        filterMap<U>(mapper: _CallbackFn<T, U | undefined>): Array<U>
        filterMapP<U>(mapper: _CallbackFn<T, Promise<U | undefined>>): Promise<U[]>
        filterNotNull(): Array<NotNull<T>>
        filterNotUndefined(): Array<NotUndefined<T>>
        filterNotNullNorUndefined(): Array<NonNullable<T>>
        findP(pred: _CallbackFn<T, Promise<boolean>>): Promise<T | undefined>
        findIndexP(pred: _CallbackFn<T, Promise<boolean>>): Promise<number>
        findLastP(pred: _CallbackFn<T, Promise<boolean>>): Promise<T | undefined>
        findLastIndexP(pred: _CallbackFn<T, Promise<boolean>>): Promise<number>
        flatMapP<U>(mapper: _CallbackFn<T, Promise<U[]>>): Promise<U[]>
        forEachP(proc: _CallbackFn<T, Promise<void>>): Promise<void>
        groupBy<K>(keySelector: _CallbackFn<T, K>): Map<K, T[]>
        groupByP<K>(keySelector: _CallbackFn<T, Promise<K>>): Promise<Map<K, T[]>>
        mapP<U>(mapper: _CallbackFn<T, Promise<U>>): Promise<U[]>
        mapP_(mapper: _CallbackFn<T, Promise<void>>): Promise<void>
        permutations(): T[][]
        reduceP<U>(reducer: (acc: U, value: T, index: number, array: T[]) => Promise<U>, initialValue: U): Promise<U>
        reduceRightP<U>(reducer: (acc: U, value: T, index: number, array: T[]) => Promise<U>, initialValue: U): Promise<U>
        take(n: number): T[]
        takeWhile(pred: _CallbackFn<T, boolean>): T[]
        takeWhileP(pred: _CallbackFn<T, Promise<boolean>>): Promise<T[]>
        drop(n: number): T[]
        dropWhile(pred: _CallbackFn<T, boolean>): T[]
        dropWhileP(pred: _CallbackFn<T, Promise<boolean>>): Promise<T[]>
        everyP(pred: _CallbackFn<T, Promise<boolean>>): Promise<boolean>
        someP(pred: _CallbackFn<T, Promise<boolean>>): Promise<boolean>
        zip<U>(values: Iterable<U>): [T, U][]
        zipWith<U, V>(b: Iterable<U>, zipper: (a: T, b: U, index: number) => V): V[]
        zipWith_<U>(b: Iterable<U>, zipper: (a: T, b: U, index: number) => void): void
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
Array.prototype.flatMapP = member(flatMapP);
Array.prototype.findP = member(findP);
Array.prototype.findIndexP = member(findIndexP);
Array.prototype.findLastP = member(findLastP);
Array.prototype.findLastIndexP = member(findLastIndexP);
Array.prototype.forEachP = member(forEachP);
Array.prototype.groupBy = member(groupBy);
Array.prototype.groupByP = member(groupByP);
Array.prototype.mapP = member(mapP);
Array.prototype.mapP_ = member(mapP_);
Array.prototype.permutations = member(permutations);
Array.prototype.reduceP = member(reduceP);
Array.prototype.reduceRightP = member(reduceRightP);
Array.prototype.take = member(take);
Array.prototype.takeWhile = member(takeWhile);
Array.prototype.takeWhileP = member(takeWhileP);
Array.prototype.drop = member(drop);
Array.prototype.dropWhile = member(dropWhile);
Array.prototype.dropWhileP = member(dropWhileP);
Array.prototype.everyP = member(everyP);
Array.prototype.someP = member(someP);
Array.prototype.zip = member(zip);
Array.prototype.zipWith = member(zipWith);
Array.prototype.zipWith_ = member(zipWith_);
Array.prototype.zipWithP = member(zipWithP);
Array.prototype.zipWithP_ = member(zipWithP_);
