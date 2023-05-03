import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { StarReviews } from "../utils/StarReviews";
import { CheckoutAndReviewBox } from "./CheckoutAndReviewBox";
import { useOktaAuth } from "@okta/okta-react";

export const BookCheckoutPage = () => {

    const { authState } = useOktaAuth();
    console.log(authState)
    // Book state
    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Loans Count state
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingcurrentLoansCount, setIsLoadingcurrentLoansCount] = useState(true);

    // Is book check out?
    const [IsCheckedOut, setIsCheckedout] = useState(false);
    const [isLoadingBookCheckedOut, setisLoadingBookCheckedOut] = useState(true);

    const bookId = (window.location.pathname).split("/")[2];

    useEffect(() => {
        const fetchBook = async () => {
            const baseUrl: string = `/api/books/${bookId}`;
            const response = await fetch(baseUrl);
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();
            // deserialize the json response obtained 
            const loadedBook: BookModel = {
                id: parseInt(bookId),
                title: responseJson.title,
                author: responseJson.author,
                description: responseJson.description,
                copies: responseJson.copies,
                copies_available: responseJson.copiesAvailable,
                category: responseJson.category,
                img: responseJson.img,
            };

            setBook(loadedBook);
            setIsLoading(false);
        }
        fetchBook().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, [IsCheckedOut]);

    useEffect(() => {
        const fetchUserCurrentLoansCount = async () => {
            if (authState?.isAuthenticated) {
                const url = `/api/books/secure/currentLoans/count`;
                const requrstOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const currentLoansCountResponse = await fetch(url, requrstOptions);
                if (!currentLoansCountResponse.ok) {
                    throw new Error("Something went wrong");
                }

                const currentLoansCountResponseJson = await currentLoansCountResponse.json();
                setCurrentLoansCount(currentLoansCountResponseJson);
            }

            setIsLoadingcurrentLoansCount(false);
        }

        fetchUserCurrentLoansCount().catch((error: any) => {
            setIsLoadingcurrentLoansCount(false);
            setHttpError(error.message);
        })
    }, [authState, IsCheckedOut]);

    useEffect(() => {
        const fetchUserCheckedOutBook = async () => {
            if (authState && authState.isAuthenticated) {
                const url = `/api/books/secure/ischeckedout/byuser/?bookId=${bookId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                };
                const bookCheckedOut = await fetch(url, requestOptions);

                if (!bookCheckedOut.ok) {
                    throw new Error('Something went wrong!');
                }

                const bookCheckedOutResponseJson = await bookCheckedOut.json();
                setIsCheckedout(bookCheckedOutResponseJson);
            }
            setisLoadingBookCheckedOut(false);
        }

        fetchUserCheckedOutBook().catch((error: any) => {
            setisLoadingBookCheckedOut(false);
            setHttpError(error.message);
        })
    }, [authState, IsCheckedOut]);

    if (isLoading) {
        return (
            <div className="contaner m-5">
                <p>Loading...</p>
            </div>
        )
    }
    if (httpError) {
        return (
            <div className="contaner m-5">
                <p>{httpError}</p>
            </div>
        )
    }

    async function checkoutBook() {
        const url = `/api/books/secure/checkout/?bookId=${bookId}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        };
        const checkoutResponse = await fetch(url, requestOptions);
        if (!checkoutResponse.ok) {
            throw new Error('Something went wrong!');
        }
        setIsCheckedout(true);
    }

    return (
        <div>
            <div className="container d-none d-lg-block">
                <div className="row mt-5">
                    <div className="col-sm-2 col-md-2">
                        {book?.img ?
                            <img src={book?.img} alt="Book" width="226" height="349" />
                            :
                            <img src={require('./../../Images/BooksImages/new-book-1.png')} width="226" height="349" alt="Book" />
                        }
                    </div>
                    <div className="col-4 col-md-4 container">
                        <div className="ml-2">
                            <h2>{book?.title}</h2>
                            <h5 className="text-primary">{book?.author}</h5>
                            <p className="lead">{book?.description}</p>
                            {/* <StarReviews rating={0.5} size={32} /> */}
                        </div>
                    </div>
                    <CheckoutAndReviewBox book={book} mobile={false}
                        currentLoansCount={currentLoansCount}
                        isAuthenticated={authState?.isAuthenticated}
                        isCheckedOut={IsCheckedOut}
                        checkoutBook={checkoutBook} />
                </div>
                <hr />
            </div>
            <div className="container d-lg-none mt-5">
                <div className="d-flex justify-content-center align-items-center">
                    {book?.img ?
                        <img src={book?.img} alt="Book" width="226" height="349" />
                        :
                        <img src={require('./../../Images/BooksImages/new-book-1.png')} width="226" height="349" alt="Book" />
                    }
                </div>
                <div className="mt-4">
                    <div className="ml-2">
                        <h2>{book?.title}</h2>
                        <h5 className="text-primary">{book?.author}</h5>
                        <p className="lead">{book?.description}</p>
                        {/* <StarReviews rating={3.5} size={32} /> */}
                    </div>
                </div>
                <CheckoutAndReviewBox book={book} mobile={false}
                    currentLoansCount={currentLoansCount}
                    isAuthenticated={authState?.isAuthenticated}
                    isCheckedOut={IsCheckedOut}
                    checkoutBook={checkoutBook} />
                <hr />
            </div>
        </div>
    );
}