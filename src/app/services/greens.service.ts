import { Injectable }    from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';

import { Erc } from 'app/classes/erc';

import 'rxjs/add/operator/toPromise';

@Injectable()
export class GreensService {

  private mintUrl: string;
  private updateUrl: string;
  private apiKey: string;

  constructor(
    private http: Http) {
  }

  setApiKey(key: string) {
    this.apiKey = key;
  }

  setEndpoint(endpoint: string, prefix?: string) {
    if (endpoint.slice(-1) !== '/') {
      endpoint += '/';
    }

    this.mintUrl = endpoint + 'arks/mint/' + prefix;
    this.updateUrl = endpoint + 'id/';
  }

  mint(erc: Erc = null): Promise<string> {
    let body = (erc !== null) ? erc.getQuery() : '';

    return this.http.post(this.mintUrl, body, this.getOptions())
      .toPromise()
      .then((resonse) => {
        let data = resonse.json();
        return data.id;
      })
      .catch(this.handleError);
  }

  update(id: string, erc: Erc): Promise<Erc> {
    let body = erc.getQuery();

    return this.http.put(this.updateUrl + id, body, this.getOptions())
      .toPromise()
      .then((response) => {
        let data = response.json();
        let erc = new Erc(data.ark.who, data.ark.what, data.ark.when, data.ark.where);
        return erc;
      })
      .catch(this.handleError);
  }

  destroy(id: string): Promise<any> {
    return this.http.delete(this.updateUrl + id, this.getOptions())
      .toPromise();
  }

  get(id: string): Promise<Erc> {
    return this.http.get(this.updateUrl + id, this.getOptions())
      .toPromise()
      .then((response) => {
        let data = response.json();
        let erc = new Erc(data.ark.who, data.ark.what, data.ark.when, data.ark.where);
        return erc;
      })
      .catch(this.handleError);
  }

  throttle(duration: number): Promise<any> {
    return new Promise((resolve, reject) => {
      setTimeout(() => resolve(), duration);
    })
  }

  private getOptions(): RequestOptions {
    let headers = new Headers({ 'api-key': this.apiKey });
    let options = new RequestOptions({ headers: headers });
    return options;
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error._body || error);
  }

}
