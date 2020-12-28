import * as TE from "fp-ts/TaskEither";
import * as E from "fp-ts/Either";
import {InMemoryCommandBus} from "../CommandBus";
import {InMemoryEventLog} from "../EventLog";
import {Command, commandOf} from "../Command";
import {aggregateOf, aggregatorOf, Aggregator, Source} from "../Aggregate";
import { stateChange} from "../StateChange";
import {eventOf, DomainEvent} from "../DomainEvent";
import {streamIdOf} from "../EventStream";
import {ValueType} from "../ValueObject";
import {DomainEntity} from "../DomainEntity";
import {CommandExecutor} from "../CommandHandler";
import {pipe} from "fp-ts/pipeable";
import * as O from "fp-ts/Option";

describe("given", ()=> {
    // FIXTURES
    const AGGREGATE_ID = 1234

    // aggregate type
    const TEST_AGGREGATE = "TEST_AGGREGATE"
    type TestAggregate = {
        a: string,
        b: O.Option<ValueType<{c: boolean, d: number}>>
        d: O.Option<DomainEntity<{e: number}>>
    }

    // and a created event for that aggregate
    const CREATED = "CREATED"
    type Created = { id: number, a: string }

    // WE IMPLEMENT THIS!!!
    const fromCreated: Source<TestAggregate, Created> = event => aggregate =>
        pipe(
            aggregate,
            O.fromPredicate(O.isNone),
            E.fromOption(() => new Error("already created")),
            E.chain( () => E.tryCatch(() => aggregateOf(
                TEST_AGGREGATE,
                event.id,
                {a: event.a, b: O.none, d: O.none},
                event.sequence
                ), E.toError)
            )
        )

    const aggregator: Aggregator<TestAggregate> = aggregatorOf()
    aggregator.add(CREATED, fromCreated)

    // already logged
    const streamId = streamIdOf(TEST_AGGREGATE, AGGREGATE_ID)
    const created: DomainEvent<Created> = eventOf(
        CREATED,
        streamId,
        {id: AGGREGATE_ID, a: "initial"}
    )
    const log = InMemoryEventLog()
    log.append(created)

    it('Can register a command handler', async () => {
        const B_UPDATED = "B_UPDATED"
        type BUpdated = {
            b: string
        }

        const TEST_COMMAND = "TEST_COMMAND"
        type TestCommand = { prop: string }

        // WE IMPLEMENT THIS!!!
        const executor: CommandExecutor<TestCommand, TestAggregate, BUpdated> = command =>
            aggregate => {
                // some business logic checking aggregate state
                return TE.right(eventOf(
                    B_UPDATED,
                    streamIdOf(aggregate.type, aggregate.id),
                    {b: command.prop}))
            }

        // subscribe handler
        const commandBus = InMemoryCommandBus(log)
        // FIXME can we simplify this?
        await commandBus.subscribe(TEST_COMMAND, stateChange(aggregator, executor))()

        // dispatch command
        const command: Command<{ prop: string }> = commandOf(TEST_COMMAND, {prop: "value"})
        let res = await commandBus.dispatch(command, streamId)()
        expect(E.isRight(res)).toBeTruthy()

        /*const noHandlerCommand = commandOf("NO_HANDLER", {t: "value"})
        let failed = await bus.dispatch(noHandlerCommand, streamId)()
        expect(E.isLeft(failed)).toBeTruthy()*/
    })

})
