import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HeaderComponent } from './app/component/header/header.component';
import { FooterComponent } from './app/component/footer/footer.component';
import { HomeComponent } from './app/component/home/home.component';
import { ProductComponent } from './app/component/product/product.component';
import { ProductDetailsComponent } from './app/component/product-details/product-details.component';
import { ContactComponent } from './app/component/contact/contact.component';
import { BlogComponent } from './app/component/blog/blog.component';
import { LoginComponent } from './app/component/login/login.component';
import { RegisterComponent } from './app/component/register/register.component';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => console.error(err));
// bootstrapApplication(AppComponent, appConfig).catch((err) =>
//   console.error(err)
// );
// bootstrapApplication(HeaderComponent, appConfig).catch((err) =>
//   console.error(err)
// );
// bootstrapApplication(FooterComponent, appConfig).catch((err) =>
//   console.error(err)
// );
// bootstrapApplication(HomeComponent, appConfig).catch((err) =>
//   console.error(err)
// );
// bootstrapApplication(ProductComponent, appConfig).catch((err) =>
//   console.error(err)
// );
// bootstrapApplication(ProductDetailsComponent, appConfig).catch((err) =>
//   console.error(err)
// );
// bootstrapApplication(CartComponent, appConfig).catch((err) =>
//   console.error(err)
// );
// bootstrapApplication(ContactComponent, appConfig).catch((err) =>
//   console.error(err)
// );
// bootstrapApplication(BlogComponent, appConfig).catch((err) =>
//   console.error(err)
// );
// bootstrapApplication(LoginComponent, appConfig).catch((err) =>
//   console.error(err)
// );
// bootstrapApplication(HomeComponent, appConfig).catch((err) =>
//   console.error(err)
// );
// bootstrapApplication(RegisterComponent, appConfig).catch((err) =>
//   console.error(err)
// );
