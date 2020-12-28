import {Value} from "./Value";
import {Immutable} from "./Immutable";
import {StreamId} from "./EventStream";

/* export interface DomainEvent<T extends Value = Value> {
    readonly type: string
    readonly streamId: StreamId,
    readonly sequence: number,
    readonly recordedOn: Date,
    readonly payload: Immutable<T>
}*/


export type DomainEvent<T extends Value = Value> = Immutable<T> & {
    readonly type: string
    readonly streamId: StreamId,
    readonly sequence: number,
    readonly recordedOn: Date
}

export const eventOf = <T extends Value = Value>(
    type: string,
    streamId: StreamId,
    payload: Immutable<T>,
    sequence?: number,
    recordedOn?: Date,
    ): DomainEvent<T> => ({
        ...payload,
        type,
        streamId,
        sequence: sequence ? sequence : 0,
        recordedOn: recordedOn ? recordedOn : new Date(Date.now())
    })




