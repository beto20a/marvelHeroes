import { AlertProvider } from "./../../providers/alert/alert";
import { HttpProvider } from "./../../providers/http/http";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { LoadingProvider } from "../../providers/loading/loading";

@IonicPage()
@Component({
  selector: "page-herois",
  templateUrl: "herois.html"
})
export class HeroisPage {
  public isSearchbarOpened:boolean = false;
  private infiniteScroll;
  private refresher;
  private isRefreshing:boolean = false;
  private offset: number = 0;
  public heroisList = new Array<any>();
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpProvider,
    public load: LoadingProvider,
    public alert: AlertProvider
  ) {}

  ionViewDidEnter() {
    if (this.heroisList.length == 0) {
      this.carregarHerois();
    }
  }

  carregarHerois(firstTime: boolean = true, filter:string = null) {
    this.load.show("Carregando Heróis...");
    if (firstTime)
      this.offset = 0;
    this.http.getHeroes(this.offset, filter).subscribe(
      data => {
        if (firstTime) this.heroisList = data.data.results;
        else this.heroisList = this.heroisList.concat(data.data.results);

        console.log(data.data.results);

        this.load.hide();
        if (!firstTime) {
          this.infiniteScroll.complete();
        }
        if (this.isRefreshing){
          this.refresher.complete();
        }
      },
      err => {
        this.load.hide();
        if (this.isRefreshing){
          this.refresher.complete();
        }

        if (!firstTime) {
          this.infiniteScroll.complete();
        }
        this.alert.toast("Erro ao carregar heróis!", "bottom");
        console.log(err);
      }
    );
  }

  doInfinite(infiniteScroll) {
    this.infiniteScroll = infiniteScroll;
    this.offset = this.offset + 20;
    this.carregarHerois(false);
  }
  doRefresh(refresher){
    this.refresher = refresher;
    this.isRefreshing = true;
    this.carregarHerois(true);
  }

  carregarComics(heroi){
    this.navCtrl.push('ComicsPage',{hero : heroi});
  }

  onSearch(event){
    this.carregarHerois(true, event.target.value);
  }

}
