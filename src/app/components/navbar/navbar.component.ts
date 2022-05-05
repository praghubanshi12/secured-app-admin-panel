import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TokenStorageService } from '../../services/token-storage/token-storage.service';

@Component({
  selector: 'app-navbar',
  template: require('./navbar.component.html'),
})
export class NavbarComponent implements OnInit {

  router: Router;
  tokenService: TokenStorageService
  constructor(@Inject(Router) router: Router, @Inject(TokenStorageService) tokenService: TokenStorageService) {
    this.router = router
    this.tokenService = tokenService
  }

  ngOnInit(): void {
  }

  logout() {
    this.tokenService.signOut();
    this.router.navigateByUrl("/login");
  }

}