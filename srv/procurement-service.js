import cds from '@sap/cds'

export default cds.service.impl(function () {

    // =========================================================
    // ORDER REQUESTS
    // =========================================================

    // ---------------------------------------------------------
    // SUBMIT ORDER REQUEST
    // PENDING -> SUBMITTED
    // ---------------------------------------------------------

    this.on('submitOrderRequest', async req => {

        const { orderRequest_ID } = req.data

        const orderRequest = await SELECT.one
            .from('ProcurementService.OrderRequests')
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

        await UPDATE('ProcurementService.OrderRequests')
            .set({ status: 'SUBMITTED' })
            .where({ ID: orderRequest_ID })

        return {
            ...orderRequest,
            status: 'SUBMITTED'
        }
    })


    // ---------------------------------------------------------
    // APPROVE ORDER REQUEST
    // SUBMITTED -> APPROVED
    // AND CREATE ORDER
    // ---------------------------------------------------------

    this.on('approveOrderRequest', async req => {

        const { orderRequest_ID } = req.data

        const orderRequest = await SELECT.one
            .from('ProcurementService.OrderRequests')
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

        // Change OrderRequest status
        await UPDATE('ProcurementService.OrderRequests')
            .set({ status: 'APPROVED' })
            .where({ ID: orderRequest_ID })

        // Create Order from OrderRequest
        const order = await INSERT
            .into('ProcurementService.Orders')
            .entries({
                orderRequest_ID: orderRequest.ID,
                product: orderRequest.product,
                quantity: orderRequest.quantity,
                status: 'CREATED'
            })

        return order
    })


    // ---------------------------------------------------------
    // REJECT ORDER REQUEST
    // SUBMITTED -> REJECTED
    // ---------------------------------------------------------

    this.on('rejectOrderRequest', async req => {

        const { orderRequest_ID } = req.data

        const orderRequest = await SELECT.one
            .from('ProcurementService.OrderRequests')
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

        await UPDATE('ProcurementService.OrderRequests')
            .set({ status: 'REJECTED' })
            .where({ ID: orderRequest_ID })

        return {
            ...orderRequest,
            status: 'REJECTED'
        }
    })


    // ---------------------------------------------------------
    // CANCEL ORDER REQUEST
    // PENDING -> CANCELLED
    // ---------------------------------------------------------

    this.on('cancelOrderRequest', async req => {

        const { orderRequest_ID } = req.data

        const orderRequest = await SELECT.one
            .from('ProcurementService.OrderRequests')
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

        await UPDATE('ProcurementService.OrderRequests')
            .set({ status: 'CANCELLED' })
            .where({ ID: orderRequest_ID })

        return {
            ...orderRequest,
            status: 'CANCELLED'
        }
    })


    // =========================================================
    // ORDERS
    // =========================================================


    // ---------------------------------------------------------
    // CHANGE QUANTITY
    // ---------------------------------------------------------

    this.on('changeQuantity', 'Orders', async req => {

        const { quantity } = req.data
        const { ID } = req.params[0]

        const order = await SELECT.one
            .from('ProcurementService.Orders')
            .where({ ID })

        if (!order) {
            return req.reject(
                404,
                'Order does not exist'
            )
        }

        if (order.status !== 'CREATED') {
            return req.reject(
                400,
                'Only CREATED Orders can be modified'
            )
        }

        if (quantity <= 0) {
            return req.reject(
                400,
                'Quantity must be greater than zero'
            )
        }

        await UPDATE('ProcurementService.Orders')
            .set({ quantity })
            .where({ ID })

        return {
            ...order,
            quantity
        }
    })


    // ---------------------------------------------------------
    // CHANGE SUPPLIER
    // ---------------------------------------------------------

    this.on('changeSupplier', 'Orders', async req => {

        const { supplier_ID } = req.data
        const { ID } = req.params[0]

        const order = await SELECT.one
            .from('ProcurementService.Orders')
            .where({ ID })

        if (!order) {
            return req.reject(
                404,
                'Order does not exist'
            )
        }

        if (order.status !== 'CREATED') {
            return req.reject(
                400,
                'Only CREATED Orders can change supplier'
            )
        }

        await UPDATE('ProcurementService.Orders')
            .set({ supplier_ID })
            .where({ ID })

        return {
            ...order,
            supplier_ID
        }
    })


    // ---------------------------------------------------------
    // SEND ORDER TO SUPPLIER
    // CREATED -> SENT_TO_SUPPLIER
    // ---------------------------------------------------------

    this.on('sendToSupplier', 'Orders', async req => {

        const { ID } = req.params[0]

        const order = await SELECT.one
            .from('ProcurementService.Orders')
            .where({ ID })

        if (!order) {
            return req.reject(
                404,
                'Order does not exist'
            )
        }

        if (order.status !== 'CREATED') {
            return req.reject(
                400,
                'Only CREATED Orders can be sent to Supplier'
            )
        }

        // Later:
        // 1. Call supplier API
        // 2. Send email
        // 3. Send Purchase Order document

        await UPDATE('ProcurementService.Orders')
            .set({ status: 'SENT_TO_SUPPLIER' })
            .where({ ID })

        return {
            ...order,
            status: 'SENT_TO_SUPPLIER'
        }
    })


    // ---------------------------------------------------------
    // CANCEL ORDER
    // CREATED -> CANCELLED
    // ---------------------------------------------------------

    this.on('cancel', 'Orders', async req => {

        const { ID } = req.params[0]

        const order = await SELECT.one
            .from('ProcurementService.Orders')
            .where({ ID })

        if (!order) {
            return req.reject(
                404,
                'Order does not exist'
            )
        }

        if (order.status === 'CANCELLED') {
            return req.reject(
                400,
                'Order is already cancelled'
            )
        }

        await UPDATE('ProcurementService.Orders')
            .set({ status: 'CANCELLED' })
            .where({ ID })

        return {
            ...order,
            status: 'CANCELLED'
        }
    })

});
