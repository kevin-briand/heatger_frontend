import { HeatgerBackend } from '../../heatger_backend'
import { type HomeAssistant } from 'custom-card-helpers'
import { type Prog } from '../dto/prog'

export async function createProgQuery (hass: HomeAssistant, zoneNumber: number, prog: Prog[]): Promise<Prog[]> {
  const api = await HeatgerBackend.build(hass)
  return await api.post<Prog[]>(`prog/zone${zoneNumber}`, prog).then(r => r.data)
}
