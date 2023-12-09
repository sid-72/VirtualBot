import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import { AngularFireStorage } from "@angular/fire/compat/storage";
import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'virtual-bot';
  specialEvents:any = [];
  public data:any;
  public result:any;
  public productlist:any;
  public url:any;
  public output_image:any;
  public downloadURL!: Observable<string>;
  public display_flag=false;
  public path:any;
  public sucess_flag=false;
  public predictions: any;
  public inputwindow_flag=false;
  public outputwindow_flag=false;
  public fb!: string;
  public choice="0";
  constructor(private http:HttpClient,private domSanitizer: DomSanitizer,private storage: AngularFireStorage) { }

  ngOnInit(): void {
    console.log(localStorage.getItem('useremail'));
  }
  public send(event:any){
	this.sucess_flag = false;
	this.inputwindow_flag = true;
	this.outputwindow_flag= false;
	this.display_flag=false;
    const file = event.target.files[0];
    this.data = file.name;
    console.log(this.data);
    const filePath = 'input_images/'+this.data;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(`input_images/`+this.data, file);
    task.snapshotChanges().pipe(
      finalize(() => {
        fileRef.getDownloadURL().subscribe(downloadURL => {
          this.fb = downloadURL;
          console.log(this.fb);
          this.url=this.fb;
          //alert('file uploaded');
          this.sucess_flag=true;
        });
      })
    ).subscribe();
    
    
  }


  public display(){
	this.display_flag = false;
	this.outputwindow_flag = true;
  const payload=new FormData();
  payload.append('name',this.url);
  payload.append('filename',this.data);
  payload.append('model',this.choice);
	
    this.http.post('http://127.0.0.1:5000/detect',payload,{responseType:'text'}).subscribe(data=>{
      this.output_image = data.split(",")[0];
      ///let item=data.split(",");
      this.predictions=data.split(",").slice(1);
      console.log(this.predictions);

      //alert('data processed');
      this.path=this.output_image;
      this.display_flag=true;
    });
  }
  
  public selectmodel(event:any){
	  //this.sucess_flag = false;
    this.inputwindow_flag = true;
    this.outputwindow_flag= false;
    this.display_flag=false;
    this.choice=event.target.value;
	  console.log(this.choice);
  }
  
  public results(event:any){
    let item=event.target.value;
    const headers = { 'X-RapidAPI-Host':'real-time-amazon-data.p.rapidapi.com', 'X-RapidAPI-Key':'f49af12c6amshfb5440f880f2f1fp102d63jsnb5efe73481bb'}
    this.http.get(`https://real-time-amazon-data.p.rapidapi.com/search?query=${item}`,{headers}).subscribe(data=>{
      this.result = data;
      console.log(data);
      this.productlist = this.result.data.products;
	  this.productlist=this.productlist.slice(0,10);
    this.display_flag=false;
    this.inputwindow_flag = false;
    this.outputwindow_flag= false;
    });
  } 
}
