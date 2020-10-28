import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HomeService } from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],

})
export class HomeComponent implements OnInit {
  rate = 1.1;
  choosenRate = this.rate;
  rateForm: FormGroup;
  currencies = ['EUR', 'USD'];
  result: string;

  constructor(private fb: FormBuilder, public homeService: HomeService) { }

  ngOnInit(): void {
    this.changeRate();
    this.rateForm = this.fb.group({
      forcedRate: [],
      amount: ['', [Validators.required, Validators.pattern('^-?[0-9]\\d*(\\.\\d*)?$')]]
    });
  }

  changeRate() {
    setInterval(() => {
      this.rate += +this.getRandomVariation();
      this.choosenRate = this.rate;
      const forcedRate = this.rateForm.get('forcedRate');
      if (forcedRate.value) { this.checkNewRate(forcedRate); }
    }, 3000);
  }

  getRandomVariation() {
    let num = Math.random() * 0.05;
    num *= Math.round(Math.random()) ? 1 : -1;
    return num;
  }

  checkNewRate(forcedRate: AbstractControl) {
    if (this.computeVariation(forcedRate) <= 2) {
        this.choosenRate = forcedRate.value;
      }
    else {
      forcedRate.disable();
      this.choosenRate = this.rate;
    }
  }

  swap() {
    this.rate = 1 / this.rate;
    this.choosenRate = this.rate;
    if (this.result) {
      this.amount.patchValue(+this.result);
    }
    const tmp = this.currencies[0];
    this.currencies[0] = this.currencies[1];
    this.currencies[1] = tmp;
  }

  computeVariation(forcedRate) {
   return Math.abs(((forcedRate - this.rate) / this.rate) * 100);
  }


  onSubmit() {
    if (this.rateForm.valid) {
      this.result = (this.amount.value * this.choosenRate).toFixed(2);
      const tmp = {
        amount : this.amount.value,
        fromCurrency : this.currencies[0],
        toCurrency: this.currencies[1],
        realRate : this.rate.toFixed(2),
        forcedRate: this.rateForm.get('forcedRate').enabled ? this.rateForm.get('forcedRate').value : '',
        calculatedAmount: this.result
      };
      this.homeService.addData(tmp);
    } else {
      alert('please verify if the amount is correct');
    }
  }
  get amount() {
    return this.rateForm.get('amount');
  }
}
