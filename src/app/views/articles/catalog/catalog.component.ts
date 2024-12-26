import { Component, EventEmitter, HostListener, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import { ArticlesService } from 'src/app/shared/services/articles.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ActiveParamsUtil } from 'src/app/shared/utils/active-params.util';
import { ActiveParamsType } from 'src/types/active-params.type';
import { CategoriesType } from 'src/types/categories.type';
import {ArticleResponseType} from "../../../../types/article-response.type";
import {AppliedFilterType} from "../../../../types/applied-filter.type";

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  categories: CategoriesType[] = []
  activeCategories: string[] = [];
  articles: ArticleResponseType | null = null;
  sortingOpen: boolean = false;
  activeParams: ActiveParamsType = {categories: []};
  appliedFilters: AppliedFilterType[] = [];

  noProducts: boolean = false;
  pages: number[] = []

  constructor(private categoryService: CategoryService,
              private router: Router,
              private activatedRoute: ActivatedRoute,
              private articlesService: ArticlesService) { }


  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.categoryService.getCategories().subscribe((categories: CategoriesType[]) => {
        this.activeParams = ActiveParamsUtil.processParams(params);
        this.categories = categories;

        this.activeCategories = this.activeParams.categories;

        this.appliedFilters = [];
        this.activeParams.categories.forEach(item => {



          const foundItem = this.categories.find(category => category.url === item);
          if (foundItem) {
            this.appliedFilters.push({
              name: foundItem.name,
              url: foundItem.url
            });
          }
        });

        this.articlesService.getArticles(this.activeParams)
          .subscribe((data: ArticleResponseType) => {
            this.articles = data;
            this.pages = [];
            for (let i = 1; i <= data.pages; i++) {
              this.pages.push(i);
            }
          });
      });
    });
  }

  sortArticles() {
    this.sortingOpen = !this.sortingOpen;
  }

  @HostListener('document:click', ['$event'])
  click(event: Event) {
    if (this.sortingOpen  && !(event.target as HTMLElement).closest('.catalog-sorting')) {
      this.sortingOpen = false
    }
  }

  openPage(page: number): void {
    this.activeParams.page = page;
    this.router.navigate(['/articles'], {queryParams: this.activeParams});
  }

  openPrevPage(): void {
    if (this.activeParams.page && this.activeParams.page > 1) {
      this.activeParams.page--
      this.router.navigate(['/articles'], {queryParams: this.activeParams});
    }
  }

  openNextPage(): void {
    console.log(this.activeParams.page)
    if (this.activeParams.page === undefined || this.activeParams.page < this.pages.length) {
      this.activeParams.page = 1
    }
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++
      this.router.navigate(['/articles'], {queryParams: this.activeParams});
    }
  }

  removeAppliedFilter(url: string) {
    this.activeParams.categories = this.activeParams.categories.filter(category => category !== url);
    this.activeParams.page = 1;
    this.updateRouterParams()
  }
  updateRouterParams(): void {
    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    });
  }

  addNewCategory(url: string) {
    if (this.activeParams.categories.some(category => category === url)) {
      return this.removeAppliedFilter(url);
    }
    this.activeParams.categories.push(url);
    this.activeParams.page = 1;
    this.updateRouterParams()
  }
  addClassActive(url: string) {
    return this.activeCategories.includes(url)
  }


}
