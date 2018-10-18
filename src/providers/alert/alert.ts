import { Injectable } from "@angular/core";
import { ToastController,AlertController} from "ionic-angular";



@Injectable()
export class AlertProvider {
  constructor(
    public toastCtrl: ToastController,
    public alertCtrl: AlertController
    ) {}

  toast(message: string, position: string): void {
    this.toastCtrl.create({
      message: message,
      position: position,
      duration:2000
    }).present();
  }

  alert(title:string, message:string):void{
    this.alertCtrl.create({
      title:title,
      message:message,
      buttons:[{
        text:'OK'
      }]
    })
  }
}
