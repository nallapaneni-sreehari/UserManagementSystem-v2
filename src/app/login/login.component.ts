import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from "@angular/router";
import { environment } from 'src/environments/environment';
import { first, map } from 'rxjs/operators';
import { ConnectionService } from '../services/connection.service';
import { UserDetails } from '../models/StructureClass';
import { AdminFeedbackComponent } from '../admin-feedback/admin-feedback.component';
import {HttpHeaders} from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public body: any;
  public LoginError: any;
  public LoadingSpinner = false;
  public ServerError = false;
  public userdetails: UserDetails[] | any;
  public userStatus: boolean=true;


  constructor(private router: Router, public connectionService: ConnectionService, public http: HttpClient) {

  }

  ngOnInit(): void {

  }

  move_to_register() {
    this.router.navigateByUrl('/register');
  }
  move_to_forgot_password() {
    this.router.navigateByUrl('/forgot-password');

  }

  onSubmit(loginForm: NgForm) {
    this.LoadingSpinner = true;
    var username = loginForm.controls.UserName.value;
    var password = loginForm.controls.Password.value;

    if (username == "Admin" && password == "Admin123@") {
      this.connectionService
        .login(username, password)
        .pipe(first())
        .subscribe({
          next: data => {
            this.LoginError = false;
            this.ServerError = false;
            // this.connectionService.getDetails().subscribe(data=>{
            //   this.userdetails=[data];
            //   this.router.navigateByUrl('/dashboard');
            //   this.LoadingSpinner=false;
            // });
            setTimeout(() => {
              this.LoadingSpinner = false;
              this.router.navigateByUrl('/admin-dashboard');

            }, 3000)


          },
          error: error => {
            console.log(error)
            if (error.status == 404) {
              this.LoadingSpinner = false;
              this.LoginError = false;
              this.ServerError = true;

            }
            else {
              this.ServerError = false;
              this.LoadingSpinner = false;
              this.LoginError = error.statusText;
            }
          }
        });
    }

    else {
      this.connectionService
        .login(username, password)
        .pipe(first())
        .subscribe({
          next: data => {
            console.log("LoginData Live:::", data);
            this.LoginError = false;
            this.ServerError = false;
            // this.connectionService.getDetails().subscribe(data=>{
            //   this.userdetails=[data];
            //   this.router.navigateByUrl('/dashboard');
            //   this.LoadingSpinner=false;
            // });
            if (data) {
              this.connectionService.getUsers().subscribe((userDetails: any) => {
                console.log("userDetails:::", userDetails);
                if (userDetails) {
                  this.LoadingSpinner = false;
                  for (let user of userDetails) {
                    if (user.userName == username) {
                      this.userStatus = user.status;
                      console.log("this.userStatus:::",this.userStatus , user.status);
                      if (user.status == "true") {
                        console.log("User Active");
                        this.connectionService.header = new HttpHeaders({ 
                          'Content-Type': 'application/json',
                          'Authorization': 'Bearer ' + localStorage.getItem('CurrentUserToken')
                       });
                        this.connectionService.getDetails().subscribe(data=>{
                          console.log("UserData after Login",data);
                          if(data && data?.length > 0)
                          {
                            console.log("Now");
                            this.router.navigateByUrl('dashboard');
                          }
                        });
                        // setTimeout(()=>{
                        //   this.router.navigateByUrl('/dashboard');
                        // }, 3000);
                      }
                      else if(user.status == "false"){
                        console.log("User Blocked");
                        alert("You are Blocked by Admin ...!");
                      }
                    }
                  }

                  // if (this.userStatus == true) {
                  //   this.router.navigateByUrl('/dashboard');
                  // }
                  // else if (this.userStatus == false) {
                  //   alert("You are Blocked by Admin ...!");
                  // }
                }
                else {
                  // this.userStatus = false;
                  this.LoadingSpinner = false;
                }


              });
            }
          },
          error: error => {
            console.log(error)
            if (error.status == 404) {
              this.LoadingSpinner = false;
              this.LoginError = false;
              this.ServerError = true;

            }
            else {
              this.ServerError = false;
              this.LoadingSpinner = false;
              this.LoginError = error.statusText;
            }
          }
        });
    }


  }

}
