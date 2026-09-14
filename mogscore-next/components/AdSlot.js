import AdSlotClient from './AdSlotClient'
import { getAdsterraConfig } from '@/lib/ad-config'

export default function AdSlot({ pageType, slotName }) {
  const config = getAdsterraConfig()
  if (!config.allowedTypes.includes(pageType)) return null
  return <AdSlotClient config={{ ...config, pageType }} slotName={slotName} />
}
