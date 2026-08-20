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
- @requires: Who can do CRUD? Create, Read, Update, Delete
- actions: What operations exist? (approve, request....)
- 


