import { Component } from '@angular/core';
import { SpinnerEnum } from 'src/app/enums/spinner-enum';

@Component({
  selector: 'app-wheel-spinner',
  templateUrl: './wheel-spinner.component.html',
  styleUrls: ['./wheel-spinner.component.css']
})
export class WheelSpinnerComponent {
  public spinActive: boolean = false;
  public spinnerEnum = SpinnerEnum;
  public spinnerValue: number = SpinnerEnum.ONE;
  public score: number = 0;

  constructor() { }



  public spinWheel() {
    this.spinActive = true;
    const spinVal = this.getSpinValue(1, 6);
    switch (spinVal) {
      case 1:
        this.setSpinnerValue(SpinnerEnum.ONE);
        break;
      case 2:
        this.setSpinnerValue(SpinnerEnum.TWO);
        break;
      case 3:
        this.setSpinnerValue(SpinnerEnum.THREE);
        break;
      case 4:
        this.setSpinnerValue(SpinnerEnum.FOUR);
        break;
      case 5:
        this.setSpinnerValue(SpinnerEnum.FIVE);
        break;
      case 6:
        this.setSpinnerValue(SpinnerEnum.BANKRUPT);
        break;
      default:
        this.setSpinnerValue(SpinnerEnum.ONE);
        break;
    }



    setTimeout(() => {
      this.spinActive = false;
      this.setScore();
      console.log('this.spinnerValue: ', this.spinnerValue);
      console.log('this.score: ', this.score);
    }, 3000);
  }

  public getSpinValue(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public setSpinnerValue(value: number) {
    this.spinnerValue = value;
  }

  public setScore() {
    if (this.spinnerValue !== SpinnerEnum.BANKRUPT) {
      this.score += this.spinnerValue;
    } else {
      this.score = 0;
    }
  }

}
