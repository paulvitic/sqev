import {Value} from "./Value";
import {State} from "./State";
import {Aggregate} from "./Aggregate";
import {TaskEither} from "fp-ts/TaskEither";
import {DomainEvent} from "./DomainEvent";
import {Command} from "./Command";

export type CommandExecutor<C extends Value, A extends State, D extends Value> = (a: Command<C>) =>
    (a: Aggregate<A>) => TaskEither<Error, DomainEvent<D>>

export type CommandHandler<C extends Value, A extends State, D extends Value> = {
    commandType: string,
    execute: CommandExecutor<C, A, D>
}

export const commandHandler: <C extends Value, A extends State, D extends Value>
    (commandType: string, executor:CommandExecutor<C, A, D>) =>
    CommandHandler<C, A, D> = (commandType, execute) => ({commandType, execute})



