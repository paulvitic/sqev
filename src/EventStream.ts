import {Identity} from "./Identity";
import {DomainEvent} from "./DomainEvent";
import {from, Observable} from "rxjs";

export type StreamId<T = string | number> = Identity<StreamId<T>> & {
    readonly aggregate: string
    readonly aggregateId: T
}

export const streamIdOf: (a: string, ai: string | number) => StreamId = (a, ai) => ({
    aggregate: a,
    aggregateId: ai,
    equals: other => other.toString() === a + ai,
    toString: () => a + ai
})

export type EventStream<T extends DomainEvent = DomainEvent> = Observable<T>;

export const streamFrom: <T extends DomainEvent = DomainEvent>(events: DomainEvent<any>[]) =>
    EventStream<T> = events => from(events)
