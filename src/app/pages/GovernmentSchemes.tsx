import { Header } from '../components/Header';
import { VoiceAssistant } from '../components/VoiceAssistant';
import { FileText, ExternalLink, Tag, Users, Calendar, MapPin } from 'lucide-react';
import { BackButton } from '../components/BackButton';

export function GovernmentSchemes() {
  const schemes = [
    {
      name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
      category: 'Financial Aid',
      amount: '₹6,000/year',
      description:
        'Direct income support to all landholding farmers families in the country. Amount is paid in three equal installments.',
      eligibility: [
        'All landholding farmers',
        'Small and marginal farmers',
        'Family defined as husband, wife, and minor children',
      ],
      documents: ['Aadhaar Card', 'Land Ownership Papers', 'Bank Account Details'],
      link: 'https://pmkisan.gov.in/',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      name: 'PM Fasal Bima Yojana',
      category: 'Crop Insurance',
      amount: 'Variable Coverage',
      description:
        'Comprehensive insurance coverage for farmers against crop loss due to natural calamities, pests, and diseases.',
      eligibility: [
        'All farmers growing notified crops',
        'Landowners and tenant farmers',
        'Compulsory for loanee farmers',
      ],
      documents: ['Aadhaar Card', 'Bank Account', 'Land Records', 'Sowing Certificate'],
      link: 'https://pmfby.gov.in/',
      color: 'from-green-500 to-emerald-500',
    },
    {
      name: 'Kisan Credit Card (KCC)',
      category: 'Credit Facility',
      amount: 'Up to ₹3 Lakhs',
      description:
        'Provides adequate and timely credit support for agriculture and allied activities. Low interest rates and flexible repayment.',
      eligibility: [
        'Farmers owning cultivable land',
        'Tenant farmers and oral lessees',
        'Self Help Groups engaged in farming',
      ],
      documents: ['Aadhaar Card', 'Land Documents', 'Address Proof', 'Passport Photo'],
      link: 'https://www.nabard.org/content1.aspx?id=523&catid=23&mid=530',
      color: 'from-purple-500 to-pink-500',
    },
    {
      name: 'Soil Health Card Scheme',
      category: 'Soil Management',
      amount: 'Free Service',
      description:
        'Provides soil health cards to farmers containing crop-wise recommendations on nutrients and fertilizers.',
      eligibility: ['All farmers', 'Free for all landholdings', 'State agriculture department support'],
      documents: ['Land Records', 'Contact Details', 'Farm Location'],
      link: 'https://soilhealth.dac.gov.in/',
      color: 'from-orange-500 to-red-500',
    },
    {
      name: 'National Agriculture Market (e-NAM)',
      category: 'Market Access',
      amount: 'Free Registration',
      description:
        'Online trading platform for agricultural commodities. Better price discovery and transparency.',
      eligibility: [
        'All farmers',
        'Traders and commission agents',
        'Need to register on portal',
      ],
      documents: ['Aadhaar Card', 'Bank Account', 'Mobile Number'],
      link: 'https://www.enam.gov.in/web/',
      color: 'from-teal-500 to-green-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <VoiceAssistant />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <BackButton className="mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Government Schemes
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Explore subsidies and benefits available for farmers
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-xl">
            <FileText className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-3xl font-bold mb-1">{schemes.length}</p>
            <p className="text-green-100">Active Schemes</p>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-xl">
            <Tag className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-3xl font-bold mb-1">₹2.5L+</p>
            <p className="text-blue-100">Total Benefits</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
            <CheckCircle className="w-8 h-8 mb-2 opacity-80" />
            <p className="text-3xl font-bold mb-1">98%</p>
            <p className="text-purple-100">Satisfaction Rate</p>
          </div>
        </div>

        {/* Schemes List */}
        <div className="space-y-6">
          {schemes.map((scheme, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${scheme.color} rounded-xl flex items-center justify-center flex-shrink-0`}
                >
                  <FileText className="w-8 h-8 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {scheme.name}
                      </h3>
                      <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                          {scheme.category}
                        </span>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          {scheme.amount}
                        </span>
                      </div>
                    </div>
                    <a
                      href={scheme.link}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 transition-all flex items-center gap-2 whitespace-nowrap"
                    >
                      Apply Now
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mb-4">{scheme.description}</p>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Eligibility */}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Eligibility Criteria
                      </h4>
                      <ul className="space-y-1">
                        {scheme.eligibility.map((item, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                          >
                            <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Documents */}
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                        Required Documents
                      </h4>
                      <ul className="space-y-1">
                        {scheme.documents.map((doc, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300"
                          >
                            <FileText className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Help Section */}
        <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-2xl p-6">
          <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-3">
            Need Help with Applications?
          </h3>
          <p className="text-blue-800 dark:text-blue-400 mb-4">
            Our team can assist you with the application process. Contact your nearest agriculture office or use our Expert Connect feature for guidance.
          </p>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Get Assistance
          </button>
        </div>
      </div>
    </div>
  );
}