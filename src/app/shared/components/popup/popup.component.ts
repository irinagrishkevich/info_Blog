import {Component, Inject, OnInit} from '@angular/core';
import {PopupService} from "../../services/popup.service";
import {CategoryService} from "../../services/category.service";
import {FormBuilder, Validators} from "@angular/forms";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CategoriesType} from "../../../../types/categories.type";
import {PopupDataType} from "../../../../types/popup-data.type";
import {CategoriesNameUtil} from '../../utils/categories-name.util';
import {PopupEnum} from "../../../../types/popup.type";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'popup',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  popupForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^(?:[А-ЯЁ][а-яё]+(?: [А-ЯЁ][а-яё]+)*)?$/)]],
    phone: ['', [Validators.required]],
    service: [''],
  });
  popupType: PopupEnum = PopupEnum.order;

  title: string = '';
  type: string = '';
  nameBtn: string = '';
  serviceName: string = '';


  error: boolean = false;
  isSuccess: boolean = false;


  categories: CategoriesType[] = [];


  constructor(
    @Inject(MAT_DIALOG_DATA) private data: PopupDataType,
    private fb: FormBuilder,
    private popupService: PopupService,
    private categoriesService: CategoryService,
    private dialogRef: MatDialogRef<PopupComponent>,
    private _snackBar: MatSnackBar) {

  }

  ngOnInit(): void {
    this.title = this.data.title;
    this.nameBtn = this.data.name;
    this.popupType = this.data.type;
    console.log(this.title);
    if (this.data.serviceName) {
      this.serviceName = this.data.serviceName;
    }
    this.categoriesService.getCategories()
      .subscribe((data: CategoriesType[]) => {
        this.categories = (data as CategoriesType[]).map(item => {
          const result = CategoriesNameUtil.getCategoriesName(item.name);
          item.categoriesName = result.categoriesName;
          return item;
        });
        if (this.popupType === PopupEnum.order) {
          this.popupForm.get('service')?.setValue(this.serviceName, {onlySelf: true});
        }
      });
  }
  requestFormSubmit() {
    if (this.popupForm.valid && this.popupForm.value.name && this.popupForm.value.phone && this.popupType) {
      let dataInfo: { name: string, phone: string, type: PopupEnum, service?: string } = {
        name: this.popupForm.value.name,
        phone: this.popupForm.value.phone,
        type: this.popupType
      }
      if (this.popupType === PopupEnum.order && this.popupForm.value.service) {
        dataInfo = {...dataInfo, service: this.popupForm.value.service}
      }
      this.popupService.setRequest(dataInfo)
        .subscribe((data: DefaultResponseType) => {
          if ((data as DefaultResponseType).error) {
            this._snackBar.open((data as DefaultResponseType).message);
            this.error = true;
            throw new Error((data as DefaultResponseType).message);
          }
          this.isSuccessTrue();
        });
    }
  }
  isSuccessTrue() {
    this.isSuccess = true;
  }
  close() {
    this.dialogRef.close();
  }
}
