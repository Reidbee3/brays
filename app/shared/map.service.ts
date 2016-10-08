import { Injectable, Output, EventEmitter }    from '@angular/core';
import { Headers, Http } from '@angular/http';

import 'rxjs/add/operator/toPromise';

import { MapField } from './map-field';

@Injectable()
export class MapService {
  mapFields: MapField[];

  constructor(private http: Http) { }

  loadMapFields(url: string): Promise<MapField[]> {
    return this.http.get(url)
      .toPromise()
      .then((response) => {
        this.mapFields = response.json() as MapField[];
        return this.mapFields;
      })
      .catch(this.handleError);
  }

  getMapFields(): MapField[] {
    return this.mapFields;
  }

  getMapFieldByFullName(name: string): MapField {
    return this.mapFields.find(field => name === (field.namespace + '.' + field.name));
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }

}
