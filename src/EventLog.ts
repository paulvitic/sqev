import {DomainEvent} from "./DomainEvent";
import {EventStream, StreamId} from "./EventStream";
import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import {pipe} from "fp-ts/pipeable";
import * as O from "fp-ts/Option";
import * as RX from "rxjs";
import {Value} from "./Value";
import {EventBus} from "./EventBus";
import {array} from "fp-ts";

export interface EventLog {
    stream(streamId: StreamId, from: O.Option<number>): TE.TaskEither<Error, O.Option<EventStream>>;
    append<E extends Value = Value>(event: DomainEvent<E>): TE.TaskEither<Error, void>;
}

export const InMemoryEventLog: (eventBus?: EventBus[]) => EventLog = eventBus => {
    const log: { [streamId: string]: DomainEvent[] } = {}
    const bus: EventBus[] = eventBus
    return {
        stream(streamId: StreamId, _from: O.Option<number>) {
            return pipe(
                O.fromNullable(log[streamId.toString()]),
                O.fold(
                    () => TE.right(O.none),
                    events => TE.right(O.some(RX.from(events))
                    )
                ),
            )
        },
        append(event: DomainEvent): TE.TaskEither<Error, void> {
            return pipe(
                O.fromNullable(log[event.streamId.toString()]),
                O.fold( () => TE.tryCatch(() => new Promise<DomainEvent>(resolve => {
                    log[event.streamId.toString()] = [event];
                    resolve(event);
                }), E.toError),
                    events => TE.tryCatch(() => new Promise<DomainEvent>(resolve => {
                        events.push(event);
                        resolve(event);
                    }), E.toError)
                ),
                TE.chain(event => pipe(
                    bus,
                    array.traverse(TE.taskEither)(bus => bus.emit(event))
                )),
                TE.map(_ => {})
            )
        }
    }
}
