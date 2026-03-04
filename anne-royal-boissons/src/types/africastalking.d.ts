declare module "africastalking" {
  interface AfricasTalkingOptions {
    username: string;
    apiKey: string;
  }

  interface SMSOptions {
    to: string[];
    message: string;
    from?: string;
  }

  interface SMSResponse {
    SMSMessageData: {
      Message: string;
      Recipients: Array<{
        statusCode: number;
        number: string;
        cost: string;
        status: string;
        messageId: string;
      }>;
    };
  }

  interface SMSService {
    send(options: SMSOptions): Promise<SMSResponse>;
  }

  interface AfricasTalkingInstance {
    SMS: SMSService;
  }

  function AfricasTalking(options: AfricasTalkingOptions): AfricasTalkingInstance;
  export = AfricasTalking;
}
