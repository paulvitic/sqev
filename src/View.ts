import {Value} from "./Value";

/*export type View<T extends { [key: string]: any }> = T & {
    name: string
}*/

export type View<T extends Value> = T & {
    name: string
}
