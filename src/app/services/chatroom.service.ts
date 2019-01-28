import { Injectable } from '@angular/core';
import { Observable ,  BehaviorSubject } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { LoadingService } from './../servies/loading.service';
import { AuthService } from './auth.service';
import 'rxjs/add/operator/map'

@Injectable()
export class ChatroomService {

  public chatrooms: Observable<any>;
  public activeUsers: Observable<any>;
  public changeChatroom: BehaviorSubject<string | null> = new BehaviorSubject(null);
  public selectedChatroom: Observable<any>;
  public selectedChatroomMessages: Observable<any>;
  public toggleActiveUsers:Boolean = false;

  constructor(
    private db: AngularFirestore,
    private loadingService: LoadingService,
    private authService: AuthService
  ) {
    this.selectedChatroom = this.changeChatroom.switchMap(chatroomId => {
      if (chatroomId) {
        return db.doc(`chatrooms/${chatroomId}`).valueChanges();
      }
      return Observable.of(null);
    });

    this.selectedChatroomMessages = this.changeChatroom.switchMap(chatroomId => {
      if (chatroomId) {
        return db.collection(`chatrooms/${chatroomId}/messages`, ref => {
          return ref.orderBy('createdAt', 'desc').limit(100);
          
        })
        .valueChanges()
        .map(arr => 
          arr.reverse());
      }
      return Observable.of(null);
    });

    this.chatrooms = db.collection('chatrooms').valueChanges();
    this.activeUsers = db.collection('activeuser').valueChanges();
  }

  public createMessage(text: string): void {
    const chatroomId = this.changeChatroom.value;
    const message = {
      message: text,
      createdAt: new Date(),
      sender: this.authService.currentUserSnapshot
    };

    this.db.collection(`chatrooms/${chatroomId}/messages`).add(message);
  }

public closeActiveUsers(){
  this.toggleActiveUsers = !this.toggleActiveUsers
}

}
