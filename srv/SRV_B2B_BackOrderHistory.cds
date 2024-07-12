// using B2B_BackOrderHistory as B2B from '../db/Schema_B2B_BackOrderHistory';

service ERP_BackOrderHistory {
    // entity BackOrderHistory as projection on B2B.B2B_BackOrderHistory;

    @cds.persistence.skip
    entity GetBackOrderHistory {
        orders       : array of {
            shipTo            : String;
            hybrisOrderNumber : String;
            erpOrderNumber    : String;
            poNumber          : String;
            paymentTerms      : String;
            orderType         : String;
            orderPlacedBy     : String;
            currency          : String;
            erpOrderType      : String;
            orderStatus       : String;
            orderDate         : Timestamp;
            totalPrice        : Decimal(10, 2);
            productCode       : String;
            quantity          : String;
            dealerPrice       : Decimal(10, 2);
        };
        entries      : array of {
            shipTo            : String;
            hybrisOrderNumber : String;
            erpOrderNumber    : String;
            poNumber          : String;
            paymentTerms      : String;
            orderType         : String;
            orderPlacedBy     : String;
            currency          : String;
            erpOrderType      : String;
            orderStatus       : String;
            orderDate         : Timestamp;
            totalPrice        : Decimal(10, 2);
            productCode       : String;
            quantity          : String;
            dealerPrice       : Decimal(10, 2);
        };
        soldTo       : String;
        search       : String;
        searchBy     : String;
        fromDate     : String;
        toDate       : String;
        status       : array of String;
        sort         : String;
        dir          : String;
        currentPage  : Integer;
        pageSize     : Integer;
        orderType    : array of String;
        totalPages   : String;
        totalResults : String;
    }

}
