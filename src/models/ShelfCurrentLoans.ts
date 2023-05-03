import BookModel from "./BookModel";

export class ShelfCurrentLoans {
    book: BookModel;
    daysLeft: number;

    constructor(book: BookModel, daysLeft:  number){
        this.daysLeft = daysLeft;
        this.book = book;
    }
}
