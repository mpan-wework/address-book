import React from 'react';
import { default as AddressBookAntd } from './antd/AddressBook';
import { default as AddressBookPlain } from './plain/AddressBook';
import styles from './App.module.css';

const AddressBook = process.env.SOME_VAR === 'expected' ? AddressBookPlain : AddressBookAntd;

const App = () => (
  <div className={styles.App}>
    <AddressBook />
  </div>
);

export default App;
