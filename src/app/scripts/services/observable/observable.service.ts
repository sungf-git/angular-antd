import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ObservableService {
	
	watch$: Observable<any>;
	
  createWatch(name){
  	this[name] = new Observable();
  	return this[name];
  }
}
