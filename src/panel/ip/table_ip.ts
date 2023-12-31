import { type CSSResultGroup, html, LitElement, type TemplateResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { type IpDto } from '../api/ip/dto/ip_dto'
import { localize } from '../../localize/localize'
import { type HomeAssistant } from 'custom-card-helpers'
import { style } from '../../style'

@customElement('heatger-ip-table')
export class HeatgerIpTable extends LitElement {
  @property() public hass!: HomeAssistant
  @property() public disabled: boolean = false
  @property() public rowClicked!: (prog: IpDto) => void
  @property({ type: Array }) public datas!: IpDto[]

  addRow (data: IpDto): TemplateResult<1> {
    return html`
            <tr>
                <td>${data.name}</td>
                <td>${data.ip}</td>
                <td><mwc-button @click='${(event: MouseEvent) => { this.handleDelete(event, data) }}' class="button" id="delete" .disabled="${this.disabled}">
                    ${localize('panel.delete', this.hass.language)}
                </mwc-button></td>
            </tr>
        `
  }

  handleDelete (event: MouseEvent, data: IpDto): void {
    const button = event.target as HTMLElement
    button.blur()
    this.rowClicked(data)
  }

  render (): TemplateResult<1> {
    if (this.datas === undefined) return html``
    return html`
            <div>
                <table>
                    <thead>
                    <tr>
                        <td>${localize('panel.ip.name', this.hass.language)}</td>
                        <td>${localize('panel.ip.ip', this.hass.language)}</td>
                        <td></td>
                    </tr>
                    </thead>
                    <tbody>
                    ${this.datas.map((value) => {
                        return this.addRow(value)
                    })}
                    </tbody>
                </table>
            </div>
        `
  }

  static get styles (): CSSResultGroup {
    return style
  }
}
