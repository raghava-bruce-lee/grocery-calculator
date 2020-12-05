import { Component } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'grocery-tracker';

  selected_item_value : string;
  quantity_value : number;
  metrix_value : string;
  auto_metrics_value: any;
  person_count_value : number;
  days : any;
  sortedGroceryItems: any;

  description: any;

  url = 'https://script.google.com/macros/s/AKfycbxl-6oZvyWn1Q6y3oB5dSIzBqOoVXCJuUAaAS27cCpWsDOARVbD/exec';
  groceryData : any;

  constructor (private http: HttpClient) {
    this.http.get(this.url).toPromise().then( data => {
      this.groceryData = data as any;

      /* sorting function for json data */

      function GetSortOrder(prop) {
        return function(a, b) {
            if (a[prop] > b[prop]) {
                return 1;
            } else if (a[prop] < b[prop]) {
                return -1;
            }
            return 0;
        }
    }

    this.sortedGroceryItems = this.groceryData.items.sort(GetSortOrder("groceryitem"));
    /* ending for sorting function */

    } );
   }

   getMetrics(){
     if( this.selected_item_value == null ){
       alert("please select the grocery item first");
     }
    for( var i=0; i< this.groceryData.items.length; i++){
      if ((this.groceryData.items[i].groceryitem) == this.selected_item_value){
        this.auto_metrics_value = this.groceryData.items[i].metrics;
      }
    }
  }

  selectedItemHandler(event: any){
    this.selected_item_value = event.target.value;
  }

  selectedMetricsHandler(event: any){
    this.metrix_value = event.target.value;
  }

  gettingQuantityValue(event: any){
    this.quantity_value = event.target.value;
  }

  gettingPersonCount(event: any){
    this.person_count_value = event.target.value;
  }



  calculate(){

    if (this.auto_metrics_value == null){
      alert ('Please click on "Get Metrics" - button and enter your qunatity according to that displayed metrics');
    }
    else{

    for (var i=0; i<(this.sortedGroceryItems.length); i++){

      if ((this.sortedGroceryItems[i].groceryitem) == this.selected_item_value){

          var qpd = this.sortedGroceryItems[i].peruse;

          var res = (this.quantity_value/this.person_count_value);

          if (res > qpd){
            this.days = Math.floor((res/qpd)) + "  days";
          }
          else if (res == qpd){
            this.days = "only " + 1 + " day";
          }
          else if (res < qpd){
            this.days = "less than a day";
          }
      }
    }

    this.description = ' Note: The above Estimated Days is calculated by the estimated usage of ' + ' "' + this.selected_item_value +
                                '" ' + ' by one person per day is: ' + qpd +" " + this.auto_metrics_value;
  }

  }

   reload(){
     window.location.reload();
   }
}

