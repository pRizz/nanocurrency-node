import UInt128 from "./UInt128";

export default class CurrencyAmount {
    readonly value: UInt128

    constructor(amount: UInt128) {
        this.value = amount
    }
}
