## ADDED Requirements

### Requirement: Category icons use Lucide components
The system SHALL render a Lucide React icon for each product category instead of an emoji character. A centralized mapping object SHALL associate each category slug to a specific Lucide icon. Unknown slugs SHALL fall back to a generic `Package` icon.

#### Scenario: Known category displays correct icon
- **WHEN** a category with slug "vins" is rendered in the category grid
- **THEN** the system displays the `Wine` Lucide icon (not the 🍷 emoji)

#### Scenario: Unknown category displays fallback icon
- **WHEN** a category with an unrecognized slug is rendered
- **THEN** the system displays the `Package` Lucide icon

### Requirement: Checkout page uses Lucide icons
The system SHALL replace all emoji characters in the checkout flow with corresponding Lucide React icons: `Home` for home delivery, `Store` for store pickup, `CreditCard` for payment.

#### Scenario: Delivery mode selection shows icons
- **WHEN** the user views the delivery mode selection step
- **THEN** the "Livraison à domicile" option displays a `Home` icon and the "Retrait en boutique" option displays a `Store` icon (no emojis)

#### Scenario: Payment section shows credit card icon
- **WHEN** the user views the payment summary step
- **THEN** the "Paiement Mobile Money" label displays a `CreditCard` icon (not 💳)

### Requirement: Legal warnings use AlertTriangle icon
The system SHALL replace the ⚠️ emoji in alcohol warnings (footer, CGV, mentions légales) with the Lucide `AlertTriangle` icon styled in amber.

#### Scenario: Footer warning displays icon
- **WHEN** the site footer is rendered
- **THEN** the alcohol warning text is preceded by an `AlertTriangle` icon (not ⚠️)

### Requirement: Notifications contain no emoji characters
The system SHALL NOT include any emoji or Unicode pictogram in SMS or email notification content. Status labels SHALL use plain text (e.g., "Confirmée" instead of "✅ Confirmée").

#### Scenario: SMS notification has no emoji
- **WHEN** an SMS notification is sent for order status update
- **THEN** the SMS body contains no emoji characters — only plain text and ASCII

#### Scenario: Email notification has no emoji
- **WHEN** an order confirmation email is sent
- **THEN** the email subject and body contain no emoji characters

### Requirement: Admin delivery page uses Lucide icon
The system SHALL replace the 🚴 emoji next to delivery person names with the Lucide `Bike` icon.

#### Scenario: Delivery person displays icon
- **WHEN** a delivery assignment is shown in the admin livraisons page
- **THEN** the delivery person name is preceded by a `Bike` icon (not 🚴)
