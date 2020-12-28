import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import {Value} from "./Value";
import {DomainEvent} from "./DomainEvent";
import {Subject} from "rxjs";
import {pipe} from "fp-ts/pipeable";
import * as O from "fp-ts/Option";
import {EventListener} from "./EventListener";


export interface EventBus {
    subscribe<T extends Value = Value>(toType: string, eventListener: EventListener<T>): TE.TaskEither<Error, void>;
    emit<T extends Value = Value>(event: DomainEvent<T>): TE.TaskEither<Error, void>;
}


export const InMemoryEventBus: () => EventBus = () => {
    const subjects: { [eventType: string]: Subject<DomainEvent<any>> } = {}
    return{
        subscribe: <T extends Value = Value>(toType: string, eventListener: EventListener<T>) => {
            return pipe(
                O.fromNullable(subjects[toType]),
                O.fold(() => TE.tryCatch(() => new Promise(resolve => {
                        subjects[toType] = new Subject()
                        subjects[toType].subscribe(eventListener.onEvent)
                        resolve()
                    }), E.toError),
                    subject => TE.tryCatch(() => new Promise(resolve => {
                        subject.subscribe(eventListener.onEvent)
                        resolve()
                    }), E.toError)
                )
            )
        },
        emit: (event: DomainEvent) => {
            return pipe(
                O.fromNullable(subjects[event.type]),
                O.fold(() => TE.right(null),
                        subject => TE.tryCatch(() =>
                            Promise.resolve(subject.next(event)), E.toError)
                )
            )
        }
    }
}
