import {PopupEnum} from "./popup.type";

export type PopupDataType = {
  type: PopupEnum,
  title: string,
  name: string,
  serviceName?: string
}
