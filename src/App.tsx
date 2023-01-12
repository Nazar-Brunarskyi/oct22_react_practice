import React, { useEffect, useState } from 'react';
import './App.scss';
import cn from 'classnames';

import usersFromServer from './api/users';
import { Product } from './types/product';
import productsFromServer from './api/products';
import { findFullCategory } from './helpers';
import categoriesFromServer from './api/categories';
import { ProductComponent } from './components/Product';
import { UserComponent } from './components/User';

export const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedUser, setSelectedUser] = useState(0);

  useEffect(() => {
    const productsToSet: Product[] = productsFromServer
      .map(product => {
        const { categoryId } = product;
        const category = findFullCategory(
          categoryId,
          categoriesFromServer,
          usersFromServer,
        );

        return {
          ...product,
          category,
        };
      });

    setProducts(productsToSet);
  }, []);

  const selectedUserName = usersFromServer
    .find(user => user.id === selectedUser)?.name;

  const visibleProducts = selectedUser === 0
    ? products
    : products
      .filter(product => product.category?.owner?.name === selectedUserName);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                className={cn({ 'is-active': selectedUser === 0 })}
                onClick={() => setSelectedUser(0)}
              >
                All
              </a>

              {
                usersFromServer.map(user => (
                  <UserComponent
                    key={user.id}
                    user={user}
                    selectedUser={selectedUser}
                    onSelect={setSelectedUser}
                  />
                ))
              }
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value="qwe"
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  <button
                    data-cy="ClearButton"
                    type="button"
                    className="delete"
                  />
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className="button is-success mr-6 is-outlined"
              >
                All
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 1
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 2
              </a>

              <a
                data-cy="Category"
                className="button mr-2 my-1 is-info"
                href="#/"
              >
                Category 3
              </a>
              <a
                data-cy="Category"
                className="button mr-2 my-1"
                href="#/"
              >
                Category 4
              </a>
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"

              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          <p data-cy="NoMatchingMessage">
            No products matching selected criteria
          </p>

          <table
            data-cy="ProductTable"
            className="table is-striped is-narrow is-fullwidth"
          >
            <thead>
              <tr>
                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    ID

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Product

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-down" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    Category

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort-up" />
                      </span>
                    </a>
                  </span>
                </th>

                <th>
                  <span className="is-flex is-flex-wrap-nowrap">
                    User

                    <a href="#/">
                      <span className="icon">
                        <i data-cy="SortIcon" className="fas fa-sort" />
                      </span>
                    </a>
                  </span>
                </th>
              </tr>
            </thead>

            <tbody>
              {
                visibleProducts.map(product => (
                  <ProductComponent key={product.id} product={product} />
                ))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
