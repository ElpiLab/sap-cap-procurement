using { tender.management as tender } from '../db/tender_schema';

service TenderService {

    entity Tenders as projection on tender.Tenders;

    entity TenderPositions as projection on tender.TenderPositions;

    entity TenderSuppliers as projection on tender.TenderSuppliers;

    entity TenderOffers as projection on tender.TenderOffers;
}