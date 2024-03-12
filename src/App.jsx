/* eslint-disable jsx-a11y/accessible-emoji */
import React, { useState } from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

export const App = () => {
  // Mock data
  const products = productsFromServer.map((product) => {
    const category = categoriesFromServer
      .find(c => c.id === product.categoryId);
    const user = usersFromServer.find(u => u.id === category.ownerId);

    return {
      ...product,
      categoryName: `${category.icon} - ${category.title}`,
      owner: user,
    };
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const renderOwnerName = user => (
    <span className={user.sex === 'm' ? 'has-text-link' : 'has-text-danger'}>
      {user.name}
    </span>
  );

  const filterProductsByOwner = (user) => {
    setSelectedUser(user);
  };

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  const filteredProducts = products
    .filter(product => selectedUser === null || product.owner === selectedUser)
    .filter(product => product.name.toLowerCase()
      .includes(searchQuery.toLowerCase()));

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                href="#/"
                role="button"
                className={`button ${selectedUser === null ? 'is-active' : ''}`}
                onClick={() => filterProductsByOwner(null)}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  key={user.id}
                  href="#/"
                  role="button"
                  className={`button ${selectedUser === user ? 'is-active' : ''}`}
                  onClick={() => filterProductsByOwner(user)}
                >
                  {user.name}
                </a>
              ))}
            </p>
          </nav>
        </div>

        <div className="box table-container">
          <div className="field has-addons">
            <p className="control is-expanded">
              <input
                type="text"
                className="input"
                placeholder="Search by name"
                value={searchQuery}
                onChange={handleSearchInputChange}
              />
            </p>
            <p className="control">
              <button
                type="button"
                className="delete is-danger"
                onClick={clearSearch}
              />
            </p>
          </div>

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
              {filteredProducts.map(product => (
                <tr key={product.id}>
                  <td className="has-text-weight-bold">{product.id}</td>
                  <td>{product.name}</td>
                  <td>{product.categoryName}</td>
                  <td>{renderOwnerName(product.owner)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default App;
