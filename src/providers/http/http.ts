import { Observable } from "rxjs/Observable";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import md5 from "md5";

/*
A API da marvel utiliza autenticação via parâmetros na URL da seguinte forma.
1 - data e hora da requisição no formato YYYYMMDDTHH:mm
2 - chave privada fornecida pelo site da Marvel
3 - chave pública fornecida pelo site da Marvel
4 - um hash MD5 baseado na concatenação da Data/Hora, chave privada e chave pública

SITE PARA OBTER AS KEYS PARA A API DA MARVEL:
https://developer.marvel.com/

*/


@Injectable()
export class HttpProvider {
  private baseApi: string = "http://gateway.marvel.com/v1/public";
  private privateKeyApi: string = ""; // chave privada vai aqui
  private publicKeyApi: string = ""; //chave pública vai aqui
  private hashApi: string = "";
  private dateApi: string = "";

  constructor(public http: HttpClient) {}

  //método para gerar a data e a hora atual no formato da API
  private getDate(): string {
    let d = new Date();
    let ano = d.getFullYear();
    let mes = d.getMonth() + 1;
    let dia = d.getDate();
    let hora = d.getHours();
    let minuto = d.getMinutes();

    return (
      ano.toString() +
      mes.toString() +
      dia.toString() +
      "T" +
      hora.toString() +
      minuto.toString()
    );
  }

  //método que prepara os parâmetros da URL, gerando o MD5 conforme explicado acima
  private urlPrepare(): void {
    this.dateApi = this.getDate();
    this.hashApi = md5(this.dateApi + this.privateKeyApi + this.publicKeyApi);
  }

/*
  método que busca um herói pelo seu URI
  exemplo de URI:
  "http://gateway.marvel.com/v1/public/characters/1011334"

*/
  getHero(URI: string): Observable<any> {
    this.urlPrepare();
    let params: HttpParams = new HttpParams()
      .set("ts", this.dateApi)
      .set("apikey", this.publicKeyApi)
      .set("hash", this.hashApi);
    return this.http.get(`${URI}`, { headers: null, params: params });
  }


/*
   Método que busca uma lista de heróis. Por padrão em ordem alfabética de nome e trazendo 20 resultados.
   Este método ficou feio, tive problemas em setar os paramêtros.
   Ionic não está conseguindo setar os parâmetros se não forem todos de uma única vez,
   por isso este if else ridículo aqui.
*/
  getHeroes(offset: number, filter: string = null): Observable<any> {
    this.urlPrepare();
    if (!filter) {
      let params: HttpParams = new HttpParams()
        .set("ts", this.dateApi)
        .set("apikey", this.publicKeyApi)
        .set("hash", this.hashApi)
        .set("limit", "20")
        .set("offset", `${offset}`)
        .set("orderBy", "name");
        return this.http.get(`${this.baseApi}/characters`, {headers: null,params: params});
    } else {
      let params: HttpParams = new HttpParams()
        .set("ts", this.dateApi)
        .set("apikey", this.publicKeyApi)
        .set("hash", this.hashApi)
        .set("limit", "20")
        .set("offset", `${offset}`)
        .set("orderBy", "name")
        .set("nameStartsWith",`${filter}`)
        return this.http.get(`${this.baseApi}/characters`, {headers: null,params: params});
    }
  }

/*
  método que busca um herói passando o seu ID como parâmetro.
  o parâmetro offset é usado para buscar mais heróis usando o infiniteScroll.
*/

  getComicsByHero(offset: number, heroId: number): Observable<any> {
    this.urlPrepare();
    let params: HttpParams = new HttpParams()
      .set("ts", this.dateApi)
      .set("apikey", this.publicKeyApi)
      .set("hash", this.hashApi)
      .set("limit", "20")
      .set("offset", `${offset}`)
      .set("orderBy", "title");
    return this.http.get(`${this.baseApi}/characters/${heroId}/comics`, {
      headers: null,
      params: params
    });
  }
}
