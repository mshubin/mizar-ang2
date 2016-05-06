import { Component } from '@angular/core';
import { MD_SIDENAV_DIRECTIVES } from '@angular2-material/sidenav';
import { MdButton } from '@angular2-material/button';

@Component({
  selector: 'mizar-sidebar',
  styleUrls: [
    '../node_modules/@angular2-material/sidenav/sidenav.css',
    '../node_modules/@angular2-material/button/button.css'
  ],
  directives: [MdButton, MD_SIDENAV_DIRECTIVES],
  template: `
      <md-sidenav-layout style="height: 100%;">
        <md-sidenav #start (open)="myinput.focus()" mode="side">
          Start Side Drawer
          <br>
          <button md-button (click)="start.close()">Close</button>
          <br>
          <br>
          <button md-button
                  (click)="start.mode = (start.mode == 'push' ? 'over' : (start.mode == 'over' ? 'side' : 'push'))">Toggle Mode</button>
          <div>Mode: {{start.mode}}</div>
          <br>
          <input #myinput>
          <br>
          <button md-raised-button color="primary">FLAT</button>
          <button md-raised-button color="warn">WARN</button>
        </md-sidenav>
        <div>       <button (click)="start.toggle()" md-mini-fab>
             <md-icon class="md-24">Menu</md-icon>
          </button>
        </div>
     </md-sidenav-layout>
  `
})
export class SidebarComponent {

  constructor() {
    console.log("Hello sidebar");
  }

}

