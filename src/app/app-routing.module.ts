import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SidebarComponent } from "./components/sidebar/sidebar.component"
import { NavbarComponent } from "./components/navbar/navbar.component"
import { FooterComponent } from "./components/footer/footer.component"
import { LoginComponent } from "./components/login/login.component";
import { HomeComponent } from "./components/home/home.component";
import { TableComponent } from "./components/content/Table/table.component";
import { PublisherListComponent } from "./components/publishers/publisher-list.component";
import { PcRegistrationComponent } from "./components/pc-registration/pc-registration.component";
import { SubscriberAddComponent } from "./components/subscribers/subscriber-add/subscriber-add.component";
import { SubscriberListComponent } from "./components/subscribers/subscriber-list/subscriber-list.component";
import { AuthGuard } from "./auth/auth.guard";
import { NotFoundComponent } from "./components/not-found/not-found.component";
import { PaginationComponent } from './components/content/Pagination/pagination.component'

const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  { path: "login", component: LoginComponent },
  { path: "home", redirectTo: "subscribers", pathMatch: "full" },
  {
    path: "publishers",
    component: PublisherListComponent,
    children: [
      {
        path: "publishers/add",
        component: PublisherListComponent
      }
    ]
  },
  {
    path: "subscribers",
    component: SubscriberListComponent,
    canActivate: [AuthGuard],
    data: { role: "ROLE_ADMIN" }
  },
  {
    path: "subscribers/add",
    component: SubscriberAddComponent,
    canActivate: [AuthGuard],
    data: { role: "ROLE_ADMIN" }
  },
  { path: "pcRegistrationForm", component: PcRegistrationComponent },
  { path: "**", pathMatch: 'full', component: NotFoundComponent } //Wild Card Route for 404 request
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const appRoutingComponents = [
  SidebarComponent,
  NavbarComponent,
  FooterComponent,
  LoginComponent,
  PcRegistrationComponent,
  SubscriberAddComponent,
  SubscriberListComponent,
  PublisherListComponent,
  HomeComponent,
  TableComponent,
  NotFoundComponent,
  PaginationComponent
]