namespace procurement.management;

// -------------------------
// Suppliers
// -------------------------

entity Suppliers {
    key ID : Integer;

    product : String;
    name : String;
    description : String;
    notes : String;
    location : String;
    contactPerson : String;
    phone : String;

    bankName : String;
    iban : String;
    swift : String;
    bankAccount : String;

    supplierCategory : String;
    industry : String;
    website : String;
    country : String;
    riskScore : String;
    currency : String;
    incoterms : String;
    status : String;

    auditStatus : String;
    lastAuditDate : Date;
    nextAuditDate : Date;

    contract : Association to many Contracts
        on contract.supplier = $self;
}


// -------------------------
// Orders
// -------------------------

entity Orders {
    key ID : Integer;

    orderName : String;
    orderDate : Date;
    orderDeliveryDate : Date;
    orderStatus : String;
    paymentStatus : String;
    totalAmount : String;

    supplier : Association to Suppliers;
    costcenter : Association to CostCenters;
    contract : Association to Contracts;

    approvals : Association to many Approvals
        on approvals.order = $self;

    payment : Association to many Payments
        on payment.order = $self;
}


// -------------------------
// Cost Centers
// -------------------------

entity CostCenters {
    key ID : Integer;

    name : String;
    description : String;
    budget : Integer;
    validFrom : Date;
    expiresAt : Date;
    active : Boolean;

    responsibleUser : Association to Users;
}


// -------------------------
// Approvals
// -------------------------

entity Approvals {
    key ID : Integer;

    approvalType : String;
    approvalLevel : String;
    status : String;
    approvedAt : Date;
    rejectedAt : Date;
    comment : String;
    approvalOrder : Integer;

    approver : Association to Users;

    order : Association to Orders;
    orderRequest : Association to OrderRequests;
    workflow : Association to ApprovalWorkflows;
}


// -------------------------
// Order Requests
// -------------------------

entity OrderRequests {
    key ID : Integer;

    name : String;
    description : String;
    status : String;
    comment : String;

    requester : Association to Users;
    order : Association to Orders;
    costcenter : Association to CostCenters;
    supplier : Association to Suppliers;

    approvals : Association to many Approvals
        on approvals.orderRequest = $self;
}


// -------------------------
// Users
// -------------------------

entity Users {
    key ID : Integer;

    name : String;
    role : String;
    email : String;
    phone : String;
    employeeNumber : String;
    location : String;

    department : Association to Departments;
}


// -------------------------
// Approval Workflows
// -------------------------

entity ApprovalWorkflows {
    key ID : Integer;

    name : String;
    description : String;

    approval : Association to many Approvals
        on approval.workflow = $self;
}


// -------------------------
// Departments
// -------------------------

entity Departments {
    key ID : Integer;

    name : String;
    description : String;
    organisation : String;
    teamSize : Integer;
    location : String;
    businessEntity : String;

    user : Association to many Users
        on user.department = $self;
}


// -------------------------
// Contracts
// -------------------------

entity Contracts {
    key ID : Integer;

    name : String;
    description : String;
    validFrom : Date;
    expiresAt : Date;
    isValid : Boolean;
    materialGroup : String;
    contractCategory : String;

    document : LargeBinary;

    responsiblePerson : Association to Users;
    supplier : Association to Suppliers;
}


// -------------------------
// Documents
// -------------------------

entity Documents {
    key ID : Integer;

    fileName : String;
    description : String;
    mediaType : String;
    uploadedAt : Date;
    uploadedBy : Association to Users;

    isValid : Boolean;
    validFrom : Date;
    expiresAt : Date;

    documentCategory : String;
    sensitiveData : Boolean;
    documentType : String;
    content : LargeBinary;

    order : Association to Orders;
    orderRequest : Association to OrderRequests;
    supplier : Association to Suppliers;
    approval : Association to Approvals;
}


// -------------------------
// Payments
// -------------------------

entity Payments {
    key ID : Integer;

    name : String;
    description : String;
    status : String;
    paymentType : String;

    approvedBy : Association to Users;
    processedBy : Association to Users;

    order : Association to Orders;
}
