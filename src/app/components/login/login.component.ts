import { Component, OnInit, Inject } from "@angular/core";
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "./../../services/auth/auth.service";
import { TokenStorageService } from "./../../services/token-storage/token-storage.service";

@Component({
  selector: "app-login",
  template: require("./login.component.html"),
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  form: any = {
    email: null,
    password: null
  };
  isLoggedIn = false;
  isLoginFailed = false;
  errorMessage = "";
  roles: string[] = [];
  isLoginComponent = false;

  router: Router;
  route: ActivatedRoute;
  tokenStorage: TokenStorageService;
  authService: AuthService;
  formBuilder: FormBuilder;

  constructor(@Inject(Router) router: Router,
    @Inject(ActivatedRoute) route: ActivatedRoute,
    @Inject(TokenStorageService) tokenStorage: TokenStorageService,
    @Inject(AuthService) authService: AuthService,
    @Inject(FormBuilder) formBuilder: FormBuilder) {
    this.router = router
    this.route = route
    this.tokenStorage = tokenStorage
    this.authService = authService
    this.formBuilder = formBuilder
  }

  ngOnInit(): void {
    if (this.tokenStorage.getToken()) {
      this.isLoggedIn = true;
      this.roles = this.tokenStorage.getUser().roles;
      this.router.navigateByUrl("/home");
    }
    this.setForm();
  }

  setForm() {
    this.loginForm = this.formBuilder.group({
      "email": new FormControl("", [Validators.required, Validators.email]),
      "password": new FormControl("", [Validators.required])
    })
  }

  get f(): { [key: string]: AbstractControl } {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.authService.login(this.loginForm.value).subscribe({
      next: data => {
        this.tokenStorage.saveToken(data.accessToken);
        this.tokenStorage.saveUser(data);
        this.isLoginFailed = false;
        this.isLoggedIn = true;
        this.roles = this.tokenStorage.getUser().roles;
        this.router.navigateByUrl("/home");
      },
      error: err => {
        this.errorMessage = err.error.message;
        this.isLoginFailed = true;
      }
    });
  }
}
