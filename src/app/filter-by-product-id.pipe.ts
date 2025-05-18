import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterByProductId',
  standalone: true
})
export class FilterByProductIdPipe implements PipeTransform {
  transform(animations: { productId: number; state: string }[], productId: number): any[] {
    return animations.filter(anim => anim.productId === productId);
  }
}