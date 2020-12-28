import {View} from "./View";
import {Value} from "./Value";

export type Query = {}

export type QueryExecutor = <T extends Value>(query: Query) => View<T>
