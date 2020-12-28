import * as util from "util";
import {Identity} from "./Identity";
import {Immutable} from "./Immutable";
import {Value} from "./Value";

/*export interface ValueObject<T extends Value> extends Identity<ValueObject<T>> {
    readonly value: Immutable<T>
    toString: () => string
}

export const of = <T extends Value>(a: Immutable<T>): ValueObject<T> => ({
    value: a,
    equals: other => util.isDeepStrictEqual(a, other.value),
    toString: () => JSON.stringify(a)
})*/

//////////////////////////////////

export type ValueType<T extends Value = Value> = Immutable<T> & Identity<ValueType<T>>

export const valueOf: <T extends Value = Value>(a: Immutable<T>) => ValueType<T> = a => ({
    ...a,
    equals: other => util.isDeepStrictEqual(a, other),
    toString: () => JSON.stringify(a)
})
