import React from 'react'
import { useI18n } from '../hooks/useI18n'

const Footer = () => {
  const { t } = useI18n()

  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* 프로그램 소개 */}
          <div className="lg:col-span-2">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              TradingDiaryPro
            </h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              {t('footer.description')}
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>📧</span>
              <a 
                href="mailto:tradingdiarypro521@gmail.com" 
                className="hover:text-blue-600 transition-colors"
              >
                tradingdiarypro521@gmail.com
              </a>
            </div>
          </div>

          {/* 주요 기능 */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4">
              {t('footer.features')}
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• {t('footer.tradingJournal')}</li>
              <li>• {t('footer.cryptoAlerts')}</li>
              <li>• {t('footer.realTimePrice')}</li>
              <li>• {t('footer.csvExport')}</li>
              <li>• {t('footer.multiLanguage')}</li>
            </ul>
          </div>

          {/* 사용 방법 */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4">
              {t('footer.howToUse')}
            </h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>1. {t('footer.step1')}</li>
              <li>2. {t('footer.step2')}</li>
              <li>3. {t('footer.step3')}</li>
              <li>4. {t('footer.step4')}</li>
            </ul>
          </div>
        </div>

        {/* SEO/GEO 정보 */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">
                {t('footer.aboutService')}
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t('footer.seoDescription')}
              </p>
            </div>
            <div>
              <h4 className="text-md font-semibold text-gray-900 mb-3">
                {t('footer.keywords')}
              </h4>
              <p className="text-sm text-gray-600 leading-relaxed">
                {t('footer.keywordsList')}
              </p>
            </div>
          </div>
        </div>

        {/* 저작권 */}
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            © 2025 TradingDiaryPro. {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer

