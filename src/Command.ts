import {Immutable} from "./Immutable";
import {Value} from "./Value";
// import {State} from "./State";
// import {Aggregate} from "./Aggregate";
// import {TaskEither} from "fp-ts/TaskEither";
// import {DomainEvent} from "./DomainEvent";

/*export interface Command<T extends Value = Value> {
    readonly type: string
    readonly payload: Immutable<T>
}

/!**
 * creates a command instance
 *
 * @param t
 * @param p
 *!/
export const of = <T extends Value = Value>(t: string, p: Immutable<T>): Command<T> => ({
    type: t,
    payload: p
})*/

//////////////////////
export type Command<T extends Value> = Immutable<T> & {
    readonly type: string
}

export const commandOf = <T extends Value>(
    type: string, payload: Immutable<T>): Command<T> => ({
        ...payload,
        type
    })

/*
export type Command1<T extends Value,A extends State, D extends Value> = Immutable<T> & {
    readonly type: string
    readonly execute: CommandExecutor<T, A, D>
}

export const commandOf1 = <C extends Value, A extends State, D extends Value>(
    type: string,
    payload: Immutable<C>,
    executor: CommandExecutor<C, any, any>): Command1<C, A, D> => {
    return {
        type,
        execute: executor
    }
    }*/
