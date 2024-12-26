
export class CategoriesNameUtil {
  static getCategoriesName(name: string | undefined): { categoriesName: string } {

    let categoriesName = '';

    switch (name) {
      case 'SMM':
        categoriesName = 'Продвижение';
        break;
      case 'Таргет':
        categoriesName = 'Реклама';
        break;
      case 'Копирайтинг':
        categoriesName = 'Копирайтинг';
        break;
      case 'Фриланс':
        categoriesName = 'Создание сайтов';
        break;
      case 'Дизайн':
        categoriesName = 'Дизайн';
        break;
    }

    return { categoriesName };

  }
}
