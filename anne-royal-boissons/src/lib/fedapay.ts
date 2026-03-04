import { FedaPay, Transaction } from "fedapay";

/**
 * Configure the FedaPay SDK based on environment variables.
 * Must be called once before using any FedaPay resource.
 */
function configureFedaPay() {
  FedaPay.setApiKey(process.env.FEDAPAY_SECRET_KEY!);
  FedaPay.setEnvironment(process.env.FEDAPAY_ENV === "live" ? "live" : "sandbox");
}

export interface CreateTransactionParams {
  orderId: string;
  amount: number;
  description: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
}

export interface TransactionResult {
  transactionId: string;
  paymentUrl: string;
}

/**
 * Create a FedaPay transaction and generate a payment token/URL.
 */
export async function createFedaPayTransaction(
  params: CreateTransactionParams
): Promise<TransactionResult> {
  configureFedaPay();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  // 1. Create the transaction
  const transaction = await Transaction.create({
    description: params.description,
    amount: params.amount,
    currency: { iso: "XOF" },
    callback_url: `${appUrl}/commande/${params.orderId}/confirmation`,
    customer: {
      email: params.customerEmail,
      firstname: params.customerName.split(" ")[0] || params.customerName,
      lastname: params.customerName.split(" ").slice(1).join(" ") || ".",
      phone_number: {
        number: params.customerPhone,
        country: "bj",
      },
    },
  });

  // 2. Generate a payment token to get the hosted payment URL
  const token = await transaction.generateToken();

  return {
    transactionId: String(transaction.id),
    paymentUrl: token.url as string,
  };
}
