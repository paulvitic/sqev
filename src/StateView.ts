import {Value} from "./Value";
import * as TE from "fp-ts/TaskEither";
import {View} from "./View";
import {DomainEvent} from "./DomainEvent";

/**
 * @see: https://eventmodeling.org/posts/what-is-event-modeling/?s=09
 */

export type StateView<V extends Value> =
    (given: DomainEvent) => TE.TaskEither<Error, View<V>>

export const stateView: () => StateView<any> =  () => given => TE.right(given)

