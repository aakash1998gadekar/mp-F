import { Link } from "react-router-dom";
import BookModel from "../../../models/BookModel";

export const ReturnBook: React.FC<{ booky: BookModel }> = (props) => {
    return (
        <div className="col-xs-6 col-sm-6 col-md-4 col-lg-3 mb-3">
            <div className="text-center">
                {props.booky.img ?
                    <img src={props.booky.img}
                        alt="book"
                        height='233'
                        width='151' />
                    :
                    <img src={require('./../../../Images/BooksImages/book-1000.png')}
                        alt="book"
                        height='233'
                        width='151' />
                }
                <h6 className="mt-2">{props.booky.title}</h6>
                <p>{props.booky.author}</p>
                <Link className="btn main-color text-white" to={`checkout/${props.booky.id}`}>Reserve</Link>
            </div>
        </div>

    );
}