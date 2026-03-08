## ADDED Requirements

### Requirement: Server validates email format
The `createOrder` server action SHALL validate the email field against a standard email format regex before creating the order. If the email is invalid, the action SHALL return an error without creating the order.

#### Scenario: Valid email accepted
- **WHEN** `createOrder` is called with email "jean@exemple.bj"
- **THEN** the email validation passes and order processing continues

#### Scenario: Invalid email rejected
- **WHEN** `createOrder` is called with email "nimportequoi"
- **THEN** the action returns `{ success: false, error: "Adresse email invalide." }` and no order is created

#### Scenario: Empty email rejected
- **WHEN** `createOrder` is called with email ""
- **THEN** the action returns `{ success: false, error: "Adresse email invalide." }` and no order is created

### Requirement: Server validates phone format
The `createOrder` server action SHALL validate the phone field — stripping whitespace and dashes, then verifying it contains at least 8 digits. If invalid, the action SHALL return an error.

#### Scenario: Valid phone accepted
- **WHEN** `createOrder` is called with phone "97001234"
- **THEN** the phone validation passes

#### Scenario: Short phone rejected
- **WHEN** `createOrder` is called with phone "123"
- **THEN** the action returns `{ success: false, error: "Numéro de téléphone invalide." }` and no order is created

### Requirement: Server recalculates prices from database
The `createOrder` server action SHALL load each product's current price from the database and use it as the authoritative `unitPrice`. The client-submitted `unitPrice` SHALL NOT be trusted. The subtotal SHALL be recalculated as the sum of (database price × quantity) for all items.

#### Scenario: Client sends correct prices
- **WHEN** `createOrder` is called with item unitPrice matching the database price
- **THEN** the order is created with the database price (same value)

#### Scenario: Client sends manipulated price
- **WHEN** `createOrder` is called with item unitPrice of 100 but the database price is 6000
- **THEN** the order is created using 6000 as the unitPrice (database price wins)

### Requirement: Server validates delivery zone fee
The `createOrder` server action SHALL load the delivery zone price from the database when delivery mode is HOME_DELIVERY. The total SHALL be recalculated as serverSubtotal + serverDeliveryFee.

#### Scenario: Delivery fee calculated from database
- **WHEN** `createOrder` is called with deliveryZoneId pointing to a zone with price 2000
- **THEN** the delivery fee on the order is 2000 (from the database, not from client)

#### Scenario: Store pickup has zero delivery fee
- **WHEN** `createOrder` is called with deliveryMode "STORE_PICKUP"
- **THEN** the delivery fee is 0 regardless of any client-submitted value

### Requirement: Server validates required delivery fields
The `createOrder` server action SHALL require address, city, and deliveryZoneId when delivery mode is HOME_DELIVERY. Missing fields SHALL cause an error.

#### Scenario: Home delivery with missing address
- **WHEN** `createOrder` is called with deliveryMode "HOME_DELIVERY" and no address
- **THEN** the action returns `{ success: false, error: "L'adresse de livraison est requise." }`

#### Scenario: Store pickup with no delivery fields
- **WHEN** `createOrder` is called with deliveryMode "STORE_PICKUP" and no address or zone
- **THEN** the validation passes (delivery fields not required for pickup)
