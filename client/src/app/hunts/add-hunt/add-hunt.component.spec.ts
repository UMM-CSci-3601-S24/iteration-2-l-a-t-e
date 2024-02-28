import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatCardModule } from "@angular/material/card";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatIconModule } from "@angular/material/icon";
import { MatInputModule } from "@angular/material/input";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { AddHuntComponent } from "./add-hunt.component";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';



describe('AddHuntComponent', () => {
  let component: AddHuntComponent;
  let fixture: ComponentFixture<AddHuntComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule,
        CommonModule,
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        MatCardModule,
        BrowserAnimationsModule,
        MatIconModule]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddHuntComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(AddHuntComponent).toBeTruthy();
/*     expect(addHuntForm).toBeTruthy();
 */  });

  describe('addTask', () => {
    it('should add a new task to tasks array', () => {
      const initialTasksLength = component.tasks.length;
      component.addTask();
      expect(component.tasks.length).toBe(initialTasksLength + 1);
    });

    it('should add a required control to tasks array', () => {
      component.addTask();
      const newTask = component.tasks.controls[component.tasks.length - 1];
      newTask.setValue('');
      expect(newTask.valid).toBeFalsy();
      newTask.setValue('New Task');
      expect(newTask.valid).toBeTruthy();
    });
  });

});
