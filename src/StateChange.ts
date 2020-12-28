import {EventStream} from "./EventStream";
import {Command} from "./Command";
import {TaskEither} from "fp-ts/TaskEither";
import {DomainEvent} from "./DomainEvent";
import * as O from "fp-ts/Option"
import {State} from "./State";
import {pipe} from "fp-ts/pipeable";
import * as TE from "fp-ts/TaskEither";
import {Value} from "./Value";
import {Aggregator} from "./Aggregate";
import {CommandExecutor, CommandHandler} from "./CommandHandler";

/**
 * @see: https://eventmodeling.org/posts/what-is-event-modeling/?s=09
 */
export type StateChange<S extends Value, T extends Value> =
    (given: O.Option<EventStream>) => (when: Command<S>) => TaskEither<Error, DomainEvent<T>>

/**
 *
 * @param from
 * @param execute
 */
export const stateChange: <A extends State, C extends Value, E extends Value>(
    from: Aggregator<A>,
    execute: CommandExecutor<C, A, E>) => StateChange<C, E> =
    (from, execute) => {
        return given => when => pipe(
            given,
            O.fold( () => TE.left(new Error("stream not found")),
                stream => pipe(
                    from.aggregate(stream),
                    TE.chain(execute(when)
                ))
            )
        )
    }

///////
// 1
///////
export type StateChange1<S extends Value, T extends Value> = {
    commandType: string
    apply: (given: O.Option<EventStream>) => (when: Command<S>) => TaskEither<Error, DomainEvent<T>>
}

export const stateChange1: <A extends State, C extends Value, E extends Value>(
    from: Aggregator<A>,
    handler: CommandHandler<C, A, E>) => StateChange1<C, E> =
    (from, handler) => ({
        commandType: handler.commandType,
        apply: given => when => pipe(
            given,
            O.fold( () => TE.left(new Error("stream not found")),
                stream => pipe(
                    from.aggregate(stream),
                    TE.chain(handler.execute(when)
                    ))
            )
        )
    })

///////
// 2
///////
export type StateChange2<A extends State, C extends Value, E extends Value> = {
    add: CommandHandler<A, C, E>
    apply: (given: O.Option<EventStream>) => (when: Command<C>) => TaskEither<Error, DomainEvent<E>>
}


