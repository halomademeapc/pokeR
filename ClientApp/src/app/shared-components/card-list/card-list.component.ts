import { Component, Input, SimpleChanges, Output, EventEmitter, OnChanges, OnInit } from '@angular/core';
import { Card } from 'src/app/models/entities/card';
import { PokerService } from 'src/app/services/poker.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-card-list',
  templateUrl: './card-list.component.html',
  styleUrls: ['./card-list.component.scss']
})
export class CardListComponent implements OnChanges, OnInit {
  @Input() cards: Array<Card>;
  @Output() cardSelected: EventEmitter<number> = new EventEmitter<number>();
  isEnabled = true;
  selectedCardId: number = null;

  constructor(private service: PokerService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.isEnabled && changes.isEnabled.currentValue !== changes.isEnabled.previousValue) {
      this.selectedCardId = null;
    }
  }

  ngOnInit(): void {
    this.watchRoundEnd().subscribe();
    this.watchRoundStart().subscribe();
  }

  onCardSelected = (cardId: number): void => {
    this.service.playCard(cardId).subscribe();
    this.selectedCardId = cardId;
  }

  watchRoundEnd = (): Observable<boolean> =>
    this.service.roundEnds.pipe(map(() => this.isEnabled = false))

  watchRoundStart = (): Observable<boolean> =>
    this.service.roundStarts.pipe(map(() => this.isEnabled = true))
}
