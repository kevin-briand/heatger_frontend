import { HeatgerBackend } from '../../heatger_backend'
import { type HomeAssistant } from 'custom-card-helpers'
import { type Prog } from '../dto/prog'

export async function getProgQuery (hass: HomeAssistant, zoneNumber: number): Promise<Prog[]> {
  const api = await HeatgerBackend.build(hass)
  return await api.get<Prog[]>(`prog/zone${zoneNumber}`).then(r => r.data)
}
