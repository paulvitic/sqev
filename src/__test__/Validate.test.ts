import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import { sequenceS } from 'fp-ts/lib/Apply'

declare const value1: E.Either<Error, string>
declare const value2: E.Either<Error, number>
declare const value3: E.Either<Error, boolean>

// with sequenceS
// will give static error if incompatible left side types
const x = sequenceS(E.Applicative)({ a: value1, b: value2, c: value3 })

// better with apS / apSW
const y = pipe(
    E.Do,
    E.apS('a', value1),
    E.apS('b', value2),
    E.apSW('c', value3)
)
/*
-----------------v---------------v
const y: E.Either<string | boolean, {
    a: string;
    b: number;
    c: boolean;
}>
*/





