import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router, ActivationEnd } from '@angular/router';
@Component({
  selector: 'navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.css']
})
export class NavigationComponent implements OnInit {
  title: String;
  userName: String;
  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches)
    );

  constructor(private breakpointObserver: BreakpointObserver, private router: Router) { }

  @ViewChild('drawer') sideNav: ElementRef;

  ngOnInit() {
    this.userName = 'Test User';
    this.router.events.subscribe(event => {
      if (event instanceof ActivationEnd) {
        this.title = event.snapshot.data.title;
      }
    });
  }
}
