using { procurement.management as procurement }
    from './schema';

namespace tender.management;


// -------------------------
// Tenders
// -------------------------

entity Tenders {
    key ID : Integer;

    tenderNumber : String;
    title : String;
    description : String;

    status : String;
    tenderType : String;

    publicationDate : Date;
    submissionDeadline : Date;

    estimatedValue : Decimal(15,2);
    currency : String;

    requester : Association to procurement.Users;
    costcenter : Association to procurement.CostCenters;

    positions : Association to many TenderPositions
        on positions.tender = $self;

    suppliers : Association to many TenderSuppliers
        on suppliers.tender = $self;

    offers : Association to many TenderOffers
        on offers.tender = $self;

    contract : Association to procurement.Contracts;
}

// -------------------------
// Tender Positions
// -------------------------

entity TenderPositions {
    key ID : Integer;

    positionNumber : Integer;

    description : String;
    quantity : Decimal(15,3);
    unit : String;

    estimatedUnitPrice : Decimal(15,2);
    estimatedTotalPrice : Decimal(15,2);

    tender : Association to Tenders;
}


// -------------------------
// Tender Suppliers
// -------------------------

entity TenderSuppliers {
    key ID : Integer;

    invitationStatus : String;
    invitedAt : Date;
    responseDeadline : Date;

    tender : Association to Tenders;
    supplier : Association to procurement.Suppliers;
}


// -------------------------
// Tender Offers
// -------------------------

entity TenderOffers {
    key ID : Integer;

    offerNumber : String;

    submittedAt : Date;
    validUntil : Date;

    status : String;

    totalAmount : Decimal(15,2);
    currency : String;

    comment : String;

    tender : Association to Tenders;
    supplier : Association to procurement.Suppliers;
}