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
import { CategoryComponent } from './components/Category';

export const App: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedUser, setSelectedUser] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.currentTarget.value;

    setInputValue(newValue);
  };

  const handleClearInput = () => {
    setInputValue('');
  };

  const handleResetAll = () => {
    setSelectedUser(0);
    setInputValue('');
    setSelectedCategories([]);
  };

  const handleAllCategoriesButtonClick = () => {
    setSelectedCategories([]);
  };

  const selectedUserName = usersFromServer
    .find(user => user.id === selectedUser)?.name;

  let visibleProducts = selectedUser === 0
    ? products
    : products
      .filter(product => product.category?.owner?.name === selectedUserName);

  visibleProducts = visibleProducts.filter(product => {
    const lowerCaseProductName = product.name.toLowerCase();
    const lowerCaseInputValue = inputValue.trim().toLowerCase();

    return lowerCaseProductName.includes(lowerCaseInputValue);
  });

  visibleProducts = selectedCategories.length === 0
    ? visibleProducts
    : visibleProducts.filter(product => {
      if (product.category) {
        return selectedCategories.includes(product.category?.id);
      }

      return false;
    });

  const haveBeenAnyProductsFound = visibleProducts.length > 0;

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
                  value={inputValue}
                  onChange={handleInputChange}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                {
                  inputValue && (
                    <span className="icon is-right">
                      {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                      <button
                        data-cy="ClearButton"
                        type="button"
                        className="delete"
                        onClick={handleClearInput}
                      />
                    </span>
                  )
                }
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={cn(
                  'button is-success mr-6',
                  { 'is-outlined': selectedCategories.length !== 0 },
                )}
                onClick={handleAllCategoriesButtonClick}
              >
                All
              </a>

              {
                categoriesFromServer.map(category => (
                  <CategoryComponent
                    key={category.id}
                    category={category}
                    selectedCategories={selectedCategories}
                    onSelect={setSelectedCategories}
                  />
                ))
              }
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={handleResetAll}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">

          {haveBeenAnyProductsFound
            ? (
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
                            <i
                              data-cy="SortIcon"
                              className="fas fa-sort-down"
                            />
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
            )
            : (
              <p data-cy="NoMatchingMessage">
                No products matching selected criteria
              </p>
            )}

        </div>
      </div>
    </div>
  );
};
