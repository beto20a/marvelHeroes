import { AlertProvider } from "./../../providers/alert/alert";
import { HttpProvider } from "./../../providers/http/http";
import { Component, ViewChild } from "@angular/core";
import { IonicPage, NavController, NavParams, Content } from "ionic-angular";
import { LoadingProvider } from "../../providers/loading/loading";

/**
 * Generated class for the ComicsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: "page-comics",
  templateUrl: "comics.html"
})
export class ComicsPage {
  @ViewChild(Content)
  content: Content;
  public hero = {
    comics: {
      available: 0
    },
    description: "",
    id: 0,
    name: "",
    thumbnail: {
      path: "",
      extension: ""
    }
  };

  private offset: number = 0;
  private infiniteScroll;
  private refresher;
  private isRefreshing: boolean = false;
  public comicsList = new Array<any>();

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: HttpProvider,
    public alert: AlertProvider,
    public load: LoadingProvider
  ) {}

  ionViewDidEnter() {
    if (this.comicsList.length == 0) {
      this.hero = this.navParams.get("hero");
      this.carregarComics();
    }
  }

  carregarComics(firstTime: boolean = true) {
    this.load.show("Carregando HQs...");
    if (firstTime) this.offset = 0;
    this.http.getComicsByHero(this.offset, this.hero.id).subscribe(
      data => {
        if (firstTime) this.comicsList = data.data.results;
        else this.comicsList = this.comicsList.concat(data.data.results);
        this.load.hide();
        if (!firstTime) {
          this.infiniteScroll.complete();
        }
        if (this.isRefreshing) {
          this.refresher.complete();
        }
      },
      err => {
        this.load.hide();
        if (this.isRefreshing) {
          this.refresher.complete();
        }

        if (!firstTime) {
          this.infiniteScroll.complete();
        }
        this.alert.toast("Erro ao carregar HQs!", "bottom");
        console.log(err);
      }
    );
  }

  reloadPage() {
    this.carregarComics(true);
    this.content.scrollToTop();
  }

  getHeroByURI(URI: string) {
    this.load.show("Carregando novo Heroi");
    this.http.getHero(URI).subscribe(
      data => {
        this.hero = data.data.results[0];
        this.load.hide();
        this.reloadPage();
      },
      error => {
        this.load.hide();
        this.alert.toast("Erro ao carregar dados do Heroi", "bottom");
      }
    );
  }

  doInfinite(infiniteScroll) {
    this.infiniteScroll = infiniteScroll;
    this.offset = this.offset + 20;
    this.carregarComics(false);
  }
  doRefresh(refresher) {
    this.refresher = refresher;
    this.isRefreshing = true;
    this.carregarComics(true);
  }
}
