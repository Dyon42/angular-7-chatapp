import { switchMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../interfaces/user';
import { Alert } from './../classes/alert';
import { AlertService } from './alert.service';
import { Observable } from 'rxjs';
import { AlertType } from './../enums/alert-type.enum';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import 'rxjs/add/observable/of'
//import 'rxjs/observable/fromPromise';
import 'rxjs/add/operator/switchMap'
//import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';




@Injectable()
export class AuthService {

  public currentUser: Observable<User | null>;
  public currentUserSnapshot: User | null;

  constructor(
    private router: Router,
    private alertService: AlertService,
    private afAuth: AngularFireAuth,
    private db: AngularFirestore
  ) {

    this.currentUser = this.afAuth.authState
    .switchMap((user) => {
        if (user) {
// add it to the atciveuser object 
          return this.db.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
// delete from the active user object 
          return Observable.of(null);
        }
      })

    this.setCurrentUserSnapshot();
  }

  public signup(firstName: string, lastName: string, email: string, password: string): Observable<boolean> {
    return Observable.fromPromise(
      this.afAuth.auth.createUserWithEmailAndPassword(email, password)
        .then((user) => {
          console.log(user)
          const userRef: AngularFirestoreDocument<User> = this.db.doc(`users/${user.user.uid}`);
          const updatedUser = {
            id: user.user.uid,
            email: user.user.uid,
            firstName,
            lastName,
            photoUrl: 'https://firebasestorage.googleapis.com/v0/b/chat-4f314.appspot.com/o/default_profile_pic.jpg?alt=media&token=15171a5a-45fa-4e7e-9a4a-522bb330f2ba',
            quote: 'Life is like a box of chocolates, you never know what you are gonna get!',
            bio: 'Bio is under construction...'
          }

          userRef.set(updatedUser);
          return true;
        })
        .catch((err) => false)
    );
  }

  public login(email: string, password: string): Observable<boolean> {

    return Observable.fromPromise(
      this.afAuth.auth.signInWithEmailAndPassword(email, password)
        .then((user) => true)
        .catch((err) => false)
    );
  }



  public logout(): void {
    this.afAuth.auth.signOut().then(() => {
      this.router.navigate(['/login']);
      this.alertService.alerts.next(new Alert('You have been signed out.'));
      
    });
  }

  private setCurrentUserSnapshot(): void {
    this.currentUser.subscribe(user => {
      if (user) {
        const updatedUser = {
          firstName: user.firstName
        }
        console.log("login",user.id)
        this.db.collection(`activeuser`).doc(user.id).set(updatedUser);
      }

      else {
        if (this.currentUserSnapshot) {
          console.log("logout",this.currentUserSnapshot.id)
          this.db.collection(`activeuser`).doc(this.currentUserSnapshot.id).delete();
        }
      }
     
      this.currentUserSnapshot = user
    });
  }
}
