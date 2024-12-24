import {ActiveParamsType} from "../../../types/active-params.type";
import {Params} from "@angular/router";

export class ActiveParamsUtil{
  static processParams(params: Params): ActiveParamsType {
    const activeParams: ActiveParamsType = {categories: []}

    if (params.hasOwnProperty('categories')) {
      if (Array.isArray(params['categories'])) {
        activeParams.categories = [ ...params['categories']];
      } else {
        activeParams.categories = [params['categories']];
      }
    }
    if (params.hasOwnProperty('page')) {
      activeParams.page = +params['page'];
    }

    return activeParams
  }
}
