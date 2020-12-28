import * as E from "fp-ts/Either"
import * as O from "fp-ts/Option"
import {eventOf, DomainEvent} from "../DomainEvent";
import {aggregateOf, Aggregate, aggregatorOf, Source} from "../Aggregate";
import {streamFrom, streamIdOf} from "../EventStream";
import {valueOf, ValueType} from "../ValueObject";
import {entityOf, DomainEntity} from "../DomainEntity";
import {pipe} from "fp-ts/pipeable";

describe("", () => {
    const TEST_AGGREGATE = "TEST_AGGREGATE"
    type TestAggregate = {
        a: string,
        b: ValueType<{c: boolean, d: number}>
        d: DomainEntity<{e: number}>
    }

    it("", () => {
        const testAggregate: Aggregate<TestAggregate> = aggregateOf(
            TEST_AGGREGATE, 1234,
            {a: "someString", b: valueOf({c: true, d:2}), d: entityOf(123, {e:2})}
        )
        expect(testAggregate.playHead).toBe(0)
    })

    it("", async () => {
        const CREATED = "CREATED"
        type Created = {
            id: number
            a: string
        }

        const created: DomainEvent<Created> = eventOf(
            CREATED,
            streamIdOf(TEST_AGGREGATE, 123),
            {id: 1234, a: "initial a"}
            )

        const fromCreated: Source<TestAggregate, Created> = event => aggregate =>
            pipe(
                aggregate,
                O.fromPredicate(O.isNone),
                E.fromOption(() => new Error("already created")),
                E.chain( () => E.tryCatch(() => aggregateOf(
                    TEST_AGGREGATE,
                    event.id,
                    {a: event.a, b: valueOf({c: true, d:2}), d: entityOf(123, {e:2})},
                    event.sequence
                    ), E.toError)
                )
            )

        const aggregator = aggregatorOf()
        aggregator.add(CREATED, fromCreated)
        let state = await aggregator.aggregate(streamFrom([created]))()

        expect(E.isRight(state)).toBeTruthy()
    })
})
