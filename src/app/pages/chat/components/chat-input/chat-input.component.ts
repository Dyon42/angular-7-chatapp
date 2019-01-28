import { Component, OnInit } from '@angular/core';
import { ChatroomService } from './../../../../services/chatroom.service';
import { emojis } from '@ctrl/ngx-emoji-mart/ngx-emoji/public_api';
import { finalize } from 'rxjs/operators';
import { AngularFireStorage } from 'angularfire2/storage';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';

import { LoadingService } from '../../../../servies/loading.service';
import { Subscription } from 'rxjs/Subscription';
import { Location } from '@angular/common';

import { AuthService } from '../../../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from '../../../../services/alert.service';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss']
})
export class ChatInputComponent implements OnInit {

  public newMessageText: string = '';
  public dropEmoji:boolean= false;
  private subsubscriptions: Subscription[] = [];

  constructor(
    private chatroomService: ChatroomService,
    private auth: AuthService,
    private loadingService: LoadingService,
    private route: ActivatedRoute,
    private fs: AngularFireStorage,
    private db: AngularFirestore,
    private location: Location,
    private alertService: AlertService

  ) { }

  ngOnInit() {
  }
  public uploadFile(event): void {
    const file = event.target.files[0];
    const filePath = `${file.name}`;
    const task = this.fs.upload(filePath, file);
    const fileRef = this.fs.ref(filePath);


    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(url => {

          let image = `<img style="width:50%" src="${url}">`
          this.chatroomService.createMessage(image);
        })
        
      })
   )
  .subscribe()
  }

  

  dropdownEmoji(){
    this.dropEmoji = !this.dropEmoji
  }


  public submit(message: string): void {
    this.chatroomService.createMessage(message);

    // reset input
    this.newMessageText = '';

    if(this.dropEmoji){
    this.dropdownEmoji()}
  }
  public addEmoji(event) {
   console.log(event.emoji.native)

  this.newMessageText += event.emoji.native
  }

}
