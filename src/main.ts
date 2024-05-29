import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { HeaderComponent } from './app/header/header.component';
import { FooterComponent } from './app/footer/footer.component';
import { HomeComponent } from './app/home/home.component';
import { ProductComponent } from './app/product/product.component';
import { ProductDetailsComponent } from './app/product-details/product-details.component';
import { CartComponent } from './app/cart/cart.component';
import { CartDetailComponent } from './app/cart-detail/cart-detail.component';
import { ContactComponent } from './app/contact/contact.component';
import { BlogComponent } from './app/blog/blog.component';
import { LoginComponent } from './app/login/login.component';
import { RegisterComponent } from './app/register/register.component';
bootstrapApplication(AppComponent, appConfig).catch((err) =>
  console.error(err)
);
// bootstrapApplication(HeaderComponent, appConfig).catch((err) =>
//   console.error(err)
// );
// bootstrapApplication(FooterComponent, appConfig).catch((err) =>
//   console.error(err)
// );
bootstrapApplication(HomeComponent, appConfig).catch((err) =>
  console.error(err)
);
bootstrapApplication(ProductComponent, appConfig).catch((err) =>
  console.error(err)
);
bootstrapApplication(ProductDetailsComponent, appConfig).catch((err) =>
  console.error(err)
);
bootstrapApplication(CartComponent, appConfig).catch((err) =>
  console.error(err)
);
bootstrapApplication(CartDetailComponent, appConfig).catch((err) =>
  console.error(err)
);
bootstrapApplication(ContactComponent, appConfig).catch((err) =>
  console.error(err)
);
bootstrapApplication(BlogComponent, appConfig).catch((err) =>
  console.error(err)
);
bootstrapApplication(LoginComponent, appConfig).catch((err) =>
  console.error(err)
);
bootstrapApplication(RegisterComponent, appConfig).catch((err) =>
  console.error(err)
);
