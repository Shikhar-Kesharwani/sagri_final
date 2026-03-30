import { useState } from 'react';
import { Header } from '../components/Header';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { BackButton } from '../components/BackButton';
import { Landmark, DollarSign, TrendingDown, Clock, CheckCircle, AlertCircle, Info, Calendar, FileText, Shield, Phone } from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { loanApplicationsApi } from '../../utils/api';
import { useAuth } from '../components/AuthProvider';

const LOAN_SCHEMES = [
  {
    id: 1,
    name: 'Kisan Credit Card (KCC)',
    bank: 'All Scheduled Banks',
    type: 'Short-term',
    amount: '₹3 Lakhs',
    interest: '4-7%',
    tenure: 'Up to 5 years',
    subsidy: '3% interest subvention',
    eligibility: 'All farmers with land ownership',
    documents: ['Land records', 'Aadhaar', 'Bank statements'],
    benefits: [
      'Lowest interest rates',
      'Flexible repayment',
      'Insurance coverage',
      'Easy renewal',
    ],
    popular: true,
  },
  {
    id: 2,
    name: 'PM-KISAN Credit',
    bank: 'Government Banks',
    type: 'Medium-term',
    amount: '₹1.6 Lakhs',
    interest: '4%',
    tenure: 'Up to 3 years',
    subsidy: 'Direct benefit transfer',
    eligibility: 'PM-KISAN beneficiaries',
    documents: ['PM-KISAN registration', 'Aadhaar', 'Land proof'],
    benefits: [
      'No collateral needed',
      'Instant approval',
      'Digital process',
      '₹6000/year benefit',
    ],
    popular: true,
  },
  {
    id: 3,
    name: 'Agriculture Term Loan',
    bank: 'Commercial Banks',
    type: 'Long-term',
    amount: 'Up to ₹10 Lakhs',
    interest: '8-10%',
    tenure: '7-10 years',
    subsidy: 'Varies by state',
    eligibility: 'For farm equipment & infrastructure',
    documents: ['Project report', 'Land documents', 'Income proof', 'Credit history'],
    benefits: [
      'Large loan amounts',
      'Asset creation',
      'Tax benefits',
      'Extended tenure',
    ],
    popular: false,
  },
  {
    id: 4,
    name: 'Dairy Farming Loan',
    bank: 'NABARD & Partner Banks',
    type: 'Specialized',
    amount: '₹2-5 Lakhs',
    interest: '6-8%',
    tenure: '5-7 years',
    subsidy: 'Up to 33% capital subsidy',
    eligibility: 'Dairy farmers with minimum 2 animals',
    documents: ['Dairy project report', 'Animal purchase proof', 'Land lease'],
    benefits: [
      'High subsidy',
      'Technical support',
      'Marketing assistance',
      'Insurance options',
    ],
    popular: false,
  },
];

export function CheckLoans() {
  const [selectedLoan, setSelectedLoan] = useState<number | null>(null);
  const [showEligibility, setShowEligibility] = useState(false);

  // Mock farmer data
  const farmerData = {
    landArea: '5 acres',
    pmKisanBeneficiary: true,
    hasKCC: false,
    creditScore: 720,
    annualIncome: '₹4,50,000',
  };

  const handleApply = (loanId: number) => {
    toast.success('Application initiated! Redirecting to bank portal...');
    // In real app, this would redirect to bank application
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <VoiceAssistant />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <BackButton className="mb-4" />
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center">
              <Landmark className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Agricultural Loans
            </h1>
          </div>
          <p className="text-gray-600 dark:text-gray-400">
            Compare and apply for subsidized farming loans from government schemes
          </p>
        </div>

        {/* Farmer Eligibility Summary */}
        <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl p-6 text-white mb-8">
          <h2 className="text-xl font-bold mb-4">Your Eligibility Summary</h2>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-blue-100 text-sm mb-1">Land Holding</p>
              <p className="text-2xl font-bold">{farmerData.landArea}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Credit Score</p>
              <p className="text-2xl font-bold">{farmerData.creditScore}</p>
              <p className="text-xs text-blue-200">Excellent</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">PM-KISAN</p>
              <p className="text-2xl font-bold">
                {farmerData.pmKisanBeneficiary ? '✓' : '✗'}
              </p>
              <p className="text-xs text-blue-200">
                {farmerData.pmKisanBeneficiary ? 'Enrolled' : 'Not enrolled'}
              </p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Annual Income</p>
              <p className="text-2xl font-bold">{farmerData.annualIncome}</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <TrendingDown className="w-8 h-8 text-green-600 mb-2" />
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">4%</p>
            <p className="text-gray-600 dark:text-gray-400">Lowest Interest Rate</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <DollarSign className="w-8 h-8 text-blue-600 mb-2" />
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">₹10L</p>
            <p className="text-gray-600 dark:text-gray-400">Maximum Loan Amount</p>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
            <Clock className="w-8 h-8 text-purple-600 mb-2" />
            <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">24-48h</p>
            <p className="text-gray-600 dark:text-gray-400">Approval Time</p>
          </div>
        </div>

        {/* Loan Schemes */}
        <div className="space-y-6">
          {LOAN_SCHEMES.map((loan) => (
            <motion.div
              key={loan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {loan.name}
                      </h3>
                      {loan.popular && (
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs rounded-full font-semibold">
                          🔥 Popular
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 mb-1">{loan.bank}</p>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full">
                        {loan.type}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {loan.eligibility}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Key Details Grid */}
                <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-xl">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Loan Amount</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {loan.amount}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Interest Rate</p>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {loan.interest}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Tenure</p>
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {loan.tenure}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Subsidy</p>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {loan.subsidy}
                    </p>
                  </div>
                </div>

                {/* Benefits */}
                <div className="mb-6">
                  <p className="font-semibold text-gray-900 dark:text-white mb-3">Key Benefits:</p>
                  <div className="grid sm:grid-cols-2 gap-2">
                    {loan.benefits.map((benefit, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">
                          {benefit}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents Required */}
                <div className="mb-6">
                  <p className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    Documents Required:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {loan.documents.map((doc, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg"
                      >
                        {doc}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleApply(loan.id)}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-700 transition-all shadow-lg"
                  >
                    Apply Now
                  </button>
                  <button
                    onClick={() => setSelectedLoan(selectedLoan === loan.id ? null : loan.id)}
                    className="px-6 py-3 border-2 border-blue-600 text-blue-600 dark:text-blue-400 rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                  >
                    {selectedLoan === loan.id ? 'Hide Details' : 'More Info'}
                  </button>
                  <button className="px-6 py-3 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    Contact
                  </button>
                </div>

                {/* Expanded Details */}
                {selectedLoan === loan.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700"
                  >
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                          Eligibility Criteria
                        </h4>
                        <p className="text-gray-700 dark:text-gray-300">{loan.eligibility}</p>
                      </div>
                      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <div className="flex gap-3">
                          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-semibold text-yellow-900 dark:text-yellow-300 mb-1">
                              Important Note
                            </p>
                            <p className="text-sm text-yellow-800 dark:text-yellow-400">
                              Loan approval is subject to bank verification and credit assessment. 
                              Interest rates may vary based on your credit score and repayment history.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Need Help Applying?</h3>
          <p className="text-green-100 mb-6">
            Our agricultural loan experts can guide you through the application process and help
            you choose the right loan for your needs.
          </p>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-white text-green-600 rounded-xl font-semibold hover:bg-green-50 transition-colors">
              📞 Call Expert: 1800-XXX-XXXX
            </button>
            <button className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-colors border-2 border-white">
              💬 Chat with Advisor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}