'use client';

import { useTranslations } from 'next-intl';
import { 
  FaTruck, 
  FaMapMarkerAlt, 
  FaVideo, 
  FaBan,
  FaCheckCircle,
  FaBox,
  FaMoneyBillWave,
  FaClock
} from 'react-icons/fa';

export function DeliveryPage() {
  const t = useTranslations('delivery');

  return (
    <div className="container mx-auto px-4 sm:px-6 py-8 sm:py-16">
      {/* Header */}
      <div className="text-center mb-12 sm:mb-16">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
          {t('title')}
        </h1>
        <p className="text-lg sm:text-xl text-gray-400 animate-fade-in-delay">
          {t('subtitle')}
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12" style={{ gridAutoRows: '1fr' }}>
        {/* HayPost Delivery */}
        <div className="bg-gray-900 rounded-lg p-6 sm:p-8 border border-gray-800 hover:border-white transition-all duration-300 hover:shadow-xl hover:shadow-white/10 animate-slide-in-left flex flex-col">
          <div className="flex items-start gap-4 flex-1">
            <div className="bg-white/10 p-3 rounded-lg animate-bounce-slow flex-shrink-0">
              <FaTruck className="text-2xl sm:text-3xl text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {t('haypost')}
              </h3>
              <p className="text-gray-400 text-sm sm:text-base">
                {t('haypostDescription')}
              </p>
            </div>
          </div>
        </div>

        {/* Price Info */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 sm:p-8 border border-gray-800 hover:border-white transition-all duration-300 hover:shadow-xl hover:shadow-white/10 animate-slide-in-right flex flex-col">
          <div className="flex items-start gap-4 flex-1">
            <div className="bg-white/10 p-3 rounded-lg animate-spin-slow flex-shrink-0">
              <FaMoneyBillWave className="text-2xl sm:text-3xl text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <FaMoneyBillWave className="text-yellow-400 flex-shrink-0" />
                {t('priceTitle')}
              </h3>
              <p className="text-gray-400 text-sm sm:text-base">
                {t('priceText')}
              </p>
            </div>
          </div>
        </div>

        {/* Office Pickup */}
        <div className="bg-gray-900 rounded-lg p-6 sm:p-8 border border-gray-800 hover:border-white transition-all duration-300 hover:shadow-xl hover:shadow-white/10 animate-slide-in-left-delay flex flex-col">
          <div className="flex items-start gap-4 flex-1">
            <div className="bg-white/10 p-3 rounded-lg animate-pulse-slow flex-shrink-0">
              <FaMapMarkerAlt className="text-2xl sm:text-3xl text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                {t('office')}
              </h3>
              <p className="text-gray-400 text-sm sm:text-base mb-3">
                {t('officeDescription')}
              </p>
              <div className="flex items-center gap-2 text-white bg-gray-800 px-4 py-2 rounded-lg">
                <FaMapMarkerAlt className="text-red-500 flex-shrink-0" />
                <span className="text-sm sm:text-base">{t('address')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Video Info */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg p-6 sm:p-8 border border-gray-800 hover:border-white transition-all duration-300 hover:shadow-xl hover:shadow-white/10 animate-slide-in-right-delay flex flex-col">
          <div className="flex items-start gap-4 flex-1">
            <div className="bg-white/10 p-3 rounded-lg animate-pulse flex-shrink-0">
              <FaVideo className="text-2xl sm:text-3xl text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <FaVideo className="text-blue-400 flex-shrink-0" />
                {t('videoTitle')}
              </h3>
              <p className="text-gray-400 text-sm sm:text-base">
                {t('videoText')}
              </p>
            </div>
          </div>
        </div>

        {/* No Returns - Spans 2 columns on desktop */}
        <div className="md:col-span-2 bg-gradient-to-br from-red-900/20 to-gray-900 rounded-lg p-6 sm:p-8 border border-red-500/30 hover:border-red-500 transition-all duration-300 hover:shadow-xl hover:shadow-red-500/10 animate-slide-in-right-delay-2 flex flex-col">
          <div className="flex items-start gap-4 flex-1">
            <div className="bg-red-500/20 p-3 rounded-lg flex-shrink-0">
              <FaBan className="text-2xl sm:text-3xl text-red-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 flex items-center gap-2">
                <FaBan className="text-red-400 flex-shrink-0" />
                {t('noReturns')}
              </h3>
              <p className="text-gray-400 text-sm sm:text-base">
                {t('noReturnsText')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Process Steps */}
      <div className="mt-12 sm:mt-16">
        <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8 sm:mb-12">
          {t('orderProcess')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: FaBox,
              title: t('stepOrder'),
              description: t('stepOrderDesc'),
              delay: '0s',
            },
            {
              icon: FaClock,
              title: t('stepProduction'),
              description: t('stepProductionDesc'),
              delay: '0.2s',
            },
            {
              icon: FaVideo,
              title: t('stepVideo'),
              description: t('stepVideoDesc'),
              delay: '0.4s',
            },
            {
              icon: FaTruck,
              title: t('stepDelivery'),
              description: t('stepDeliveryDesc'),
              delay: '0.6s',
            },
          ].map((step, index) => (
            <div
              key={index}
              className="bg-gray-900 rounded-lg p-6 border border-gray-800 hover:border-white transition-all duration-300 hover:shadow-xl hover:shadow-white/10 text-center group relative flex flex-col h-full"
              style={{ animationDelay: step.delay }}
            >
              <div className="bg-white/10 p-4 rounded-full w-16 h-16 mx-auto mb-4 group-hover:bg-white/20 transition-colors flex items-center justify-center flex-shrink-0">
                <step.icon className="text-2xl text-white group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
              <p className="text-gray-400 text-sm flex-1">{step.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx global>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slide-in-left {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-fade-in-delay {
          animation: fade-in 0.8s ease-out 0.2s both;
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out;
        }

        .animate-slide-in-left-delay {
          animation: slide-in-left 0.6s ease-out 0.2s both;
        }

        .animate-slide-in-right {
          animation: slide-in-right 0.6s ease-out;
        }

        .animate-slide-in-right-delay {
          animation: slide-in-right 0.6s ease-out 0.2s both;
        }

        .animate-slide-in-right-delay-2 {
          animation: slide-in-right 0.6s ease-out 0.4s both;
        }

        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }

        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}

export default DeliveryPage;

