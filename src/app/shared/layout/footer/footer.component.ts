import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {ActivatedRoute} from "@angular/router";
import {PopupEnum} from "../../../../types/popup.type";
import { PopupComponent } from '../../components/popup/popup.component';
import { PopupService } from '../../services/popup.service';
import {PopupDataType} from "../../../../types/popup-data.type";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  currentFragment: string = '';
  type: PopupEnum = PopupEnum.consultation;
  title: string = 'Закажите бесплатную консультацию!';
  name: string = 'Заказать консультацию';

  constructor(private activatedRoute: ActivatedRoute,
              private dialog: MatDialog,
              private popupService: PopupService) { }

  ngOnInit(): void {
    this.activatedRoute.fragment.subscribe((fragment) => {
      this.currentFragment = fragment || '';
    });
  }
  openPopup(type: PopupEnum, title: string, name: string) {
    const data: PopupDataType = { type, title, name };
    this.dialog.open(PopupComponent, { data })
  }

}
