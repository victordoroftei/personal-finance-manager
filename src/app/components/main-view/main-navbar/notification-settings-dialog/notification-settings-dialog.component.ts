import { Component } from '@angular/core';
import {UserService} from "../../../../services/user-service";
import {UserSettingsModel} from "../../../../models/user-settings.model";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-notification-settings-dialog',
  templateUrl: './notification-settings-dialog.component.html',
  styleUrls: ['./notification-settings-dialog.component.css']
})
export class NotificationSettingsDialogComponent {

  notificationDaysModel: number = 7;

  smsDaysModel: number = 3;

  userSettingsModel: UserSettingsModel;

  constructor(private userService: UserService, public dialogRef: MatDialogRef<NotificationSettingsDialogComponent>) {
    this.userSettingsModel = new UserSettingsModel(7, 3);

    this.userService.getUserSettingsById().subscribe(data => {
      if (data.status == 200) {
        this.userSettingsModel = data.body;
        this.notificationDaysModel = this.userSettingsModel.notificationDays;
        this.smsDaysModel = this.userSettingsModel.smsDays;
      } else {
        alert("There are no settings for this user!");
        window.location.reload();
      }
    });
  }

  onSaveChangesClick(): void {
    this.userSettingsModel.notificationDays = this.notificationDaysModel;
    this.userSettingsModel.smsDays = this.smsDaysModel;

    this.userService.updateAccountSettings(this.userSettingsModel).subscribe(data => {
      if (data.status == 202) {
        console.log("User notification settings successfully updated!");
      } else {
        console.log("ERROR WHILE UPDATING USER NOTIFICATION SETTINGS");
      }
    });

    this.dialogRef.close();
  }

  onCancelClick(): void {
    this.dialogRef.close();
  }

}
