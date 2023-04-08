export class UserSettingsModel {

  notificationDays: number;
  smsDays: number;

  constructor(notificationDays: number, smsDays: number) {
    this.notificationDays = notificationDays;
    this.smsDays = smsDays;
  }
}
