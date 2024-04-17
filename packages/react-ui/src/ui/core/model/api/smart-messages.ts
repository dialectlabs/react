import {
  CreateSmartMessageTransactionCommandDto,
  SmartMessageTransactionDto,
  SubmitSmartMessageTransactionCommandDto,
} from './smart-messages.types';

function createSmartMessageApi() {
  return {
    cancelSmartMessage: async (
      dialectCloudUrl: string,
      smartMessageId: string,
    ) => {
      try {
        const res = await fetch(
          `${dialectCloudUrl}/api/v1/smart-messages/${smartMessageId}/cancel`,
          {
            method: 'POST',
          },
        );
        if (!res.ok) {
          console.warn(`Error cancelling smart message ${smartMessageId}`);
          return null;
        }
        return res.json();
      } catch (e) {
        console.warn(`Error cancelling smart message ${smartMessageId}`, e);
        return null;
      }
    },

    createSmartMessageTransaction: async (
      dialectCloudUrl: string,
      smartMessageId: string,
      token: string,
      command: CreateSmartMessageTransactionCommandDto,
    ): Promise<SmartMessageTransactionDto | null> => {
      try {
        const res = await fetch(
          `${dialectCloudUrl}/api/v1/smart-messages/${smartMessageId}/create-transaction`,
          {
            method: 'POST',
            body: JSON.stringify(command),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );
        if (!res.ok) {
          console.warn(
            `Error creating transaction for smart message ${smartMessageId}`,
          );
          return null;
        }
        return res.json();
      } catch (e) {
        console.warn(`Error creating transaction for ${smartMessageId}`, e);
        return null;
      }
    },

    submitSmartMessageTransaction: async (
      dialectCloudUrl: string,
      smartMessageId: string,
      token: string,
      command: SubmitSmartMessageTransactionCommandDto,
    ) => {
      try {
        const res = await fetch(
          `${dialectCloudUrl}/api/v1/smart-messages/${smartMessageId}/submit-transaction`,
          {
            method: 'POST',
            body: JSON.stringify(command),
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );

        if (!res.ok) {
          console.warn(
            `Error submitting transaction for smart message ${smartMessageId}`,
          );
          return null;
        }
        return res.json();
      } catch (e) {
        console.warn(`Error submitting transaction for ${smartMessageId}`, e);
        return null;
      }
    },
  };
}

export const smartMessageApi = createSmartMessageApi();
