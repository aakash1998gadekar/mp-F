import { useEffect, useState } from "react"
import BookModel from "../../models/BookModel"
import { SearchBook } from "./components/SearchBook";
import { Pagination } from "../utils/Pagination";

export const SearchBookPage = () => {

    const [books, setBooks] = useState<BookModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [booksPerPage, setBooksPerPage] = useState(5);
    const [totalBooks, setTotalBooks] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [search, setSearch] = useState('');
    const [searchUrl, setSearchUrl] = useState('');
    const [category, setCategory] = useState('Books Category');

    useEffect(() => {

        const fetchBooks = async () => {
            const baseUrl: string = `/api/books`;
            let url: string = '';

            if (searchUrl == '') {
                url = `${baseUrl}?page=${currentPage - 1}&size=${booksPerPage}`;
            } else {
                let searchWithPage = searchUrl.replace('<pageNumber>', `${currentPage-1}`);
                url = baseUrl + searchWithPage;
            }
            
            const response = await fetch(url);

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
        window.scrollTo(0, 0);
    }, [currentPage, searchUrl]);

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

    const searchHandleChange = () => {
        setCurrentPage(1); // this is added so that if page number was already set to 2 
                            // and some search occured where only single page is required, since pageNumber was set to 2
                            // already, it will show no result. Therefore, we set the page 
                            // to 1 default and if less records happen, it will show correctly;
                            // demo: search java and go to 2nd page. Now search ra and see the result
                            // before and after this line.
        if (search == "") {
            setSearchUrl("");
        } else {
            setSearchUrl(`/search/findByTitleContaining?title=${search}&page=<pageNumber>&size=${booksPerPage}`)
        }
        setCategory("Books Category");
    }

    const categoryField = (value: string) => {
        setCurrentPage(1);
        if (
            value.toLowerCase() === 'fe' || 
            value.toLowerCase() === 'be' || 
            value.toLowerCase() === 'data' || 
            value.toLowerCase() === 'devops'
        ) {
            setCategory(value);
            setSearchUrl(`/search/findByCategory?category=${value}&page=<pageNumber>&size=${booksPerPage}`)
        } else {
            setCategory('All');
            setSearchUrl(`?page=0&size=${booksPerPage}`)
        }
    }

    const lastIndexofBookonCurrentPage: number = currentPage * booksPerPage;
    const firstIndexOfBook: number = lastIndexofBookonCurrentPage - booksPerPage + 1;
    let numberOfBooksCurrentlyAvailable = lastIndexofBookonCurrentPage <= totalBooks ? lastIndexofBookonCurrentPage : totalBooks;

    const paginate = (pageNumber: number) => {
        setCurrentPage(pageNumber)};
    return (
        <div>
            <div className="container">
                <div>
                    <div className="row mt-5">
                        <div className="col-6">
                            <div className="d-flex">
                                <input className="form-control me-2" type="search"
                                    placeholder="Search" aria-labelledby="Search"
                                    onChange={e => setSearch(e.target.value)} />
                                <button className="btn btn-outline-success"
                                    onClick={() => { searchHandleChange() }}>
                                    Search
                                </button>
                            </div>
                        </div>
                        <div className="col-4">
                            <div className="dropdown">
                                <button className="btn btn-secondary dropdown-toggle" type="button"
                                    id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                                    {category}
                                </button>
                                <ul className="dropdown-menu" aria-labelledby='dropdownMenuButton1'>
                                    <li onClick={e => categoryField("All")}>
                                        <a href="#" className="dropdown-item">
                                            All
                                        </a>
                                    </li>
                                    <li onClick={e => categoryField("FE")}>
                                        <a href="#" className="dropdown-item">
                                            Front end
                                        </a>
                                    </li>
                                    <li onClick={e => categoryField("BE")}>
                                        <a href="#" className="dropdown-item">
                                            Back end
                                        </a>
                                    </li>
                                    <li onClick={e => categoryField("DATA")}>
                                        <a href="#" className="dropdown-item">
                                            Data
                                        </a>
                                    </li>
                                    <li onClick={e => categoryField("DEVOPS")}>
                                        <a href="#" className="dropdown-item">
                                            Devops
                                        </a>
                                    </li>
                                </ul>

                            </div>
                        </div>
                    </div>
                    {totalBooks > 0 ?
                        <>
                            <div className="mt-3">
                                <h5>Number of results: ({totalBooks})</h5>
                            </div>
                            <p>
                                {firstIndexOfBook} to {numberOfBooksCurrentlyAvailable} of {totalBooks} items:
                            </p>
                            {books.map(book => (
                                <SearchBook book={book} key={book.id} />
                            ))}
                        </>
                        :
                        <div className="m-5">
                            <h3>Can't find what you are looking for?</h3>
                            <a type="button" className="btn main-color btn-md px-4 m3-md-2 fw-bold text-white" href="#">Access Library Services</a>
                        </div>
                    }

                    {totalPages >= 1 &&
                        <Pagination currentPage={currentPage}
                            totalPages={totalPages}
                            paginate={paginate} />
                    }
                </div>
            </div>
        </div>
    );
}