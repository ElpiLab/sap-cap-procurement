const cds = require('@sap/cds') // this is the CAP Node.js API to access CAP Node.js API

module.exports = cds.service.impl(function () { //: exports and custom implementation for this service to attach

  this.on('approveOrderRequest', async req => {//handler
    // This approveOrderRequest function is executed when somenone called the fucntion

    const { ID } = req.data

    // 1. Find the OrderRequest
    const orderRequest = await SELECT.one //Select one OrderRequest from 
    //ProcurementService.OrderRequests where ID equals this ID
      .from('ProcurementService.OrderRequests')
      .where({ ID })

    // 2. Request must exist
    if (!orderRequest) { // if didnt find it
      return req.reject(404, 'OrderRequest does not exist')
    }

    // 3. Request must have SUBMITTED status
    if (orderRequest.status !== 'SUBMITTED') {
      return req.reject(
        400,
        'OrderRequest must have status SUBMITTED'
      )
    }

    // 4. Change request status to APPROVED
    await UPDATE('ProcurementService.OrderRequests')
      .set({ status: 'APPROVED' })
      .where({ ID })

    // 5. Create an Order from the request 
    const order = await INSERT.into('ProcurementService.Orders') //Insert a new record into Orders.
      .entries({
        orderRequest_ID: orderRequest.ID,
        product: orderRequest.product,
        quantity: orderRequest.quantity,
        status: 'CREATED'
      })

    // 6. Return the newly created Order
    return order
  })

});
//Submit Request OrderRequest
this.on('submitOrderRequest', async req => {

    // 1. Get the ID from the incoming request
    const { orderRequest_ID } = req.data

    // 2. Find the existing OrderRequest in the database
    const orderRequest = await SELECT.one
        .from(OrderRequests)
        .where({ ID: orderRequest_ID })
 
    // 3. Make sure the OrderRequest exists
    if (!orderRequest) {
        return req.reject(404, 'OrderRequest does not exist')
    }

    // 4. Make sure the current status is PENDING
    if (orderRequest.status !== 'PENDING') {
        return req.reject(
            400,
            'Only PENDING OrderRequests can be submitted'
        )
    }

    // 5. Change the status from PENDING to SUBMITTED
    await UPDATE(OrderRequests)
        .set({ status: 'SUBMITTED' })
        .where({ ID: orderRequest_ID })

    // 6. Return the OrderRequest
    return orderRequest
});
//Reject Request OrderRequest
this.on('rejectOrderRequest', async req => {

    // 1. Get the ID from the incoming request
    const { orderRequest_ID } = req.data

    // 2. Find the existing OrderRequest in the database
    const orderRequest = await SELECT.one
        .from(OrderRequests)
        .where({ ID: orderRequest_ID })
 
    // 3. Make sure the OrderRequest exists
    if (!orderRequest) {
        return req.reject(404, 'OrderRequest does not exist')
    }

    // 4. Make sure the current status is PENDING
    if (orderRequest.status !== 'SUBMITTED') {
        return req.reject(
            400,
            'Only PENDING OrderRequests can be accepted/rejected'
        )
    }

    // 5. Change the status from PENDING to REJECTED
    await UPDATE(OrderRequests)
        .set({ status: 'REJECTED' })
        .where({ ID: orderRequest_ID })

    // 6. Return the OrderRequest
    return orderRequest
});
//Cancel Request OrderRequest
this.on('cancelOrderRequest', async req => {

    // 1. Get the ID from the incoming request
    const { orderRequest_ID } = req.data

    // 2. Find the existing OrderRequest in the database
    const orderRequest = await SELECT.one
        .from(OrderRequests)
        .where({ ID: orderRequest_ID })
 
    // 3. Make sure the OrderRequest exists
    if (!orderRequest) {
        return req.reject(404, 'OrderRequest does not exist')
    }

    // 4. Make sure the current status is PENDING
    if (orderRequest.status !== 'PENDING') {
        return req.reject(
            400,
            'Only submitted  OrderRequests can be accepted/rejected/rejected'
        )
    }

    // 5. Change the status from PENDING to REJECTED
    await UPDATE(OrderRequests)
        .set({ status: 'Cancelled' })
        .where({ ID: orderRequest_ID })

    // 6. Return the OrderRequest
    return orderRequest
});