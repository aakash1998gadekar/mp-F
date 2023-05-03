import './App.css';
import { Navbar } from './layouts/navbarAndFooter/Navbar';
import { Footer } from './layouts/navbarAndFooter/Footer';
import { HomePage } from './layouts/HomePage/HomePage';
import { SearchBookPage } from './layouts/SearchBookPage/SearchBookPage';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { BookCheckoutPage } from './layouts/BookCheckoutPage/BookCheckoutPage';
import { OktaConfig } from './lib/OktaConfig';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import { LoginCallback, SecureRoute, Security } from '@okta/okta-react';
import LoginWidget from './Auth/LoginWidget';
import { ShelfPage } from './layouts/ShelfPage/ShelfPage';
import { MessagesPage } from './layouts/MessagesPage/MessagesPage';
import { ManageLibraryPage } from './layouts/ManageLibraryPage/ManageLibraryPage';

const oktaAuth = new OktaAuth(OktaConfig);
function App() {

  const customAuthHandler = () => {
    history.push('/login');
  }

  const history = useHistory();

  const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
    history.replace(toRelativeUrl(originalUri || '/', window.location.origin));
  };

  return (
    <div className='d-flex flex-column min-vh-100'>
      <Security oktaAuth={oktaAuth}
        restoreOriginalUri={restoreOriginalUri}
        onAuthRequired={customAuthHandler}>
        <Navbar />
        {/* Switch helps in  handling the rendering 
      of single route. Before , both homepage and 
      search page was rendering. Also, always home page 
      was rendering as "/"" matches even of we do "/search".
      In order to handle that, we used exactl*/}
        <div className='flex-grow-1'>
          <Switch>
            <Route path="/" exact>
              <Redirect to='/home' />
            </Route>
            <Route path="/home">
              <HomePage />
            </Route>
            <Route path='/search'>
              <SearchBookPage />
            </Route>
            <Route path='/checkout/:bookId'>
              <BookCheckoutPage />
            </Route>
            <Route path='/login' render={
              () => <LoginWidget config={OktaConfig} />
            }
            />
            <Route path="/login/callback" component={LoginCallback} />
            <SecureRoute path="/shelf"><ShelfPage/></SecureRoute>
            <SecureRoute path="/messages"><MessagesPage/></SecureRoute>
            <SecureRoute path="/admin"><ManageLibraryPage/></SecureRoute>
          </Switch>
        </div>
        <Footer />
      </Security>
    </div>
  );
}

export default App;
