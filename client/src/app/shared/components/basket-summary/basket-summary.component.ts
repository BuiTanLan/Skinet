import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IBasketItem } from '../../models/basket';
import { IOrderItem } from '../../models/order';

@Component({
  selector: 'app-basket-summary',
  templateUrl: './basket-summary.component.html',
  styleUrls: ['./basket-summary.component.scss']
})
export class BasketSummaryComponent implements OnInit {

  @Input() isBasket = true;
  @Input() isOrder = false;
  @Input() items: any;
  @Output() decrement: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Output() increment: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Output() remove: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  constructor() { }

  ngOnInit(): void {
  }
  removeBasketItem(item: IBasketItem) {
    this.remove.emit(item);
  }
  decrementItemQuantity(item: IBasketItem) {
    this.decrement.emit(item);
  }
  incrementItemQuantity(item: IBasketItem) {
    this.increment.emit(item);
  }

}
