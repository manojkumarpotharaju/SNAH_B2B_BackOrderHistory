const cds = require('@sap/cds');
const res = require('express/lib/response');

module.exports = cds.service.impl(async function (srv) {
    const db = await cds.connect.to("db");
    const { B2B_BackOrderHistory } = db.entities;

    this.on("POST", 'GetBackOrderHistory', async (req) => {
        debugger;
        const {
            soldTo, search, searchBy, fromDate, toDate,
            status, sort, dir,
            currentPage, pageSize, orderType
        } = req.data;

        try {
            let query = SELECT.from(B2B_BackOrderHistory).columns('erpOrderNumber', 'erpOrderType', 'orderCo',
                'erpLineNumber', 'localSku', 'globalSku', 'status',
                'currency', 'dealerPrice', 'quantityOrdered', 'quantityBackorder',
                'totalPriceBackorder', 'transactionDate', 'billTo', 'shipTo', 'productCode', 'paymentTerms', 'orderPlacedBy', 'hybrisOrderNumber').where({ billTo: soldTo });
            if (fromDate && toDate) {
                query.where({
                    transactionDate: {
                        between: fromDate,
                        and: toDate
                    }
                });
            } else if (fromDate && !toDate) {
                query.where({ transactionDate: { '=': fromDate } });
            }
            if (status && status.length > 0) {
                query.where({ status: { in: status } });
            }
            if (orderType && orderType.length > 0) {
                query.where({ erpOrderType: { in: orderType } });
            }
            if (search && searchBy) {
                const searchFields = searchBy.split(',').map(field => field.trim());
                const searchConditions = searchFields.map(field => {
                    if (['orderNumber', 'invoiceNumber'].includes(field)) {
                        return { [field]: search };
                    } else if (['poNumber', 'itemNumber'].includes(field)) {
                        return { [field]: { like: `%${search}%` } };
                    } else {
                        return { [field]: { like: `%${search}%` } };
                    }
                });
                query.where({ or: searchConditions });
            }
            query.orderBy(`${sort} ${dir}`);
            debugger;
            // getting the data from the HANA DB
            const result = await cds.run(query);
            const totalResults = result.length;
            const totalPages = Math.ceil(totalResults / pageSize);
            const startIndex = currentPage * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedResults = result.slice(startIndex, endIndex);
            debugger;
            if (status.length !== 0) {
                const orders = paginatedResults.map(order => ({
                    shipTo: order.shipTo,
                    poNumber: order.poNumber,
                    paymentTerms: order.paymentTerms,
                    orderType: order.erpOrderType,
                    orderPlacedBy: order.orderPlacedBy,
                    currency: order.currency,
                    totalPrice: order.totalPriceBackorder,
                    erpOrderNumber: order.erpOrderNumber,
                    orderStatus: order.status,
                    hybrisOrderNumber: order.hybrisOrderNumber,
                    orderDate: order.transactionDate,
                }));
                let data = {
                    orders,
                    currentPage: Number(currentPage),
                    pageSize: Number(pageSize),
                    totalPages: totalPages,
                    totalResults: totalResults
                };
                return data;
            } else {
                const entries = paginatedResults.map(order => ({
                    productCode: order.productCode,
                    quantity: order.quantityBackorder,
                    currency: order.currency,
                    dealerPrice: order.dealerPrice,
                    totalPrice: order.totalPrice,
                    erpOrderNumber: order.erpOrderNumber,
                    orderDate: order.transactionDate,
                    orderStatus: order.status
                }));
                let data = {
                    entries,
                    currentPage: Number(currentPage),
                    pageSize: Number(pageSize),
                    totalPages: totalPages,
                    totalResults: totalResults
                };
                return data;
            };

        } catch (err) {
            console.error(err);
            return {
                error: {
                    code: "ERROR_CODE",
                    description: err.message || "An unexpected error occurred"
                }
            };
        }
    });
});
