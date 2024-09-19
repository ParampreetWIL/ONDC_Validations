# Schema Differences

ONDC Specification: [here](https://github.com/ONDC-Official/mobility-specification/tree/release-TRV10-2.0.1/api/components/examples/on-demand)

- [ ] On Search
- [ ] On Select
- [ ] On Init
- [x] On Confirm
- [x] On Status
- [ ] On Update
- [ ] On Status

### On Confirm

1. `/message/catalog/providers/0/fulfillments/<all indexes>/stops/0/instructions` needs `name` property mandatory but not given in ONDC specification
2. `/message/catalog/providers/0/payments/0/tags/1/descriptor` needs `name` property mandatory but not given in ONDC specification
3. `/message/catalog/providers/0/payments/0/tags/1/list/<all indexes>/descriptor` needs `name` property mandatory but not given in ONDC specification
4. `/message/catalog/providers/0/payments/0/tags/1/list/0/descriptor/code` has allowed value of `SETTLEMENT_WINDOW` but in ONDC specification it is given `DELAY_INTEREST`


### On Status

1. `/message/order/items/0/tags/0/list/<all indexes>/descriptor` needs `name` property mandatory but not given in ONDC specification
2. `/message/order/fulfillments/0/stops/0/instructions` needs `name` property mandatory but not given in ONDC specification
3. `/message/order/cancellation_terms/0/fulfillment_state/descriptor` needs `name` property mandatory but not given in ONDC specification
4. `/message/order/cancellation_terms/1/fulfillment_state/descriptor` needs `name` property mandatory but not given in ONDC specification
5. `/message/order/payments/0/tags/<all indexes>/descriptor` require `name` property mandatory