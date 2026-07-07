import { createI18nSlugPage } from '@/lib/i18n-slug-page'

const page = createI18nSlugPage('ja')
export const generateStaticParams = page.generateStaticParams
export const generateMetadata = page.generateMetadata
export default page.default
