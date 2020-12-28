import {valueOf, ValueType} from "../ValueObject";

describe("ValueObject", () => {
    it("", () => {
        type TestValueObject = { a:string, b:number, c:number[], d:{ a:string[] } }
        const testValueObject: ValueType<TestValueObject> = valueOf({ a: "aa", b: 2, c: [1, 1], d: {a : ["1", "2"]} })
        let equals = testValueObject.equals(valueOf({ a: "aa", b: 2, c: [1, 1], d: {a : ["1", "1"]}  }))
        //let stringValue = testValueObject.toString()
        expect(equals).toBeFalsy()
    })
})
