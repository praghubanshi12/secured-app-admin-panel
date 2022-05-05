import { Component, Inject, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  template: require('./sidebar.component.html'),
})
export class SidebarComponent implements OnInit {
  router: Router;
  constructor(@Inject(Router) router: Router) {
    this.router = router
  }

  ngOnInit(): void { }

  title = "Secured App"
}