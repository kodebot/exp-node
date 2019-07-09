export interface ExchangeRate {
    provider: string,
    minValue: number,
    maxValue: number,
    sourceCurrency: Currency,
    currentRate: number,
    datatimeStamp: Date,
    transferMode:string,
    deliveryMode:string
}

export enum Currency{
    AUD,
    CAD,
    EURO,
    HKD, // hongkong dollar
    SGD, // Singapore dollar
    SWK, // Swedish kroner
    SWF, // Swiss Frank
    UAD, // UAE Dhirams
    GBP,
    USD
    
}