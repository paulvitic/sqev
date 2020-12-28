import {InMemoryEventBus} from "../EventBus";
import {DomainEvent, eventOf} from "../DomainEvent";
import {streamIdOf} from "../EventStream";
import * as E from "fp-ts/Either"
import * as TE from "fp-ts/TaskEither"
import {eventListener} from "../EventListener";

describe("", () => {
    const eventBus = InMemoryEventBus()

    const CREATED = "CREATED"
    type Created = {
        a: string
    }

    const eventListener1 = eventListener(CREATED, (event) => {
        console.log(`event listener 1: ${JSON.stringify(event)}`)
        return TE.right(null)
    })

    const eventListener2 = eventListener(CREATED, (event) => {
        console.log(`event listener 2: ${JSON.stringify(event)}`)
        return TE.right(null)
    })

    it("", async () => {
        await eventBus.subscribe(CREATED, eventListener1)()
        await eventBus.subscribe(CREATED, eventListener2)()
        const created: DomainEvent<Created> = eventOf(
            CREATED,
            streamIdOf("TEST_AGGREGATE", 123),
            {a: ""}
        )
        let res = await eventBus.emit(created)()

        expect(E.right(res)).toBeTruthy()
    })
})
