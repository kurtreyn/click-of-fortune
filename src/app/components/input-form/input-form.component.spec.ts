import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputFormComponent } from './input-form.component';

describe('InputFormComponent', () => {
  let component: InputFormComponent;
  let fixture: ComponentFixture<InputFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InputFormComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InputFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle form submission when the wheel has not been spun', () => {
    spyOn(window, 'alert');
    component.hasSpun = false;
    component.inputForm.reset();
    component.handleSubmit();
    expect(window.alert).toHaveBeenCalledWith('Spin the wheel before guessing!');
    expect(component.inputForm.value).toEqual({ letter: null });
  });

  it('should handle form submission when the letter has already been guessed', () => {
    spyOn(window, 'alert');
    component.hasSpun = true;
    component.inputForm.setValue({ letter: 'a' });
    component.guessedLetters = ['a'];
    component.inputForm.reset();
    component.handleSubmit();
    expect(window.alert).toHaveBeenCalledWith(`You've already guessed A`);
    expect(component.inputForm.value).toEqual({ letter: null });
  });

  it('should handle form submission when the letter is a correct guess', () => {
    component.hasSpun = true;
    component.inputForm.setValue({ letter: 'a' });
    component.gameDetails = {
      maxGuess: 5,
      maskedPuzzleArr: ['_', '_', '_', '_', '_'],
      indexRefArr: ['a', 'b', 'c', 'd', 'e'],
      answerArr: ['a', 'b', 'c', 'd', 'e']
    };
    component.correctGuesses = [];
    component.guessedLetters = [];
    component.incorrectGuesses = [];
    component.guessCount = 0;
    component.remainingGuess = 5;
    component.handleSubmit();
    expect(component.correctGuesses).toEqual(['a']);
    expect(component.guessedLetters).toEqual(['a']);
    expect(component.remainingGuess).toEqual(5);
    expect(component.gameDetails.maskedPuzzleArr).toEqual(['a', '_', '_', '_', '_']);
  });

  it('should handle form submission when the letter is an incorrect guess', () => {
    component.hasSpun = true;
    component.inputForm.setValue({ letter: 'x' });
    component.gameDetails = {
      maxGuess: 5,
      maskedPuzzleArr: ['_', '_', '_', '_', '_'],
      indexRefArr: ['a', 'b', 'c', 'd', 'e'],
      answerArr: ['a', 'b', 'c', 'd', 'e']
    };
    component.correctGuesses = [];
    component.guessedLetters = [];
    component.incorrectGuesses = [];
    component.guessCount = 0;
    component.remainingGuess = 5;
    component.handleSubmit();
    expect(component.incorrectGuesses).toEqual(['x']);
    expect(component.guessedLetters).toEqual(['x']);
    expect(component.guessCount).toEqual(1);
    expect(component.remainingGuess).toEqual(4);
  });

  it('should reset the form and check game status after form submission', () => {
    spyOn(component, 'checkGameStatus');
    component.hasSpun = true;
    component.inputForm.setValue({ letter: 'a' });
    component.gameDetails = {
      maxGuess: 5,
      maskedPuzzleArr: ['_', '_', '_', '_', '_'],
      indexRefArr: ['a', 'b', 'c', 'd', 'e'],
      answerArr: ['a', 'b', 'c', 'd', 'e']
    };
    component.correctGuesses = [];
    component.guessedLetters = [];
    component.incorrectGuesses = [];
    component.guessCount = 0;
    component.remainingGuess = 5;
    component.handleSubmit();
    expect(component.inputForm.value).toEqual({ letter: null });
    expect(component.checkGameStatus).toHaveBeenCalled();
  });
});