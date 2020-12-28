/**
 *
 */
export type Value = {
    readonly [ key: string ]: string | string[] | number | number[] | boolean | boolean[] | Value | Value[]
}
