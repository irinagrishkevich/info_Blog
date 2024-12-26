import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textTransform'
})
export class TextTransformPipe implements PipeTransform {

  transform(value: string, limit:number = 100): string {
    if (!value){
      return ''
    }

    return value.length > limit? value.substring(0, limit) + '...' : value;
  }

}
