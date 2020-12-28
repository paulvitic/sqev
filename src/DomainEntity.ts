import {Identity} from "./Identity";
import {State} from "./State";

export type DomainEntity<T extends State> = T & Identity<T> & {
    readonly id: string | number
}

export const entityOf = <T extends State = State>(
    i: string | number,
    p: T): DomainEntity<T> => ({
        ...p,
        id: i,
        equals: other => other.id === i,
        toString: () => ""
})
