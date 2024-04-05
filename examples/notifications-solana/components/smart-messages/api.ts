import {
  CreateSmartMessageTransactionCommandDto,
  SmartMessageTransactionDto,
  SubmitSmartMessageTransactionCommandDto,
} from './types';

function createSmartMessageApi() {
  return {
    cancelSmartMessage: async (smartMessageUrl: string) => {
      try {
        const res = await fetch(`${smartMessageUrl}/cancel`, {
          method: 'POST',
        });
        if (!res.ok) {
          console.warn(`Error cancelling smart message ${smartMessageUrl}`);
          return null;
        }
        return res.json();
      } catch (e) {
        console.warn(`Error cancelling smart message ${smartMessageUrl}`, e);
        return null;
      }
    },

    createSmartMessageTransaction: async (
      smartMessageUrl: string,
      token: string,
      command: CreateSmartMessageTransactionCommandDto
    ): Promise<SmartMessageTransactionDto | null> => {
      try {
        const res = await fetch(`${smartMessageUrl}/create-transaction`, {
          method: 'POST',
          body: JSON.stringify(command),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.warn(`Error creating transaction for ${smartMessageUrl}`);
          return null;
        }

        return res.json();
      } catch (e) {
        console.warn(`Error creating transaction for ${smartMessageUrl}`, e);
        return null;
      }
    },

    submitSmartMessageTransaction: async (
      smartMessageUrl: string,
      token: string,
      command: SubmitSmartMessageTransactionCommandDto
    ) => {
      try {
        const res = await fetch(`${smartMessageUrl}/submit-transaction`, {
          method: 'POST',
          body: JSON.stringify(command),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.warn(`Error submitting transaction for ${smartMessageUrl}`);
          return null;
        }
        return res.json();
      } catch (e) {
        console.warn(`Error submitting transaction for ${smartMessageUrl}`, e);
        return null;
      }
    },
  };
}

export const smartMessageApi = createSmartMessageApi();
