import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonFunctions } from 'src/app/util/CommonFunctions';
import { Theme } from 'src/app/util/Theme';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  theme = Theme;
  commonFunctions=CommonFunctions;
  constructor(public translate: TranslateService) {
    translate.addLangs(['en']);
    //translate.addLangs(['en','si']);
  }

  getSelectedValue(value: any) {
    CommonFunctions.language.next(value);
    CommonFunctions.browserLang=value;
  }



  ngOnInit() {

  }

}
