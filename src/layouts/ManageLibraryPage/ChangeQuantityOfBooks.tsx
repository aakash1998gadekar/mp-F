import { useEffect, useState } from "react";
import BookModel from "../../models/BookModel";
import { Pagination } from "../utils/Pagination";
import { ChangeQuantityOfBook } from "./components/ChangeQuantityOfBook";

export const ChangeQuantityofBooks = () => {

    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage, setBooksPerPage] = useState(5);
    const [totalBooks, setTotalBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    const [bookDelete, setBookDelete] = useState(false);

    useEffect(() => {

        const fetchBooks = async () => {
            const baseUrl: string = `/api/books?page=${currentPage - 1}&size=${booksPerPage}`;

            const response = await fetch(baseUrl);

            if (!response.ok) {
                throw new Error("Something went wrong");
            }

            const responseJson = await response.json();
            const responseData = responseJson._embedded.books;
            setTotalBooks(responseJson.page.totalElements);
            setTotalPages(responseJson.page.totalPages);

            const loadedBooks: BookModel[] = [];
            for (const key in responseData) {
                loadedBooks.push({
                    id: responseData[key].id,
                    title: responseData[key].title,
                    author: responseData[key].author,
                    description: responseData[key].description,
                    copies: responseData[key].copies,
                    copies_available: responseData[key].copiesAvailable,
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
    }, [currentPage, bookDelete]);

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

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber)
    };

    const deleteBookOrNot = () => {
        setBookDelete(!bookDelete);
    }

    return (
        <div className="mt-3">
            {totalBooks > 0 ?
                <>
                    <h3>Number of results: ({totalBooks})</h3>
                    {books.map(book => (
                        <ChangeQuantityOfBook book={book} deleteBookOrNot={deleteBookOrNot}/>
                    ))}
                </>


                :
                <h5>Add a book before changing the quantity</h5>
            }
            {totalPages >= 1 &&
                <Pagination currentPage={currentPage}
                    totalPages={totalPages}
                    paginate={paginate} />
            }
        </div>
    );
}