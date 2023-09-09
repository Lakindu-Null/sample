import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-content-card',
  templateUrl: './content-card.component.html',
  styleUrls: ['./content-card.component.scss']
})
export class ContentCardComponent implements OnInit {

  items: any[] = [];
  home: any;

  constructor() { }

  displayedColumns = ['product', 'sku', 'date', 'reason', 'status'];
  selection = new SelectionModel<any>(false, []);
  dataSource = new MatTableDataSource<any>();

  @ViewChild('paginator')
  paginator!: MatPaginator;
  errorMessage: any;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  obj = [
    {product: "iPhone 13 pro", sku: "1T231BJHJJ", date: "2023/04/01", reason: "Low cost", status: "processing"},
    {product: "iPhone 13 pro", sku: "1T231BJHJJ", date: "2023/04/01", reason: "Low cost", status: "processing"},
    {product: "iPhone 13 pro", sku: "1T231BJHJJ", date: "2023/04/01", reason: "Low cost", status: "processing"},
    {product: "iPhone 13 pro", sku: "1T231BJHJJ", date: "2023/04/01", reason: "Low cost", status: "processing"},
    {product: "iPhone 13 pro", sku: "1T231BJHJJ", date: "2023/04/01", reason: "Low cost", status: "processing"}
  ];

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource(this.obj);
    this.dataSource.paginator = this.paginator;
  }


}

