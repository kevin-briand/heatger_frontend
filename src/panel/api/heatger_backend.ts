import axios, { Axios, isAxiosError } from 'axios'
import { type HomeAssistant } from 'custom-card-helpers'
import { Storage } from '../../utils/storage/storage'
import { type DeviceDto } from '../hass/dto/deviceDto'

export class HeatgerBackend extends Axios {
  constructor (baseURL: string) {
    if (typeof baseURL === 'undefined') {
      throw new Error('Cannot be called directly')
    }
    super({
      ...axios.defaults,
      baseURL,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: Storage.get('api_token')
      }
    })
    this.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (isAxiosError(error) && (error.response != null)) {
          if (error.response.status === 401) {
            Storage.remove('api_token')
          }
        }
        return await Promise.reject(error)
      }
    )
  }

  static async build (hass: HomeAssistant): Promise<Axios> {
    const deviceInfo: DeviceDto | undefined =
      await hass.callWS<DeviceDto[]>({ type: 'config/device_registry/list', id: 1 })
        .then(r => r.find((r: DeviceDto) => {
          if (r.name === 'heatger') {
            return r
          }
          return false
        })).catch(() => {
          throw new Error('Ip not found !')
        })
    if (deviceInfo !== undefined && deviceInfo.connections.length !== 0) {
      return new HeatgerBackend(`http://${deviceInfo.connections[0][1]}:5000/`)
    }
    throw new Error('Ip not found !')
  }

  static setToken (token: string): void {
    Storage.set('api_token', token)
  }

  static isConnected (): boolean {
    return Storage.get('api_token') != null
  }
}
