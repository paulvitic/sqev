import {Command} from "./Command";
import * as TE from "fp-ts/TaskEither";
import {Value} from "./Value";
import {pipe} from "fp-ts/pipeable";
import * as O from "fp-ts/Option";
import {StateChange} from "./StateChange";
import {EventLog} from "./EventLog";
import {StreamId} from "./EventStream";

export interface CommandBus {
    subscribe(toType: string, stateChange: StateChange<any, any>): TE.TaskEither<Error, void>;
    dispatch<T extends Value = Value>(command: Command<T>, streamId: StreamId): TE.TaskEither<Error, void>;
}

export const InMemoryCommandBus: (eventLog: EventLog) => CommandBus = eventLog => {
    const transformers: { [commandType: string]: StateChange<any, any> } = {}
    return {
        subscribe(commandType: string, stateChange: StateChange<any, any>): TE.TaskEither<Error, void> {
            return pipe(
                stateChange,
                TE.fromPredicate(
                    _s => O.isNone(O.fromNullable(transformers[commandType])),
                    () => new Error('handler already registered')),
                TE.map(stateChange => {
                    transformers[commandType] = stateChange;
                })
            )
        },
        dispatch(command: Command<any>, streamId: StreamId): TE.TaskEither<Error, void> {
            return pipe(
                O.fromNullable(transformers[command.type]),
                O.fold( () => TE.right(null),
                    handler => pipe(
                        eventLog.stream(streamId, O.none),
                        TE.map(handler),
                        TE.chain(executor => executor(command))
                    )
                ),
                TE.chain(eventLog.append)
            )
        }
    }
}

/*export interface CommandBus {
    subscribe(toType: string, handler: CommandHandler): TE.TaskEither<Error, void>;
    dispatch<T extends Value = Value>(command: Command<T>): TE.TaskEither<Error, void>;
}

export const InMemoryCommandBus: () => CommandBus = () => {
    const handlers: { [key: string]: CommandHandler } = {}
    return {
        dispatch(command: Command): TE.TaskEither<Error, void> {
            return pipe(
                O.fromNullable(handlers[command.type]),
                TE.fromOption(() => new Error("no handler")),
                TE.chain(handler => handler(command))
            )
        },
        subscribe(toType: string, handler: CommandHandler): TE.TaskEither<Error, void> {
            return pipe(
                handlers,
                TE.fromPredicate(
                    handlers => O.isNone(O.fromNullable(handlers[toType])),
                    () => new Error('handler already registered')),
                TE.map(handlers => { handlers[toType] = handler; })
            )
        }
    }
}*/
