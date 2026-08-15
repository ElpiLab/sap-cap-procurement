//srv/procurement-service.cds → Describe and Defines what is exposed (Rooms and Bookings are accessible through an API)
using procurement.management as db from '../db/schema'; // Database Name

service ProcurementService {

    entity Approvals as projection on db.Approvals;
    entity ApprovalWorkflows as projection on db.ApprovalWorkflows;
    entity Contracts as projection on db.Contracts;
    entity CostCenters as projection on db.CostCenters;
    entity Departments as projection on db.Departments;
    entity Documents as projection on db.Documents;
    entity OrderRequests as projection on db.OrderRequests;
    entity Orders as projection on db.Orders;
    entity Payments as projection on db.Payments;
    entity Suppliers as projection on db.Suppliers;
    entity Users as projection on db.Users;
}