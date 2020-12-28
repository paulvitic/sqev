import {Value} from "./Value";
import {DomainEvent} from "./DomainEvent";
import {TaskEither} from "fp-ts/TaskEither";

export type EventHandler<E> = <E extends Value>(event: DomainEvent<E>) => TaskEither<Error, void>

export type EventListener<E extends Value> = {
    eventType: string,
    onEvent: EventHandler<E>
}

export const eventListener: <E extends Value>(eventType: string, eventHandler: EventHandler<E>) => EventListener<E> =
    (eventType, onEvent) => ({ eventType, onEvent})
