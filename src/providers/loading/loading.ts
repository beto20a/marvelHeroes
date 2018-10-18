import { Injectable } from "@angular/core";
import { LoadingController, Loading } from "ionic-angular";

@Injectable()
export class LoadingProvider {
  private spin: Loading;
  constructor(public loadCtrl: LoadingController) {}

  show(message: string): void {
    if (this.spin == null) {
      this.spin = this.loadCtrl.create({
        content: message || "Carregando..."
      });
      this.spin.present();
    } else {
      this.spin.data.content = message;
    }
  }

  hide(): void {
    if (this.spin != null) {
      this.spin.dismiss();
      this.spin = null;
    }
  }
}
