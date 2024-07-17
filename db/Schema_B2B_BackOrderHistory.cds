namespace B2B_BackOrderHistory;

entity B2B_BackOrderHistory {
        erpOrderNumber      : String;
        erpOrderType        : String;
        orderCo             : String;
        erpLineNumber       : String;
        localSku            : String;
        globalSku           : String;
        status              : String;
        currency            : String;
        dealerPrice         : Decimal(10, 2);
        quantityOrdered     : String;
        quantityBackorder   : String;
        totalPriceBackorder : Decimal(10, 2);
        transactionDate     : Timestamp;
    key billTo              : String;
    key shipTo              : String;
        poNumber            : String;
        paymentTerms        : String;
        orderPlacedBy       : String;
        hybrisOrderNumber   : String;
}
