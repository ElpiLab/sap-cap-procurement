# sap-cap-procurement

Documentation Sources:

- https://cap.cloud.sap/docs/guides/services/custom-actions

-  Initialization: https://cap.cloud.sap/docs/get-started/
- Service: service CatalogService {
  entity Books {
    key ID:Integer; title:String; author:String;
  }
}
- Service: https://cap.cloud.sap/docs/node.js/core-services#srv-on-before-after

- RBAC: https://cap.cloud.sap/docs/tools/cds-lint/rules/auth-use-requires/
using { sap.capire.bookshop as my } from '../db/schema';

service CatalogService {
  @readonly entity ListOfBooks as projection on Books
  excluding { descr };

  @readonly entity Books as projection on my.Books { *,
    author.name as author
  } excluding { createdBy, modifiedBy }
  actions {
    @requires: 'Admin'
    action addRating (stars: Integer);
  }
}


### Learning:
- @requires: Who can do it CRUD? Create, Read, Update, Delete
- actions: What operations exist? (approve, request....)
- Example:
    // ORDER REQUESTS

    @restrict: [
    {
        grant: ['READ', 'CREATE', 'UPDATE'],
        to: 'Employee',
        where: (requester.userId = $user)
    },
    {
        grant: ['READ', 'CREATE', 'UPDATE', 'DELETE'],
        to: 'Procurement'
    },
    {
        grant: 'READ',
        to: ['TeamLead', 'DepartmentManager', 'Director', 'Executive']
    }
]
    entity OrderRequests as projection on db.OrderRequests actions {
            action submit();
            action approve();
            action reject();
            action cancel();
        }




