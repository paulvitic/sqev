import {Option} from "fp-ts/Option";
import {ValueType} from "./ValueObject";
import {DomainEntity} from "./DomainEntity";

export type State<K extends string = string> = {
    readonly [P in K]:
    string | Option<string> | string[] | Option<string[]> |
    number | Option<number> | number[] | Option<number[]> |
    boolean | Option<boolean> | boolean[] | Option<boolean[]> |
    ValueType<any> | Option<ValueType<any>> | ValueType<any>[] | Option<ValueType<any>[]> |
    DomainEntity<any> | Option<DomainEntity<any>> | DomainEntity<any>[] | Option<DomainEntity<any>[]>
    //State | Option<State> | State[] | Option<State[]>
}
