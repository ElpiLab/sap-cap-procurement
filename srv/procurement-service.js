import cds from '@sap/cds'

export default cds.service.impl(function () {

    // =========================
    // SUBMIT
    // =========================

    this.on('submitOrderRequest', async req => {

        const { orderRequest_ID } = req.data

        const orderRequest = await SELECT.one
            .from(OrderRequests)
            .where({ ID: orderRequest_ID })

        if (!orderRequest) {
            return req.reject(
                404,
                'OrderRequest does not exist'
            )
        }

        if (orderRequest.status !== 'PENDING') {
            return req.reject(
                400,
                'Only PENDING OrderRequests can be submitted'
            )
        }

        await UPDATE(OrderRequests)
            .set({ status: 'SUBMITTED' })
            .where({ ID: orderRequest_ID })

        return orderRequest
    })


    // =========================
    // APPROVE
    // =========================

    this.on('approveOrderRequest', async req => {

        const { orderRequest_ID } = req.data

        const orderRequest = await SELECT.one
            .from(OrderRequests)
            .where({ ID: orderRequest_ID })

        if (!orderRequest) {
            return req.reject(
                404,
                'OrderRequest does not exist'
            )
        }

        if (orderRequest.status !== 'SUBMITTED') {
            return req.reject(
                400,
                'Only SUBMITTED OrderRequests can be approved'
            )
        }

        await UPDATE(OrderRequests)
            .set({ status: 'APPROVED' })
            .where({ ID: orderRequest_ID })

        const order = await INSERT
            .into(Orders)
            .entries({
                orderRequest_ID: orderRequest.ID,
                product: orderRequest.product,
                quantity: orderRequest.quantity,
                status: 'CREATED'
            })

        return order
    })


    // =========================
    // REJECT
    // =========================

    this.on('rejectOrderRequest', async req => {

        const { orderRequest_ID } = req.data

        const orderRequest = await SELECT.one
            .from(OrderRequests)
            .where({ ID: orderRequest_ID })

        if (!orderRequest) {
            return req.reject(
                404,
                'OrderRequest does not exist'
            )
        }

        if (orderRequest.status !== 'SUBMITTED') {
            return req.reject(
                400,
                'Only SUBMITTED OrderRequests can be rejected'
            )
        }

        await UPDATE(OrderRequests)
            .set({ status: 'REJECTED' })
            .where({ ID: orderRequest_ID })

        return orderRequest
    })


    // =========================
    // CANCEL
    // =========================

    this.on('cancelOrderRequest', async req => {

        const { orderRequest_ID } = req.data

        const orderRequest = await SELECT.one
            .from(OrderRequests)
            .where({ ID: orderRequest_ID })

        if (!orderRequest) {
            return req.reject(
                404,
                'OrderRequest does not exist'
            )
        }

        if (orderRequest.status !== 'PENDING') {
            return req.reject(
                400,
                'Only PENDING OrderRequests can be cancelled'
            )
        }

        await UPDATE(OrderRequests)
            .set({ status: 'CANCELLED' })
            .where({ ID: orderRequest_ID })

        return orderRequest
    })

});
// CANCEL Actions Orders Entity
    // =========================

    this.on('cancelOrder', async req => {

        const { order_ID } = req.data

        const order = await SELECT.one
            .from(Orders)
            .where({ ID: order_ID })

        if (!order) {
            return req.reject(
                404,
                'There is no Order {id} available'
            )
        }

        if (order.status !== 'Created') {
            return req.reject(
                400,
                'Only CREATED Orders can be cancelled'
            )
        }

        await UPDATE(Orders)
            .set({ status: 'CANCELLED' })
            .where({ ID: order_ID })

        return order // here order nad not Order
        //order her eis the variable initailazed before
});
