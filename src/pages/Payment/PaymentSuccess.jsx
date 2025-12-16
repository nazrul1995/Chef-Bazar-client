import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get('session_id');
    const axiosSecure = useAxiosSecure();
    //console.log('Session ID:', sessionId);
  useEffect(() => {
    if (sessionId) {
     axiosSecure.patch(`/payment-success?session_id=${sessionId}`)
     .then(response => {
        console.log('Payment success handled:', response.data);
     })
     .catch(error => {
        console.error('Error handling payment success:', error);
     }); 
    }
  }, [sessionId, axiosSecure]);
    return (
        <div>
            Payment Successful
        </div>
    );
};

export default PaymentSuccess;