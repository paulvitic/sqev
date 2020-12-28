import {EventListener} from "./EventListener";
import {Query} from "./Query";
import {View} from "./View";

export type Projection = EventListener & {
    add: (stateView) => TE.TaskEither<Error, void>
    query: (query: Query) => View
}
