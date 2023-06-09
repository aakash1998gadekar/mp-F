import { ReturnBook } from "./ReturnBook";
import { useEffect, useState } from "react";
import BookModel from "../../../models/BookModel";
import React from "react";
import { Link, NavLink } from "react-router-dom";

function Carousal() {
    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // same as componentDidMount, componentDidUpdate
    useEffect(() => {
        const fetchBooks = async () => {
            const baseUrl: string = `/api/books`;
            const url: string = `${baseUrl}?page=0&size=9`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Something went wrong!');
            }

            const responseJson = await response.json();
            // deserialize the json response obtained 
            const responseData = responseJson._embedded.books;
            const loadedBooks: BookModel[] = [];
            for (const key in responseData) {
                loadedBooks.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    author: responseData[key].author,
                    description: responseData[key].description,
                    copies: responseData[key].copies,
                    copies_available: responseData[key].copies_available,
                    category: responseData[key].category,
                    img: responseData[key].img,
                });
            }

            setBooks(loadedBooks);
            setIsLoading(false);
        }
        fetchBooks().catch((error: any) => {
            setIsLoading(false);
            setHttpError(error.message);
        })
    }, []);

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

    return (
        <div>
            <div className='container mt-5' style={{ height: 550 }}>
                <div className='homepage-carousel-title'>
                    <h3>Find your next "I stayed up too late reading" book.</h3>
                </div>
                <div id='carouselExampleControls' className='carousel carousel-dark slide mt-5 
                d-none d-lg-block' data-bs-interval='false'>

                    {/* Desktop */}
                    <div className='carousel-inner'>
                        <div className='carousel-item active'>
                            <div className='row d-flex justify-content-center align-items-center'>
                                {books.slice(0, 3).map(book => (
                                    <ReturnBook booky={book} key={book.id} />
                                ))}
                            </div>
                        </div>
                        <div className='carousel-item'>
                            <div className='row d-flex justify-content-center align-items-center'>
                                {books.slice(3, 6).map(book => (
                                    <ReturnBook booky={book} key={book.id} />
                                ))}
                            </div>
                        </div>
                        <div className='carousel-item'>
                            <div className='row d-flex justify-content-center align-items-center'>
                                {books.slice(3, 6).map(book => (
                                    <ReturnBook booky={book} key={book.id} />
                                ))}
                            </div>
                        </div>
                    </div>
                    <button className='carousel-control-prev' type='button'
                        data-bs-target='#carouselExampleControls' data-bs-slide='prev'>
                        <span className='carousel-control-prev-icon' aria-hidden='true'></span>
                        <span className='visually-hidden'>Previous</span>
                    </button>
                    <button className='carousel-control-next' type='button'
                        data-bs-target='#carouselExampleControls' data-bs-slide='next'>
                        <span className='carousel-control-next-icon' aria-hidden='true'></span>
                        <span className='visually-hidden'>Next</span>
                    </button>
                </div>

                {/* Mobile */}
                <div className='d-lg-none mt-3'>
                    <div className='row d-flex justify-content-center align-items-center'>
                       {books[0] ? <ReturnBook booky={books[0]} key={books[0].id} /> : <></> }
                    </div>
                </div>
                <div className='homepage-carousel-title mt-3'>
                    <Link className="btn btn-lg btn-outline-secondary" to="/search">View More</Link>
                </div>
            </div>
        </div>
    );
}

export default Carousal;