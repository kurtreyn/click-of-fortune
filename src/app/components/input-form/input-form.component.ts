import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiService } from '../../services/api/api.service';
import { IPuzzle } from '../../models/puzzleInterface'

@Component({
  selector: 'app-input-form',
  templateUrl: './input-form.component.html',
  styleUrls: ['./input-form.component.css']
})
export class InputFormComponent implements OnInit {
  devEnv: boolean = false;
  letter!: string;
  solvePuzzle!: string;
  newPuzzle: IPuzzle[] = [];
  subscription!: Subscription;

  constructor(private formBuilder: FormBuilder, private apiService: ApiService) { }

  inputForm!: FormGroup;

  ngOnInit() {
    this.createForm();
    this.devEnv = this.apiService.getEnv();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  createForm() {
    this.inputForm = this.formBuilder.group({
      letter: new FormControl('', [Validators.required]),
      solvePuzzle: new FormControl('')
    });
  }

  public resetForm() {
    this.inputForm.reset();
  }

  handleSubmit() {
    this.letter = this.inputForm.value.letter;
    this.solvePuzzle = this.inputForm.value.solvePuzzle;
    console.log('letter', this.letter);
    console.log('solvePuzzle', this.solvePuzzle);


    // this.subscription = this.apiService.addPuzzle(puzzle).subscribe(puzzle => {
    //   this.newPuzzle.push(puzzle);
    // })
    this.inputForm.reset();
  }

}
