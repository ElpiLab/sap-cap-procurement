// srv/procurement-service.cds
// Defines what is exposed through the ProcurementService API.

using { procurement.management as db } from '../db/schema';

service ProcurementService {

    // ============================================================
    // APPROVALS
    // ============================================================

    @restrict: [
        {
            grant: 'READ',
            to: ['Employee', 'TeamLead', 'DepartmentManager', 'Director', 'Executive']
        },
        {
            grant: ['READ', 'CREATE', 'UPDATE'],
            to: 'Procurement'
        }
    ]
    entity Approvals as projection on db.Approvals;


    // ============================================================
    // APPROVAL WORKFLOWS
    // ============================================================

    @restrict: [
        {
            grant: 'READ',
            to: ['Employee', 'TeamLead', 'DepartmentManager', 'Director', 'Executive']
        },
        {
            grant: ['READ', 'CREATE', 'UPDATE'],
            to: 'Procurement'
        }
    ]
    entity ApprovalWorkflows as projection on db.ApprovalWorkflows;


    // ============================================================
    // CONTRACTS
    // ============================================================

    @restrict: [
        {
            grant: ['READ', 'CREATE', 'UPDATE'],
            to: ['Director', 'Executive']
        },
        {
            grant: 'READ',
            to: ['Employee', 'TeamLead', 'DepartmentManager'],
            where: (isValid = true)
        }
    ]
    entity Contracts as projection on db.Contracts;


    // ============================================================
    // COST CENTERS
    // ============================================================

    @restrict: [
        {
            grant: ['READ', 'CREATE', 'UPDATE'],
            to: ['DepartmentManager', 'Director', 'Executive']
        },
        {
            grant: 'READ',
            to: ['Employee', 'TeamLead']
        }
    ]
    entity CostCenters as projection on db.CostCenters;


    // ============================================================
    // DEPARTMENTS
    // ============================================================

    @restrict: [
        {
            grant: 'READ',
            to: ['Employee', 'TeamLead', 'DepartmentManager', 'Director', 'Executive']
        },
        {
            grant: ['CREATE', 'UPDATE'],
            to: 'Executive'
        }
    ]
    entity Departments as projection on db.Departments;


    // ============================================================
    // DOCUMENTS
    // ============================================================

    @restrict: [
        {
            grant: 'READ',
            to: ['Employee', 'TeamLead', 'DepartmentManager', 'Director', 'Executive', 'Procurement']
        },
        {
            grant: ['CREATE', 'UPDATE'],
            to: 'Procurement'
        }
    ]
    entity Documents as projection on db.Documents;


    // ============================================================
    // ORDER REQUESTS
    // ============================================================

    @restrict: [
    {
        grant: ['READ', 'CREATE', 'UPDATE'],
        to: 'Employee',
        where: (requester.userId = $user)
    },
    {
        grant: ['READ', 'CREATE', 'UPDATE'],
        to: 'Procurement'
    },
    {
        grant: 'READ',
        to: ['TeamLead', 'DepartmentManager', 'Director', 'Executive']
    }
]
    entity OrderRequests as projection on db.OrderRequests actions {
        action submitOrderRequest();

        action approveOrderRequest();

        action rejectOrderRequest();

        action cancelOrderRequest();
        }


    // ============================================================
    // ORDERS
    // ============================================================

   @restrict: [
    {
        grant: 'READ',
        to: 'Employee',
        where: (requester.userId = $user)
    },
    {
        grant: ['READ', 'CREATE', 'UPDATE'],
        to: 'Procurement'
    },
    {
        grant: 'READ',
        to: ['TeamLead', 'DepartmentManager', 'Director', 'Executive']
    }
]
    entity Orders as projection on db.Orders actions {
        action changeQuantity(quantity: Integer);

        action changeSupplier(supplier_ID: UUID);

        action sendToSupplier();

        action cancel();
    }


    // ============================================================
    // PAYMENTS
    // ============================================================

    @restrict: [
        {
            grant: ['READ', 'CREATE', 'UPDATE'],
            to: ['FinanceTeam', 'Director', 'Executive']
        }
    ]
    entity Payments as projection on db.Payments;


    // ============================================================
    // SUPPLIERS
    // ============================================================

    @restrict: [
        {
            grant: 'READ',
            to: ['Employee', 'TeamLead', 'DepartmentManager', 'Director', 'Executive']
        },
        {
            grant: ['READ', 'CREATE', 'UPDATE'],
            to: 'Procurement'
        }
    ]
    entity Suppliers as projection on db.Suppliers;


    // ============================================================
    // USERS
    // ============================================================

    @restrict: [
        {
            grant: 'READ',
            to: ['TeamLead', 'DepartmentManager', 'Director', 'Executive']
        },
        {
            grant: ['CREATE', 'UPDATE', 'DELETE'],
            to: 'Executive'
        }
    ]
    entity Users as projection on db.Users;


    @restrict: [
    {
        grant: 'READ',
        to: 'Employee',
        where: (orderedBy.userId = $user)
    },
    {
        grant: ['READ', 'CREATE', 'DELETE'],
        to: 'Accounting'
    },
    {
        grant: 'READ',
        to: ['TeamLead', 'DepartmentManager', 'Director', 'Executive']
    }
]
    entity Invoices as projection on db.Invoices;


    @restrict: [
    {
        grant: 'READ',
        to: 'Employee',
        where: (order.requester.userId = $user)
    },
    {
        grant: ['READ', 'CREATE', 'UPDATE'],
        to: 'Procurement'
    },
    {
        grant: 'READ',
        to: ['TeamLead', 'DepartmentManager', 'Director', 'Executive']
    }
]
    entity OrderPositions  as projection on db.OrderPositions;



    

}