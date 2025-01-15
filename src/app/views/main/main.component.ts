import {Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {OwlOptions} from 'ngx-owl-carousel-o';
import { PopupComponent } from 'src/app/shared/components/popup/popup.component';
import {ArticlesService} from 'src/app/shared/services/articles.service';
import { PopupDataType } from 'src/types/popup-data.type';
import {ArticleRelatedType} from "../../../types/article-related.type";
import {PopupEnum} from "../../../types/popup.type";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {
  slides = [
    {
      image: 'assets/images/page/main-car-3.png',
      special: 'Новость дня',
      title: '',
      name: 'SMM',
      titleCon: ' в ТОП-10 SMM-агенств Москвы!',
      description: 'Мы благодарим каждого, кто голосовал за нас!',
      highlight: '6 место',
      highlightColor: '#709FDC',
    },

    {
      image: 'assets/images/page/main-car-1.png',
      special: 'Предложение месяца',
      title: 'Продвижение в Instagram для вашего бизнеса',
      titleCon: '!',
      name: 'SMM',
      description: '',
      highlight: '-15%',
      highlightColor: '#709FDC',
    },
    {
      image: 'assets/images/page/main-car-2.png',
      special: 'Акция',
      title: 'Нужен грамотный',
      name: 'Копирайтинг',
      titleCon: '?',
      description: 'Весь декабрь у нас действует акция на работу копирайтера.',
      highlight: 'копирайтер',
      highlightColor: '#709FDC',
    },

  ];

  customOptions: OwlOptions = {
    loop: true,
    nav: false,
    dots: true,
    startPosition: 1,
    responsive: {
      0: {
        items: 1,
      },
    },
  };

  servicesItems = [
    {
      img: 'assets/images/page/services_1.png',
      title: 'Создание сайтов',
      name:'Фриланс',
      text: 'В краткие сроки мы создадим качественный и самое главное продающий сайт для продвижения Вашего бизнеса!',
      price: 'От 7 500₽'
    },
    {
      img: 'assets/images/page/services_2.png',
      title: 'Продвижение',
      name: 'SMM',
      text: 'Вам нужен качественный SMM-специалист или грамотный таргетолог? Мы готовы оказать Вам услугу “Продвижения” на наивысшем уровне!',
      price: 'От 3 500₽'
    },
    {
      img: 'assets/images/page/services_3.png',
      title: 'Реклама',
      name:'Таргет',
      text: 'Без рекламы не может обойтись ни один бизнес или специалист. Обращаясь к нам, мы гарантируем быстрый прирост клиентов за счёт правильно настроенной рекламы.',
      price: 'От 1 000₽',
    },
    {
      img: 'assets/images/page/services_4.png',
      title: 'Копирайтинг',
      name:'Копирайтинг',
      text: 'Наши копирайтеры готовы написать Вам любые продающие текста, которые не только обеспечат рост охватов, но и помогут выйти на новый уровень в продажах.',
      price: 'От 7 50₽'
    }
  ]

  advantageItems = [
    {
      title: 'Мастерски вовлекаем аудиториюв процесс. ',
      text: 'Мы увеличиваем процент вовлечённости за короткий промежуток времени.'
    },
    {
      title: 'Разрабатываем бомбическую визуальную концепцию.',
      text: 'Наши специалисты знают как создать уникальный образ вашего проекта.'
    },
    {
      title: 'Создаём мощные воронки с помощью текстов. ',
      text: 'Наши копирайтеры создают не только вкусные текста, но и классные воронки.'
    },
    {
      title: 'Помогаем продавать больше.',
      text: 'Мы не только помогаем разработать стратегию по продажам, но также корректируем её под нужды заказчика.'
    },
  ]

  articles: ArticleRelatedType[] = [];
  reviews = [
    {
      name: 'Станислав',
      image: 'review_1.png',
      text: 'Спасибо огромное АйтиШторму за прекрасный блог с полезными статьями! Именно они и побудили меня углубиться в тему SMM и начать свою карьеру.'
    },
    {
      name: 'Алёна',
      image: 'review_2.png',
      text: 'Обратилась в АйтиШторм за помощью копирайтера. Ни разу ещё не пожалела! Ребята действительно вкладывают душу в то, что делают, и каждый текст, который я получаю, с нетерпением хочется выложить в сеть.'
    },
    {
      name: 'Мария',
      image: 'review_3.png',
      text: 'Команда АйтиШторма за такой короткий промежуток времени сделала невозможное: от простой фирмы по услуге продвижения выросла в мощный блог о важности личного бренда. Класс!'
    },
  ]

  customOptionsReviews: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    margin: 26,
    dots: false,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 2
      },
      740: {
        items: 3
      }
    },
    nav: false
  }

  type: PopupEnum = PopupEnum.order
  title: string = 'Заявка на услугу'
  name: string = 'Оставить заявку'


  constructor(private articlesService: ArticlesService,
              private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
    this.articlesService.getArticlesTop().subscribe(data => {
      this.articles = data;
    });
  }

  

  openPopup(type: PopupEnum, title: string, name: string, serviceName: string) {
    const data: PopupDataType = {
      type,
      title,
      name,
      serviceName
    }
    this.dialog.open(PopupComponent, {data})
  }

}

