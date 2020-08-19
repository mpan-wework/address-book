import React, { useState } from 'react';
import { Button, Table } from 'antd';
import { t } from '../utils/i18n';
import styles from './AddressBook.module.css';

const AddressBook = () => {
  const [dataSource] = useState([
    {
      id: 501,
      name: 'Khall Zhang',
      location: 'Shanghai',
      office: 'C-103',
      phoneOffice: 'x55778',
      phoneCell: '650-353-1239',
    }
  ]);

  return (
    <div className={'addressBook'}>
      <div className={styles.title}>{t('Address Book')}</div>
      <Table dataSource={dataSource} rowKey={'id'} pagination={false}>
        <Table.Column key={'id'} title={t('ID')} dataIndex={'id'} />
        <Table.Column key={'name'} title={t('Name')} dataIndex={'name'} />
        <Table.Column key={'location'} title={t('Location')} dataIndex={'location'} />
        <Table.Column key={'office'} title={t('Office')} dataIndex={'office'} />
        <Table.ColumnGroup key={'phone'} title={t('Phone')}>
          <Table.Column key={'phoneOffice'} title={t('Office')} dataIndex={'phoneOffice'} />
          <Table.Column key={'phoneCell'} title={t('Cell')} dataIndex={'phoneCell'} />
        </Table.ColumnGroup>
      </Table>
      <div className={styles.buttons}>
        <div className={styles.left}>
          <Button className={styles.delete}>{t('Delete')}</Button>
        </div>
        <div className={styles.right}>
          <Button className={styles.update}>{t('Update')}</Button>
          <Button className={styles.add}>{t('Add')}</Button>
        </div>
      </div>
    </div>
  );
};

export default AddressBook;
