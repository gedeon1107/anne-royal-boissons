## ADDED Requirements

### Requirement: Webhook verifies payment amount
The FedaPay webhook handler SHALL compare the amount in the webhook payload (`data.amount`) to the order's `total` field stored in the database. If the amounts do not match, the order SHALL NOT be confirmed.

#### Scenario: Correct amount confirms order
- **WHEN** the webhook receives a transaction.approved event with `data.amount` equal to the order's total
- **THEN** the order status is updated to CONFIRMED and stock is decremented

#### Scenario: Mismatched amount does not confirm order
- **WHEN** the webhook receives a transaction.approved event with `data.amount` lower than the order's total
- **THEN** the order status remains PENDING, stock is not decremented, and a warning is logged

#### Scenario: Missing amount field does not confirm order
- **WHEN** the webhook receives a payload without `data.amount`
- **THEN** the order status remains PENDING and a warning is logged

### Requirement: Webhook is idempotent
The FedaPay webhook handler SHALL be idempotent — if the order has already been confirmed (status is not PENDING), the webhook SHALL return a 200 response without modifying the order or decrementing stock again.

#### Scenario: First webhook call confirms the order
- **WHEN** the webhook receives a transaction.approved event for an order with status PENDING
- **THEN** the order is confirmed and stock decremented

#### Scenario: Duplicate webhook call is ignored
- **WHEN** the webhook receives a transaction.approved event for an order with status CONFIRMED
- **THEN** the handler returns 200 without modifying the order or stock

#### Scenario: Webhook for cancelled order is ignored
- **WHEN** the webhook receives a transaction.approved event for an order with status CANCELLED
- **THEN** the handler returns 200 without modifying the order

### Requirement: Webhook logs suspicious activity
The webhook handler SHALL log a warning with the transaction ID, expected amount, and received amount when a payment amount mismatch is detected.

#### Scenario: Amount mismatch is logged
- **WHEN** the webhook detects a payment of 5000 XOF for an order totaling 10000 XOF
- **THEN** a warning log is emitted containing the transaction ID, expected amount (10000), and received amount (5000)
