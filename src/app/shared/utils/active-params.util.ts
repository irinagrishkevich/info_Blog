import {ActiveParamsType} from "../../../types/active-params.type";
import {Params} from "@angular/router";

export class ActiveParamsUtil{
  static processParams(params: Params): ActiveParamsType {
    const activeParams: ActiveParamsType = {categories: []}

    if (params.hasOwnProperty('categories[]')) {
      const categories = params['categories[]'];

      // Если categories — массив, используем его напрямую
      if (Array.isArray(categories)) {
        activeParams.categories = categories;
      } else {
        // Если categories — строка, превращаем в массив
        activeParams.categories = [categories];
      }
    }

    // Обработка параметра 'page'
    if (params.hasOwnProperty('page')) {
      activeParams.page = +params['page'];
    }

    // if(params.hasOwnProperty('categories')){
    //   activeParams.categories = params['categories'].split(',');
    //   // activeParams.categories = Array.isArray(params['categories']) ? params['categories'] : [params['categories']]
    // }
    // if(params.hasOwnProperty('page')){
    //   activeParams.page = +params['page']
    // }

    return activeParams
  }
}
