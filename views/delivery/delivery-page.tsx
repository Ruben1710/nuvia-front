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
    <div className="container mx-auto px-3 min-[375px]:px-4 sm:px-6 lg:px-8 xl:px-12 pt-16 min-[375px]:pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-6 min-[375px]:pb-8 sm:pb-12 md:pb-16 lg:pb-20">
      {/* Header */}
      <div className="text-center mb-8 min-[375px]:mb-10 sm:mb-12 md:mb-16 lg:mb-20">
        <h1 className="text-2xl min-[375px]:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-3 min-[375px]:mb-4 lg:mb-6 animate-fade-in px-2">
          {t('title')}
        </h1>
        <p className="text-base min-[375px]:text-lg sm:text-xl lg:text-2xl text-gray-400 animate-fade-in-delay px-2 max-w-3xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 min-[375px]:gap-6 sm:gap-8 lg:gap-10 xl:gap-12 mb-10 sm:mb-12 lg:mb-16" style={{ gridAutoRows: '1fr' }}>
        {/* HayPost Delivery */}
        <div className="bg-gray-900 rounded-lg p-4 min-[375px]:p-5 sm:p-6 md:p-8 lg:p-10 border border-gray-800 hover:border-white transition-all duration-300 hover:shadow-xl hover:shadow-white/10 animate-slide-in-left flex flex-col">
          <div className="flex items-start gap-3 min-[375px]:gap-4 lg:gap-5 flex-1">
            <div className="bg-white/10 p-2.5 min-[375px]:p-3 lg:p-4 rounded-lg animate-bounce-slow flex-shrink-0">
              <FaTruck className="text-xl min-[375px]:text-2xl sm:text-3xl lg:text-4xl text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg min-[375px]:text-xl sm:text-2xl lg:text-3xl font-bold text-white mb-2 lg:mb-3">
                {t('haypost')}
              </h3>
              <p className="text-gray-400 text-xs min-[375px]:text-sm sm:text-base lg:text-lg">
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
      <div className="mt-10 sm:mt-12 lg:mt-16">
        <h2 className="text-xl min-[375px]:text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-white text-center mb-6 sm:mb-8 lg:mb-12 px-2">
          {t('orderProcess')}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 min-[375px]:gap-5 sm:gap-6 lg:gap-8">
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
              className="bg-gray-900 rounded-lg p-4 min-[375px]:p-5 sm:p-6 lg:p-8 border border-gray-800 hover:border-white transition-all duration-300 hover:shadow-xl hover:shadow-white/10 text-center group relative flex flex-col h-full"
              style={{ animationDelay: step.delay }}
            >
              <div className="bg-white/10 p-3 min-[375px]:p-4 lg:p-5 rounded-full w-14 h-14 min-[375px]:w-16 min-[375px]:h-16 lg:w-20 lg:h-20 mx-auto mb-3 min-[375px]:mb-4 lg:mb-6 group-hover:bg-white/20 transition-colors flex items-center justify-center flex-shrink-0">
                <step.icon className="text-xl min-[375px]:text-2xl lg:text-3xl text-white group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-base min-[375px]:text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 lg:mb-3">{step.title}</h3>
              <p className="text-gray-400 text-xs min-[375px]:text-sm sm:text-base lg:text-lg flex-1">{step.description}</p>
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

