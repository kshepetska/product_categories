/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';
import classNames from 'classnames';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

function getPreparedUsers(users, query) {
  const normalizedQuery = query.trim().toLowerCase();

  return users
    .filter(user => user.name.toLowerCase().includes(normalizedQuery))
    .map(user => ({
      ...user,
      name: user.name.toLowerCase(),
    }));
}

function getOwnerClassName(sex = 'm') {
  return sex === 'm' ? 'has-text-link' : 'has-text-danger';
}

function getPreparedProducts(products, options, users, categories) {
  const { query = '', user = null, selectedCategories = [] } = options;

  let preparedProducts = [...products];

  const normalizedQuery = query.trim().toLowerCase();

  if (normalizedQuery) {
    preparedProducts = preparedProducts
      .filter(product => product.name.toLowerCase().includes(normalizedQuery));
  }

  if (user) {
    preparedProducts = preparedProducts
      .filter(product => product.user === user);
  }

  if (selectedCategories.length > 0) {
    preparedProducts = preparedProducts
      .filter(product => selectedCategories.includes(product.category));
  }

  return preparedProducts.map(product => ({
    ...product,
    userName: users.find(u => u.id === product.user)?.name || '',
    categoryName: categories.find(c => c.id === product.category)?.title || '',
    categoryIcon: categories.find(c => c.id === product.category)?.icon || '',
  }));
}

export function App() {
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [query, setQuery] = useState('');

  const addProduct = (product) => {
    setSelectedProduct([...selectedProduct, product]);
  };

  const isSelected = ({ id }) => selectedProduct.some(p => p.id === id);

  const removeProduct = (product) => {
    setSelectedProduct(selectedProduct.filter(p => p.id !== product.id));
  };

  const clearFilters = () => {
    setSelectedUser(null);
    setSelectedCategories([]);
    setQuery('');
    setSelectedProduct([]);
  };

  const preparedUsers = getPreparedUsers(usersFromServer, query);

  const visibleProducts = getPreparedProducts(productsFromServer, {
    query,
    user: selectedUser,
    selectedCategories,
  }, usersFromServer, categoriesFromServer);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <div className="panel-tabs has-text-weight-bold">
              <a
                href="#/"
                role="button"
                tabIndex="0"
                className={classNames('button', { 'is-active': !selectedUser })}
                onClick={() => setSelectedUser(null)}
              >
                All
              </a>
              {preparedUsers.map(user => (
                <a
                  key={user.id}
                  href="#/"
                  role="button"
                  tabIndex="0"
                  className={classNames('button',
                    { 'is-active': selectedUser === user.id })}
                  onClick={() => setSelectedUser(user.id)}
                >
                  {user.name}
                </a>
              ))}
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <button
                type="button"
                className={classNames('button is-success mr-6 is-outlined', {
                  'is-active': selectedCategories.length === 0,
                })}
                onClick={() => setSelectedCategories([])}
              >
                All
              </button>

              {visibleProducts.map(product => (
                <a
                  key={product.id}
                  data-cy="Category"
                  className={classNames('button mr-2 my-1', {
                    'is-info': isSelected(product),
                  })}
                  href="#/"
                  onClick={() => (isSelected(product)
                    ? removeProduct(product) : addProduct(product))}
                >
                  {product.category}
                </a>
              ))}

            </div>

            <div className="panel-block">
              <button
                type="button"
                className="button is-link is-outlined is-fullwidth"
                onClick={clearFilters}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    clearFilters();
                  }
                }}
              >
                Reset all filters
              </button>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length === 0 && (
            <p>No products matching selected criteria</p>
          )}
          <table className="table is-striped is-narrow is-fullwidth">
            <thead>
              <tr>
                <th>ID</th>
                <th>Product</th>
                <th>Category</th>
                <th>User</th>
              </tr>
            </thead>

            <tbody>
              {visibleProducts.map(product => (
                <tr key={product.id}>
                  <td className="has-text-weight-bold">{product.id}</td>

                  <td>{product.name}</td>
                  <td>
                    <span role="img" aria-label="Category Icon">
                      {product.categoryIcon}
                    </span>
                    {' '}
                    {product.categoryName}
                  </td>

                  <td className={getOwnerClassName(usersFromServer
                    .find(u => u.id === product.user)?.sex)}
                  >
                    {product.userName}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
