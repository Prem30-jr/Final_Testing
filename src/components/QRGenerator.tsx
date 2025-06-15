import React, { useState, useEffect, useCallback } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { motion } from 'framer-motion';
import { QrCode, Copy, Clock, Shield, CheckCircle, Smartphone } from 'lucide-react';

interface QRGeneratorProps {
  amount: string;
  description: string;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  setAmount: React.Dispatch<React.SetStateAction<string>>;
  setDescription: React.Dispatch<React.SetStateAction<string>>;
  timeLeft: number;
}

const QRGenerator: React.FC<QRGeneratorProps> = ({ amount, description, setTimeLeft, setAmount, setDescription, timeLeft }) => {
  const [qrData, setQrData] = useState('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'completed' | 'expired'>('pending');
  const [paymentStartTime, setPaymentStartTime] = useState<number | null>(null);
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);

  const generateQR = () => {
    if (!amount || !description) {
      alert('Please enter both amount and description.');
      return;
    }

    const data = JSON.stringify({
      amount,
      description,
      timestamp: Date.now(),
    });

    setQrData(data);
    setPaymentStatus('pending');
    setPaymentStartTime(null);
    setShowPaymentSuccess(false);
  };

  const simulatePaymentScan = useCallback(() => {
    if (paymentStatus !== 'pending') return;
    
    setPaymentStatus('processing');
    setPaymentStartTime(Date.now());
    
    // Simulate payment processing time (3-5 seconds)
    const processingTime = Math.random() * 2000 + 3000;
    
    setTimeout(() => {
      setPaymentStatus('completed');
      setShowPaymentSuccess(true);
      
      // Auto-hide success message after 3 seconds
      setTimeout(() => {
        setShowPaymentSuccess(false);
      }, 3000);
    }, processingTime);
  }, [paymentStatus]);

  const resetPayment = () => {
    setQrData('');
    setPaymentStatus('pending');
    setPaymentStartTime(null);
    setShowPaymentSuccess(false);
    setTimeLeft(300);
    setAmount('');
    setDescription('');
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      setQrData('');
      setPaymentStatus('expired');
    }
  }, [timeLeft, setQrData]);

  // Simulate random QR code scanning (for demo purposes)
  useEffect(() => {
    if (!qrData || paymentStatus !== 'pending') return;
    
    // Random chance of payment being scanned (simulate real-world usage)
    const scanTimeout = setTimeout(() => {
      if (Math.random() > 0.3) { // 70% chance of being scanned
        simulatePaymentScan();
      }
    }, Math.random() * 10000 + 5000); // Random time between 5-15 seconds
    
    return () => clearTimeout(scanTimeout);
  }, [qrData, paymentStatus, simulatePaymentScan]);

  return (
    <div className="space-y-6">
      {/* Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
            Amount
          </label>
          <div className="mt-1">
            <input
              type="number"
              name="amount"
              id="amount"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <div className="mt-1">
            <input
              type="text"
              name="description"
              id="description"
              className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="Payment for..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Generate QR Code Button */}
      <button
        onClick={generateQR}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
      >
        Generate QR Code
      </button>

      {qrData && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          {/* Payment Status Indicator */}
          <div className="flex items-center justify-center space-x-2">
            {paymentStatus === 'pending' && (
              <>
                <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></div>
                <span className="text-yellow-600 font-medium">Waiting for payment...</span>
              </>
            )}
            {paymentStatus === 'processing' && (
              <>
                <div className="w-3 h-3 bg-blue-400 rounded-full animate-spin border-2 border-white border-t-transparent"></div>
                <span className="text-blue-600 font-medium">Processing payment...</span>
              </>
            )}
            {paymentStatus === 'completed' && (
              <>
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-green-600 font-medium">Payment completed!</span>
              </>
            )}
          </div>

          {/* QR Code or Success Message */}
          {paymentStatus === 'completed' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6"
            >
              <div className="relative">
                <div className="w-64 h-64 mx-auto bg-gradient-to-br from-green-100 to-emerald-100 rounded-3xl flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto">
                      <CheckCircle className="w-12 h-12 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-green-700">Payment Verified!</h3>
                      <p className="text-green-600">Transaction completed successfully</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-green-600">Amount Received:</span>
                  <span className="font-bold text-green-700">${amount}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-green-600">Transaction ID:</span>
                  <span className="font-mono text-green-700">TX{Date.now().toString().slice(-8)}</span>
                </div>
              </div>

              <button
                onClick={resetPayment}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
              >
                Generate New QR Code
              </button>
            </motion.div>
          ) : (
            <>
              {/* QR Code Display */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-3xl blur-xl"></div>
                <div className="relative bg-white p-8 rounded-3xl shadow-2xl border border-gray-100">
                  <div className="text-center space-y-4">
                    <QRCodeSVG
                      value={qrData}
                      size={200}
                      level="H"
                      includeMargin
                      className="mx-auto"
                    />
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Scan to pay</p>
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => navigator.clipboard.writeText(qrData)}
                          className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
                        >
                          <Copy className="w-4 h-4" />
                          <span>Copy</span>
                        </button>
                        {/* Manual payment simulation button for demo */}
                        <button
                          onClick={simulatePaymentScan}
                          className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm ml-4"
                          disabled={paymentStatus !== 'pending'}
                        >
                          <Smartphone className="w-4 h-4" />
                          <span>Simulate Scan</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Processing Overlay */}
              {paymentStatus === 'processing' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-3xl flex items-center justify-center"
                >
                  <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">Processing Payment</h3>
                      <p className="text-gray-600">Please wait while we verify the transaction...</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default QRGenerator;
