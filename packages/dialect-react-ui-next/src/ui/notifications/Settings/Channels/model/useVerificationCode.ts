import { AddressType, useNotificationChannel } from '@dialectlabs/react-sdk';
import { useState } from 'react';
export const useVerificationCode = (addressType: AddressType) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [currentError, setCurrentError] = useState<Error | null>(null);
  const {
    verify,
    resend,
    isSendingCode,
    isVerifyingCode,
    delete: deleteAddr,
  } = useNotificationChannel({
    addressType,
  });

  const sendCode = async () => {
    try {
      await verify({ code: verificationCode });
      setCurrentError(null);
    } catch (e) {
      setCurrentError(e as Error);
    } finally {
      setVerificationCode('');
    }
  };

  const resendCode = async () => {
    try {
      await resend();
      setCurrentError(null);
    } catch (e) {
      setCurrentError(e as Error);
    }
  };

  const deleteAddress = async () => {
    try {
      await deleteAddr();
      setCurrentError(null);
    } catch (e) {
      setCurrentError(e as Error);
    }
  };

  return {
    verificationCode,
    setVerificationCode,
    sendCode,
    isSendingCode: isVerifyingCode,
    resendCode,
    isResendingCode: isSendingCode,
    deleteAddress,
    currentError,
  };
};
