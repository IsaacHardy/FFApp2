import {Page} from 'ionic-framework/ionic';
import {FormBuilder, Validators} from 'angular2/common';

@Page({
  templateUrl: 'build/pages/login/login.html'
})
export class LoginPage {
  firebaseUrl: any;
  messagesRef: Firebase;
  addingUser: any;
  authData: any;
  authDataProfileName: string;
  isLoggedIn: boolean;
  signUpForm: any;
  loginForm: any;
  showLoginEmail: any;
  signingUp: boolean;

  constructor(form: FormBuilder) {
    this.firebaseUrl = "https://ffapphoco.firebaseio.com/messages";
    this.messagesRef = new Firebase(this.firebaseUrl);
    this.addingUser = false;

    this.messagesRef.onAuth((user) => {
      if (user) {
          this.authData = user; // Set retrieved Twitter profile data
          console.log(this.authData);
          if (this.authData.facebook) {
            this.authDataProfileName = this.authData.facebook.displayName;
          } else if (this.authData.twitter) {
            this.authDataProfileName = this.authData.twitter.displayName;
          } else if (this.authData.password) {
            this.authDataProfileName = this.authData.password.displayName;
          }
          this.isLoggedIn = true; // Set authentification was sucesfull
      }
    });
    this.signUpForm = form.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
    });
    this.loginForm = form.group({
      email: ["", Validators.required],
      password: ["", Validators.required],
    });
  }
  authWithTwitter() {
    this.messagesRef.authWithOAuthPopup("twitter", (error) => {
        if (error) {
            console.log(error);
        }
    }, {});
  }
  authWithFacebook() {
    this.messagesRef.authWithOAuthPopup("facebook", (error) => {
        if (error) {
            console.log(error);
        }
    }, {});
  }
  authWithEmail(event) {
    this.messagesRef.authWithPassword({
      email    : this.loginForm.value.email,
      password : this.loginForm.value.password
    }, (error, authData) => {
      if (error) {
        console.log("Login Failed!", error);
      } else {
        console.log("Authenticated successfully with payload:", authData);
      }
    });
    event.preventDefault();
  }
  openLoginEmail() {
    if (!this.showLoginEmail) {
      this.showLoginEmail = true;
    } else {
      this.showLoginEmail = false;
    }
  }
  signUpNewUser() {
    if (!this.signingUp) {
      this.signingUp = true;
    } else {
      this.signingUp = false;
    }

  }
  addNewUser(event) {
    this.messagesRef.createUser({
      email    : this.signUpForm.value.email,
      password : this.signUpForm.value.password,
    }, (error, userData) => {
      if (error) {
        console.log("Error creating user:", error);
      } else {
        console.log("Successfully created user account with uid:", userData.uid);
        this.signingUp = false;
      }
    });
    event.preventDefault();

  }
  unauthWithTwitter() {
      this.messagesRef.unauth();
      this.isLoggedIn = false;
  }
}
