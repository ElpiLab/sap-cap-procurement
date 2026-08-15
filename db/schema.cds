namespace procurement.management; // This means ALL entities in this file belong to the namespace procurement.management.

// The CSV filename MUST match the namespace + entity name exactly:

entity Suppliers {
    key ID : Integer;
    product: String;
    name : String;
    description : String;
    notes: String;
    location : String;
    contactPerson: String;
    Phone: String;
    bankName: String;
    iban: Integer;
    swift: String;
    bankAccount: Integer;
    supplierCategory : String;
    industry : String;
    website: String;
    country: String;
    riskScore: String;
    currency: String;
    incoterms: String;
    status: String;
    auditStatus: String;
    lastAuditDate: Date;
    nextAuditDate: Date;
}

entity Orders {
    key ID: Integer;
    orderName: String;
    orderDate: Date;
    orderDeliveryDate: Date;
    orderStatus: String;
    paymentStatus: String;
    totalAmount: String;

    supplier : Association to Suppliers;
    requester: Association to many Requesters;
    costcenter: Association to CostCenters;
    approval: Association to many Approvals;
}

entity Requesters {
    key ID: Integer;
    name: String;
    email: String;
    phone: String;
    department: String;
    role: String;
    employeeNumber: String;
    manager: String;
    location: String;

}

entity CostCenters {
    key ID: Integer;
    name: String;
    description: String;
    budget: Integer;
    remainingBudget: Integer;
    totalSpent: Integer;
    validFrom: Date;
    expiresAt: Date;
    active: Boolean;

}

entity Approvals {
    key ID: Integer;
    approvalType: String;
    approvalLevel: String;
    status: String;
    approver: String;
    approvedAt: Date;
    rejectedAt: String;
    comment: String;
    approvalOrder: Integer;

}