import { Component, OnInit } from '@angular/core';
import { ChatroomService } from './../../../../services/chatroom.service';

@Component({
  selector: 'app-chat-activeusers',
  templateUrl: './chat-activeusers.component.html',
  styleUrls: ['./chat-activeusers.component.scss']
})
export class ChatActiveusersComponent implements OnInit {

  constructor(public chatroomService: ChatroomService) { }

  ngOnInit() {
  }

}
