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
    // CREATE ORDER
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

        await UPDATE('ProcurementService.OrderRequests')
            .set({ status: 'APPROVED' })
            .where({ ID: orderRequest_ID })

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


    // =========================================================
    // INVOICES
    // =========================================================

    // ---------------------------------------------------------
    // MARK AS PAID
    // PENDING -> PAID
    // ---------------------------------------------------------

    this.on('markAsPaid', 'Invoices', async req => {

        const { ID } = req.params[0]

        const invoice = await SELECT.one
            .from('ProcurementService.Invoices')
            .where({ ID })

        if (!invoice) {
            return req.reject(
                404,
                'Invoice does not exist'
            )
        }

        if (invoice.status === 'PAID') {
            return req.reject(
                400,
                'Invoice is already paid'
            )
        }

        await UPDATE('ProcurementService.Invoices')
            .set({ status: 'PAID' })
            .where({ ID })

        return {
            ...invoice,
            status: 'PAID'
        }
    })


    // ---------------------------------------------------------
    // CANCEL INVOICE
    // PENDING -> CANCELLATION_REQUESTED
    // ---------------------------------------------------------

    this.on('cancelInvoice', 'Invoices', async req => {

        const { ID } = req.params[0]

        const invoice = await SELECT.one
            .from('ProcurementService.Invoices')
            .where({ ID })

        if (!invoice) {
            return req.reject(
                404,
                'Invoice does not exist'
            )
        }

        if (invoice.status === 'PAID') {
            return req.reject(
                400,
                'Paid invoices cannot be cancelled'
            )
        }

        await UPDATE('ProcurementService.Invoices')
            .set({ status: 'CANCELLATION_REQUESTED' })
            .where({ ID })

        return {
            ...invoice,
            status: 'CANCELLATION_REQUESTED'
        }
    })


    // ---------------------------------------------------------
    // DISPUTE INVOICE
    // PENDING -> DISPUTE_REQUESTED
    // ---------------------------------------------------------

    this.on('disputeInvoice', 'Invoices', async req => {

        const { ID } = req.params[0]

        const invoice = await SELECT.one
            .from('ProcurementService.Invoices')
            .where({ ID })

        if (!invoice) {
            return req.reject(
                404,
                'Invoice does not exist'
            )
        }

        if (invoice.status !== 'PENDING') {
            return req.reject(
                400,
                'Only PENDING invoices can be disputed'
            )
        }

        await UPDATE('ProcurementService.Invoices')
            .set({ status: 'DISPUTE_REQUESTED' })
            .where({ ID })

        return {
            ...invoice,
            status: 'DISPUTE_REQUESTED'
        }
    })


    // =========================================================
    // PAYMENTS
    // =========================================================

    // ---------------------------------------------------------
    // PROCESS PAYMENT
    // CREATED -> COMPLETED
    // ---------------------------------------------------------

    this.on('processPayment', 'Payments', async req => {

        const { ID } = req.params[0]

        const payment = await SELECT.one
            .from('ProcurementService.Payments')
            .where({ ID })

        if (!payment) {
            return req.reject(
                404,
                'Payment does not exist'
            )
        }

        if (payment.status !== 'CREATED') {
            return req.reject(
                400,
                'Only CREATED payments can be processed'
            )
        }

        await UPDATE('ProcurementService.Payments')
            .set({ status: 'COMPLETED' })
            .where({ ID })

        return {
            ...payment,
            status: 'COMPLETED'
        }
    })


    // ---------------------------------------------------------
    // CANCEL PAYMENT
    // CREATED -> CANCELLED
    // ---------------------------------------------------------

    this.on('cancelPayment', 'Payments', async req => {

        const { ID } = req.params[0]

        const payment = await SELECT.one
            .from('ProcurementService.Payments')
            .where({ ID })

        if (!payment) {
            return req.reject(
                404,
                'Payment does not exist'
            )
        }

        if (payment.status !== 'CREATED') {
            return req.reject(
                400,
                'Only CREATED payments can be cancelled'
            )
        }

        await UPDATE('ProcurementService.Payments')
            .set({ status: 'CANCELLED' })
            .where({ ID })

        return {
            ...payment,
            status: 'CANCELLED'
        }
    })


    // =========================================================
    // SUPPLIERS
    // =========================================================

    // ---------------------------------------------------------
    // ACTIVATE SUPPLIER
    // ---------------------------------------------------------

    this.on('activateSupplier', 'Suppliers', async req => {

        const { ID } = req.params[0]

        const supplier = await SELECT.one
            .from('ProcurementService.Suppliers')
            .where({ ID })

        if (!supplier) {
            return req.reject(
                404,
                'Supplier does not exist'
            )
        }

        if (supplier.status === 'ACTIVE') {
            return req.reject(
                400,
                'Supplier is already active'
            )
        }

        await UPDATE('ProcurementService.Suppliers')
            .set({ status: 'ACTIVE' })
            .where({ ID })

        return {
            ...supplier,
            status: 'ACTIVE'
        }
    })


    // ---------------------------------------------------------
    // DEACTIVATE SUPPLIER
    // ---------------------------------------------------------

    this.on('deactivateSupplier', 'Suppliers', async req => {

        const { ID } = req.params[0]

        const supplier = await SELECT.one
            .from('ProcurementService.Suppliers')
            .where({ ID })

        if (!supplier) {
            return req.reject(
                404,
                'Supplier does not exist'
            )
        }

        if (supplier.status !== 'ACTIVE') {
            return req.reject(
                400,
                'Only ACTIVE suppliers can be deactivated'
            )
        }

        await UPDATE('ProcurementService.Suppliers')
            .set({ status: 'INACTIVE' })
            .where({ ID })

        return {
            ...supplier,
            status: 'INACTIVE'
        }
    })


    // ---------------------------------------------------------
    // BLOCK SUPPLIER
    // ---------------------------------------------------------

    this.on('blockSupplier', 'Suppliers', async req => {

        const { ID } = req.params[0]

        const supplier = await SELECT.one
            .from('ProcurementService.Suppliers')
            .where({ ID })

        if (!supplier) {
            return req.reject(
                404,
                'Supplier does not exist'
            )
        }

        if (supplier.status === 'BLOCKED') {
            return req.reject(
                400,
                'Supplier is already blocked'
            )
        }

        await UPDATE('ProcurementService.Suppliers')
            .set({ status: 'BLOCKED' })
            .where({ ID })

        return {
            ...supplier,
            status: 'BLOCKED'
        }
    })


    // =========================================================
    // DOCUMENTS
    // =========================================================

    // ---------------------------------------------------------
    // ARCHIVE DOCUMENT
    // ACTIVE -> ARCHIVED
    // ---------------------------------------------------------

    this.on('archiveDocument', 'Documents', async req => {

        const { ID } = req.params[0]

        const document = await SELECT.one
            .from('ProcurementService.Documents')
            .where({ ID })

        if (!document) {
            return req.reject(
                404,
                'Document does not exist'
            )
        }

        if (document.status === 'ARCHIVED') {
            return req.reject(
                400,
                'Document is already archived'
            )
        }

        await UPDATE('ProcurementService.Documents')
            .set({ status: 'ARCHIVED' })
            .where({ ID })

        return {
            ...document,
            status: 'ARCHIVED'
        }
    })


    // ---------------------------------------------------------
    // RESTORE DOCUMENT
    // ARCHIVED -> ACTIVE
    // ---------------------------------------------------------

    this.on('restoreDocument', 'Documents', async req => {

        const { ID } = req.params[0]

        const document = await SELECT.one
            .from('ProcurementService.Documents')
            .where({ ID })

        if (!document) {
            return req.reject(
                404,
                'Document does not exist'
            )
        }

        if (document.status !== 'ARCHIVED') {
            return req.reject(
                400,
                'Only ARCHIVED documents can be restored'
            )
        }

        await UPDATE('ProcurementService.Documents')
            .set({ status: 'ACTIVE' })
            .where({ ID })

        return {
            ...document,
            status: 'ACTIVE'
        }
    })


    // =========================================================
    // APPROVALS
    // =========================================================

    // ---------------------------------------------------------
    // APPROVE APPROVAL
    // PENDING -> APPROVED
    // ---------------------------------------------------------

    this.on('approveApproval', 'Approvals', async req => {

        const { ID } = req.params[0]

        const approval = await SELECT.one
            .from('ProcurementService.Approvals')
            .where({ ID })

        if (!approval) {
            return req.reject(
                404,
                'Approval does not exist'
            )
        }

        if (approval.status !== 'PENDING') {
            return req.reject(
                400,
                'Only PENDING approvals can be approved'
            )
        }

        await UPDATE('ProcurementService.Approvals')
            .set({ status: 'APPROVED' })
            .where({ ID })

        return {
            ...approval,
            status: 'APPROVED'
        }
    })


    // ---------------------------------------------------------
    // REJECT APPROVAL
    // PENDING -> REJECTED
    // ---------------------------------------------------------

    this.on('rejectApproval', 'Approvals', async req => {

        const { ID } = req.params[0]

        const approval = await SELECT.one
            .from('ProcurementService.Approvals')
            .where({ ID })

        if (!approval) {
            return req.reject(
                404,
                'Approval does not exist'
            )
        }

        if (approval.status !== 'PENDING') {
            return req.reject(
                400,
                'Only PENDING approvals can be rejected'
            )
        }

        await UPDATE('ProcurementService.Approvals')
            .set({ status: 'REJECTED' })
            .where({ ID })

        return {
            ...approval,
            status: 'REJECTED'
        }
    })


    // =========================================================
    // CONTRACTS
    // =========================================================

    // ---------------------------------------------------------
    // ACTIVATE CONTRACT
    // INVALID -> VALID
    // ---------------------------------------------------------

    this.on('activateContract', 'Contracts', async req => {

        const { ID } = req.params[0]

        const contract = await SELECT.one
            .from('ProcurementService.Contracts')
            .where({ ID })

        if (!contract) {
            return req.reject(
                404,
                'Contract does not exist'
            )
        }

        if (contract.isValid === true) {
            return req.reject(
                400,
                'Contract is already active'
            )
        }

        await UPDATE('ProcurementService.Contracts')
            .set({ isValid: true })
            .where({ ID })

        return {
            ...contract,
            isValid: true
        }
    })


    // ---------------------------------------------------------
    // DEACTIVATE CONTRACT
    // VALID -> INVALID
    // ---------------------------------------------------------

    this.on('deactivateContract', 'Contracts', async req => {

        const { ID } = req.params[0]

        const contract = await SELECT.one
            .from('ProcurementService.Contracts')
            .where({ ID })

        if (!contract) {
            return req.reject(
                404,
                'Contract does not exist'
            )
        }

        if (contract.isValid !== true) {
            return req.reject(
                400,
                'Contract is already inactive'
            )
        }

        await UPDATE('ProcurementService.Contracts')
            .set({ isValid: false })
            .where({ ID })

        return {
            ...contract,
            isValid: false
        }
    })


    // ---------------------------------------------------------
    // RENEW CONTRACT
    // ---------------------------------------------------------

    this.on('renewContract', 'Contracts', async req => {

        const { ID } = req.params[0]

        const contract = await SELECT.one
            .from('ProcurementService.Contracts')
            .where({ ID })

        if (!contract) {
            return req.reject(
                404,
                'Contract does not exist'
            )
        }

        if (contract.isValid !== true) {
            return req.reject(
                400,
                'Only active contracts can be renewed'
            )
        }

        // Add your contract date extension here
        // once you confirm the actual date fields in db/schema.cds.

        return contract
    })

})