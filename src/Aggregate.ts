import {Identity} from "./Identity";
import {EventStream} from "./EventStream";
import {Option} from "fp-ts/Option";
import {State} from "./State";
import {DomainEvent} from "./DomainEvent";
import * as TE from "fp-ts/TaskEither";
import {pipe} from "fp-ts/pipeable";
import * as O from "fp-ts/Option";
import * as E from "fp-ts/Either";
import {Value} from "./Value";

export type Aggregate<T extends State = State> = T & Identity<Aggregate<T>> & {
    readonly type: string
    readonly id: string | number
    readonly playHead: number
}

export const aggregateOf: <T extends State>(
    type: string,
    id: string | number,
    state: T,
    playHead?: number) => Aggregate<T> =
    (type, id, state, playHead) => ({
        ...state,
        type,
        id,
        playHead: playHead ? playHead : 0,
        equals: other => other.id === id
})

/*export type Reducer<A extends State, V extends Value = Value> = (aggregate: Aggregate<A>, event: DomainEvent<V>) =>
    E.Either<Error, Aggregate<A>>*/

export type Source<A extends State, V extends Value = Value> = (event: DomainEvent<V>) =>
    (aggregate: Option<Aggregate<A>>) => E.Either<Error, Aggregate<A>>

export type Aggregator<A extends State> = {
    add: (eventType: string, source: Source<A>) => E.Either<Error, void>
    aggregate: (stream: EventStream) => TE.TaskEither<Error, Aggregate<A>>
}

export const aggregatorOf: <A extends State>() => Aggregator<A> = <A extends State>() => {
    const aggregators: { [eventType: string]: Source<A> } = {}
    return {
        add(eventType: string, source: Source<A>): E.Either<Error, void> {
            return pipe(
                aggregators,
                E.fromPredicate(
                    aggregators => pipe(
                        O.fromNullable(aggregators[eventType]),
                        O.isNone
                    ),
                    () => new Error('aggregator already registered')),
                E.map(aggregators => { aggregators[eventType] = source })
            )
        },
        aggregate(stream: EventStream): TE.TaskEither<Error, Aggregate<A>> {
            let aggregate: O.Option<Aggregate<A>> = O.none
            return TE.tryCatch(() => new Promise<Aggregate<A>>((resolve, reject) => {
                stream.subscribe(
                    event => pipe(
                        O.fromNullable(aggregators[event.type]),
                        E.fromOption(() => new Error("no aggregator")),
                        E.chain(source => source(event)(aggregate)),
                        E.fold( E.throwError, a => {
                            aggregate = O.some(a)
                            return E.right(a)})
                    ),
                    err => reject(err),
                    () => pipe(
                        aggregate,
                        O.fold(() => reject(new Error('could not be built')), resolve)
                    )
                )
            }), E.toError)}
    }
}

/*function onSomeEvent(state: Aggregate, event: DomainEvent): Aggregate {
    // see: https://medium.com/javascript-in-plain-english/how-to-deep-copy-objects-and-arrays-in-javascript-7c911359b089
    const clone = require('rfdc')(); // really fast deep copy library
    let newState = clone(state);
    // change state using event
    return newState;
}*/

/*
export const from1: {
    <E, A, B extends A>(refinement: Refinement<A, B>, onFalse: (a: A) => E): (a: A) => TaskEither<Error,Aggregate>
    <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E): (a: A) => TaskEither<Error,Aggregate>
} = <E, A>(predicate: Predicate<A>, onFalse: (a: A) => E) => (a: A) => (predicate(a) ? right(a) : left(onFalse(a)))*/

// this would be a typical event sourced functional aggregate method that executes a command
// it receives past events rebuilds current state using onSomeEvent functions
// uses a domain service if necessary
// and returns generated domain events
/*function updateProject(pastEvents: DomainEvent[], commandArguments: any[], domainService: any): DomainEvent[] {
    let generatedEvents = new Array<DomainEvent>();
    // reconstruct aggregate state from pastEvents, execute command, maybe using a domain service and return newly generated events
    return generatedEvents;
}*/
