import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  NgModule,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { HappinessLevelComponentModule } from '../shared/ui/happiness-level.component';
import { adultValidator } from '../shared/utils/adult-validator';
import { passwordMatchesValidator } from '../shared/utils/password-matches-validator';
import { UsernameAvailableValidator } from '../shared/utils/username-available-validator';

@Component({
  selector: 'app-home',
  template: `
    <form [formGroup]="myForm" (ngSubmit)="handleSubmit()" #form="ngForm">
      <div>
        <input formControlName="username" type="text" />
        <span *ngIf="myForm.controls.username.statusChanges | async as status">
          {{ status }}
        </span>
        <p
          *ngIf="
            !myForm.controls.username.valid &&
            (myForm.controls.username.dirty || form.submitted)
          "
        >
          Please provide a username that is not taken
        </p>
      </div>
      <div>
        <input formControlName="age" type="number" />
        <p
          *ngIf="
            !myForm.controls.age.valid &&
            (myForm.controls.age.dirty || form.submitted)
          "
        >
          Age must be greater than 18
        </p>
      </div>
      <div>
        <input formControlName="password" type="password" />
        <p
          *ngIf="
            !myForm.controls.password.valid &&
            (myForm.controls.password.dirty || form.submitted)
          "
        >
          Password must be at least 8 characters long
        </p>
      </div>
      <div>
        <input formControlName="confirmPassword" type="password" />
        <p
          *ngIf="
            myForm.hasError('passwordMatch') &&
            (myForm.controls.confirmPassword.dirty || form.submitted)
          "
        >
          Must match password
        </p>
      </div>
      <div>
        <h2>Add Guests</h2>
        <ng-container formArrayName="guests">
          <input
            *ngFor="let guest of myForm.controls.guests.controls; index as i"
            [formControlName]="i"
            type="text"
          />
        </ng-container>
        <button (click)="addGuest()">Add</button>
      </div>

      <app-happiness-level formControlName="happiness"></app-happiness-level>

      <p *ngIf="!myForm.valid">There are errors with the form!</p>
      <button type="submit" [disabled]="myForm.pending">Submit</button>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  myForm = this.fb.nonNullable.group(
    {
      username: [
        '',
        Validators.required,
        this.usernameAvailableValidator.validate.bind(
          this.usernameAvailableValidator
        ),
      ],
      age: [null, adultValidator],
      password: ['', [Validators.minLength(8), Validators.required]],
      confirmPassword: ['', [Validators.required]],
      guests: this.fb.array([]),
      happiness: ['neutral', Validators.required],
    },
    {
      validators: [passwordMatchesValidator],
    }
  );

  constructor(
    private fb: FormBuilder,
    private usernameAvailableValidator: UsernameAvailableValidator
  ) {}

  handleSubmit() {
    console.log(this.myForm.value);
  }

  addGuest() {
    const guestControl = this.fb.control('', Validators.required);
    this.myForm.controls.guests.push(guestControl);
  }
}

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HappinessLevelComponentModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomeComponent,
      },
    ]),
  ],
})
export class HomeComponentModule {}
