import gql from 'graphql-tag';
import {Suspense} from 'react';
import Header from './header/Header.client.jsx';
import Footer from './Footer.server';
import Cart from './Cart.client';
import PreHeaderBar from './header/PreHeaderBar.server.jsx';
import {useShopQuery,  flattenConnection, LocalizationProvider} from '@shopify/hydrogen';
import {getMenu} from '../helpers/get-menu.js';
import * as fs from 'fs';

/**
 * A server component that defines a structure and organization of a page that can be used in different parts of the Hydrogen app
 */
export default function Layout({children, hero}) {
  const {data} = useShopQuery({
    query: QUERY,
    variables: {
      numCollections: 14,
      numProducts: 3,
    },
    cache: {
      maxAge: 60,
      staleWhileRevalidate: 60 * 10,
    },
  });
  const collections = data ? flattenConnection(data.collections) : null;
  const products = data ? flattenConnection(data.products) : null;
  const storeName = data ? data.shop.name : '';
  const menu = getMenu();

  return (
    <LocalizationProvider>
      <div className="absolute top-0 left-0">
        <a
          href="#mainContent"
          className="p-4 focus:block sr-only focus:not-sr-only"
        >
          Skip to content
        </a>
      </div>
      <div className="min-h-screen max-w-screen text-gray-700 font-sans">
        {/* TODO: Find out why Suspense needs to be here to prevent hydration errors. */}
        <Suspense fallback={null}>
          <PreHeaderBar />
          <Header collections={collections} storeName={storeName} menu={menu} />
          <Cart />
        </Suspense>
        <main role="main" id="mainContent" className="relative bg-gray-50">
          {hero}
          <div className="mx-auto max-w-7xl p-4 md:py-5 md:px-8">
            {children}
          </div>
        </main>
        <Footer collection={collections[0]} product={products[0]} />
      </div>
    </LocalizationProvider>
  );
}

const QUERY = gql`
  query indexContent($numCollections: Int!) {
    shop {
      name
    }
    collections(first: $numCollections) {
      edges {
        node {
          description
          handle
          id
          title
        }
      }
    }
    products(first: 1) {
      edges {
        node {
          handle
        }
      }
    }
  }
`;
// console.log(QUERY);
