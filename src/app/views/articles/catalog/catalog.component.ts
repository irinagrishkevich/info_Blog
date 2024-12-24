import { Component, HostListener, OnInit } from '@angular/core';
import {ActivatedRoute, Router } from '@angular/router';
import { debounceTime } from 'rxjs';
import { ArticlesService } from 'src/app/shared/services/articles.service';
import { CategoryService } from 'src/app/shared/services/category.service';
import { ActiveParamsUtil } from 'src/app/shared/utils/active-params.util';
import { ActiveParamsType } from 'src/types/active-params.type';
import { ArticleType } from 'src/types/article.type';
import { CategoriesType } from 'src/types/categories.type';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.scss']
})
export class CatalogComponent implements OnInit {

  categories: CategoriesType[] = []
  articles: ArticleType[] = []
  sortingOpen: boolean = false;
  activeParams: ActiveParamsType = {page: 1, categories: []};
  appliedFilters: { name: string; url: string}[] = [];
  noProducts: boolean = false;
  pages: number[] = []
  selectedCategories: string[] = [];
  disabledArrow: boolean = false;

  constructor(private categoryService: CategoryService,
              private router: Router,
              private route: ActivatedRoute,
              private articlesService: ArticlesService) { }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe((categories: CategoriesType[]) => {
      this.categories = categories;

    })

    this.getArticles()
  }


  getArticles(): void {
    this.articlesService
      .getArticles(this.activeParams)
      .subscribe((data: { count: number; pages: number; items: ArticleType[] }) => {
        this.articles = data.items;
        this.noProducts = data.items.length === 0;
        this.pages = Array.from({ length: data.pages }, (_, i) => i + 1);

        this.route.params
          .subscribe((params) => {
            this.activeParams = ActiveParamsUtil.processParams(params)
            if(!this.activeParams.page){
              this.activeParams.page = 1;
            }



          });

      });
  }
  removeAppliedFilter(appliedFilter: { name: string; url: string }): void {
    this.activeParams.categories = this.activeParams.categories.filter((item) => item !== appliedFilter.url);
    this.activeParams.page = 1;
    this.updateRouterParams();
  }

  updateAppliedFilters(): void {
    this.appliedFilters = []
    this.activeParams.categories.forEach((url) => {
      for(let i = 0; i < this.categories.length; i++){
        const foundCategories = this.categories[i];
        if(foundCategories.url === url){
          this.appliedFilters.push({name: foundCategories.name, url: foundCategories.url})
        }
      }
    })
  }

  updateRouterParams(): void {
    this.updateAppliedFilters();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { ...this.activeParams },
      queryParamsHandling: 'merge',
    });
    this.getArticles();
  }
  toggleCategory(category: CategoriesType): void {
    if (this.isCategorySelected(category)) {
      this.activeParams.categories = this.activeParams.categories.filter((url) => url !== category.url);
    } else {
      this.activeParams.categories.push(category.url);
    }
    this.updateRouterParams();
  }

  isCategorySelected(category: CategoriesType): boolean {
    return this.activeParams.categories.includes(category.url);
  }





  toggleSorting() {
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
    if (this.activeParams.page && this.activeParams.page < this.pages.length) {
      this.activeParams.page++
      this.router.navigate(['/articles'], {queryParams: this.activeParams});
    }
  }


}
