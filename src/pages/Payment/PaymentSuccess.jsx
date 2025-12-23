import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useMutation } from '@tanstack/react-query';
const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const [paymentInfo, setPaymentInfo] = useState({});
    const sessionId = searchParams.get('session_id');
    const axiosSecure = useAxiosSecure();
const { mutate, isLoading, isError } = useMutation({
    mutationFn: async () => {
        const res = await axiosSecure.patch(`/payment-success?session_id=${sessionId}`);
        return res.data;
    },
    onSuccess: (res) => {
        setPaymentInfo(res);
    },
});

useEffect(() => {
    if (sessionId) mutate();
}, [sessionId,mutate]);


    useEffect(() => {
        if (sessionId) {
            axiosSecure.patch(`/payment-success?session_id=${sessionId}`)
                .then(res => {
                    console.log(res.data)
                    setPaymentInfo({
                        transactionId: res.data.transactionId,
                        trackingId : res.data.trackingId
                    })
                })
        }

    }, [sessionId, axiosSecure])
 if (isLoading) return <p>Processing payment...</p>;
    if (isError) return <p>Something went wrong!</p>;
    return (
        <div>
            <h2 className="text-4xl">Payment successful</h2>
            <p>Your TransactionId: {paymentInfo.transactionId}</p>
            <p>Your Parcel Tracking id: {paymentInfo.trackingId}</p>
        </div>
    );
};

export default PaymentSuccess;