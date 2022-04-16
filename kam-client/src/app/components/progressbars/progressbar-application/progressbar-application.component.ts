import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progressbar-application',
  templateUrl: './progressbar-application.component.html',
  styles: [
  ]
})
export class ProgressbarApplicationComponent implements OnInit {
  bgCompleteColor = 'bg-emerald-400';
  bgNotCompleteColor = 'bg-slate-200';

  textCompleteColor = 'text-emerald-500';
  textNotStartedColor = 'text-slate-300';
  textInProgressColor = 'text-sky-400';
  textIncompleteColor = 'text-red-500';

  successIcon = 'fas fa-circle-check';

  steps = [
    { stepIcon: 'far fa-1', stepColor: this.textNotStartedColor, progressColor: this.bgNotCompleteColor },
    { stepIcon: 'far fa-2', stepColor: this.textNotStartedColor, progressColor: this.bgNotCompleteColor },
    { stepIcon: 'far fa-3', stepColor: this.textNotStartedColor, progressColor: this.bgNotCompleteColor },
    { stepIcon: 'far fa-4', stepColor: this.textNotStartedColor, progressColor: this.bgNotCompleteColor },
    { stepIcon: 'far fa-5', stepColor: this.textNotStartedColor, progressColor: this.bgNotCompleteColor },
    { stepIcon: 'far fa-6', stepColor: this.textNotStartedColor, progressColor: this.bgNotCompleteColor }
  ]

  // Step progress states: NS - not started, IP - in progress, IC - incomplete, C - complete

  // Step Names
  @Input()
  get stepOneName(): string {
    return this._stepOneName;
  }
  set stepOneName(stepOne: string) {
    this._stepOneName = stepOne === null ? '' : stepOne;
  }
  private _stepOneName = '';

  @Input()
  get stepTwoName(): string {
    return this._stepTwoName;
  }
  set stepTwoName(stepTwo: string) {
    this._stepTwoName = stepTwo === null ? '' : stepTwo;
  }
  private _stepTwoName = '';

  @Input()
  get stepThreeName(): string {
    return this._stepThreeName;
  }
  set stepThreeName(stepThree: string) {
    this._stepThreeName = stepThree === null ? '' : stepThree;
  }
  private _stepThreeName = '';

  @Input()
  get stepFourName(): string {
    return this._stepFourName;
  }
  set stepFourName(stepFour: string) {
    this._stepFourName = stepFour === null ? '' : stepFour;
  }
  private _stepFourName = '';

  @Input()
  get stepFiveName(): string {
    return this._stepFiveName;
  }
  set stepFiveName(stepFive: string) {
    this._stepFiveName = stepFive === null ? '' : stepFive;
  }
  private _stepFiveName = '';

  @Input()
  get stepSixName(): string {
    return this._stepSixName;
  }
  set stepSixName(stepSix: string) {
    this._stepSixName = stepSix === null ? '' : stepSix;
  }
  private _stepSixName = '';

  // Step One
  @Input()
  get stepOne(): string {
    return this._stepOne;
  }
  set stepOne(stepOne: string) {
    this._stepOne = stepOne === undefined ? 'NS' : stepOne;
    if (this._stepOne === 'NS') {
      this.steps[0].stepIcon = 'far fa-1';
      this.steps[0].stepColor = this.textNotStartedColor;
      this.steps[0].progressColor = this.bgNotCompleteColor;
    } else if (this._stepOne === 'IP') {
      this.steps[0].stepIcon = 'far fa-1';
      this.steps[0].stepColor = this.textInProgressColor;
      this.steps[0].progressColor = this.bgNotCompleteColor;
    } else if (this._stepOne === 'IC') {
      this.steps[0].stepIcon = 'far fa-1';
      this.steps[0].stepColor = this.textIncompleteColor;
      this.steps[0].progressColor = this.bgNotCompleteColor;
    } else if (this._stepOne === 'C') {
      this.steps[0].stepIcon = this.successIcon;
      this.steps[0].stepColor = this.textCompleteColor;
      this.steps[0].progressColor = this.bgCompleteColor;
    }
  }
  private _stepOne = 'NS';

  // Step Two
  @Input()
  get stepTwo(): string {
    return this._stepTwo;
  }
  set stepTwo(stepTwo: string) {
    this._stepTwo = stepTwo === undefined ? 'NS' : stepTwo;
    if (this._stepTwo === 'NS') {
      this.steps[1].stepIcon = 'far fa-2';
      this.steps[1].stepColor = this.textNotStartedColor;
      this.steps[1].progressColor = this.bgNotCompleteColor;
    } else if (this._stepTwo === 'IP') {
      this.steps[1].stepIcon = 'far fa-2';
      this.steps[1].stepColor = this.textInProgressColor;
      this.steps[1].progressColor = this.bgNotCompleteColor;
    } else if (this._stepTwo === 'IC') {
      this.steps[1].stepIcon = 'far fa-2';
      this.steps[1].stepColor = this.textIncompleteColor;
      this.steps[1].progressColor = this.bgNotCompleteColor;
    } else if (this._stepTwo === 'C') {
      this.steps[1].stepIcon = this.successIcon;
      this.steps[1].stepColor = this.textCompleteColor;
      this.steps[1].progressColor = this.bgCompleteColor;
    }
  }
  private _stepTwo = 'NS';

  // Step Three
  @Input()
  get stepThree(): string {
    return this._stepThree;
  }
  set stepThree(stepThree: string) {
    this._stepThree = stepThree === undefined ? 'NS' : stepThree;
    if (this._stepThree === 'NS') {
      this.steps[2].stepIcon = 'far fa-3';
      this.steps[2].stepColor = this.textNotStartedColor;
      this.steps[2].progressColor = this.bgNotCompleteColor;
    } else if (this._stepThree === 'IP') {
      this.steps[2].stepIcon = 'far fa-3';
      this.steps[2].stepColor = this.textInProgressColor;
      this.steps[2].progressColor = this.bgNotCompleteColor;
    } else if (this._stepThree === 'IC') {
      this.steps[2].stepIcon = 'far fa-3';
      this.steps[2].stepColor = this.textIncompleteColor;
      this.steps[2].progressColor = this.bgNotCompleteColor;
    } else if (this._stepThree === 'C') {
      this.steps[2].stepIcon = this.successIcon;
      this.steps[2].stepColor = this.textCompleteColor;
      this.steps[2].progressColor = this.bgCompleteColor;
    }
  }
  private _stepThree = 'NS';

  // Step Four
  @Input()
  get stepFour(): string {
    return this._stepFour;
  }
  set stepFour(stepFour: string) {
    this._stepFour = stepFour === undefined ? 'NS' : stepFour;
    if (this._stepFour === 'NS') {
      this.steps[3].stepIcon = 'far fa-4';
      this.steps[3].stepColor = this.textNotStartedColor;
      this.steps[3].progressColor = this.bgNotCompleteColor;
    } else if (this._stepFour === 'IP') {
      this.steps[3].stepIcon = 'far fa-4';
      this.steps[3].stepColor = this.textInProgressColor;
      this.steps[3].progressColor = this.bgNotCompleteColor;
    } else if (this._stepFour === 'IC') {
      this.steps[3].stepIcon = 'far fa-4';
      this.steps[3].stepColor = this.textIncompleteColor;
      this.steps[3].progressColor = this.bgNotCompleteColor;
    } else if (this._stepFour === 'C') {
      this.steps[3].stepIcon = this.successIcon;
      this.steps[3].stepColor = this.textCompleteColor;
      this.steps[3].progressColor = this.bgCompleteColor;
    }
  }
  private _stepFour = 'NS';

  // Step Five
  @Input()
  get stepFive(): string {
    return this._stepFive;
  }
  set stepFive(stepFive: string) {
    this._stepFive = stepFive === undefined ? 'NS' : stepFive;
    if (this._stepFive === 'NS') {
      this.steps[4].stepIcon = 'far fa-5';
      this.steps[4].stepColor = this.textNotStartedColor;
      this.steps[4].progressColor = this.bgNotCompleteColor;
    } else if (this._stepFive === 'IP') {
      this.steps[4].stepIcon = 'far fa-5';
      this.steps[4].stepColor = this.textInProgressColor;
      this.steps[4].progressColor = this.bgNotCompleteColor;
    } else if (this._stepFive === 'IC') {
      this.steps[4].stepIcon = 'far fa-5';
      this.steps[4].stepColor = this.textIncompleteColor;
      this.steps[4].progressColor = this.bgNotCompleteColor;
    } else if (this._stepFive === 'C') {
      this.steps[4].stepIcon = this.successIcon;
      this.steps[4].stepColor = this.textCompleteColor;
      this.steps[4].progressColor = this.bgCompleteColor;
    }
  }
  private _stepFive = 'NS';

  // Step Six
  @Input()
  get stepSix(): string {
    return this._stepSix;
  }
  set stepSix(stepSix: string) {
    this._stepSix = stepSix === undefined ? 'NS' : stepSix;
    if (this._stepSix === 'NS') {
      this.steps[5].stepIcon = 'far fa-6';
      this.steps[5].stepColor = this.textNotStartedColor;
      this.steps[5].progressColor = this.bgNotCompleteColor;
    } else if (this._stepSix === 'IP') {
      this.steps[5].stepIcon = 'far fa-6';
      this.steps[5].stepColor = this.textInProgressColor;
      this.steps[5].progressColor = this.bgNotCompleteColor;
    } else if (this._stepSix === 'IC') {
      this.steps[5].stepIcon = 'far fa-6';
      this.steps[5].stepColor = this.textIncompleteColor;
      this.steps[5].progressColor = this.bgNotCompleteColor;
    } else if (this._stepSix === 'C') {
      this.steps[5].stepIcon = this.successIcon;
      this.steps[5].stepColor = this.textCompleteColor;
      this.steps[5].progressColor = this.bgCompleteColor;
    }
  }
  private _stepSix = 'NS';

  constructor() { }

  ngOnInit(): void {
  }
}
