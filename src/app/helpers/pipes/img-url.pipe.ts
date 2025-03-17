import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imgUrl'
})
export class ImgUrlPipe implements PipeTransform {

  baseApiUrl = 'https://icherniakov.ru/yt-course';

  transform(value: string | null): string | null {
    if (!value)
      return null;

    return `${this.baseApiUrl}/${value}`;
  }

}
