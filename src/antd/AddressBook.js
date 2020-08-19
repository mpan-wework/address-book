import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Table } from 'antd';
import { t } from '../utils/i18n';
import client from '../utils/client';
import styles from './AddressBook.module.css';

const initialDataSource = [
  {
    id: 501,
    name: 'Khall Zhang',
    location: 'Shanghai',
    office: 'C-103',
    phoneOffice: 'x55778',
    phoneCell: '650-353-1239',
  },
  {
    id: 502,
    name: 'Khall Zhang',
    location: 'Shanghai',
    office: 'C-103',
    phoneOffice: 'x55778',
    phoneCell: '650-353-1239',
  },
];

const AddressBook = () => {
  const [dataSource, setDataSource] = useState(() => initialDataSource);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys,
      onChange: setSelectedRowKeys,
    }),
    [selectedRowKeys, setSelectedRowKeys],
  );

  useEffect(() => {
    setSelectedRowKeys(
      (keys) =>
        dataSource
          .map((row) => row.id)
          .filter((key) => keys.includes(key)),
    );
  }, [dataSource, setSelectedRowKeys]);

  const deleteRows = useCallback(
    async () => {
      await client.deleteRecords(selectedRowKeys);
      setDataSource((records) => records.filter((record) => !selectedRowKeys.includes(record.id)));
    },
    [selectedRowKeys, setDataSource],
  );

  return (
    <div className={'addressBook'}>
      <div className={styles.title}>{t('Address Book')}</div>
      <Table
        dataSource={dataSource}
        rowKey={'id'}
        pagination={false}
        rowSelection={rowSelection}
      >
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
          <Button
            className={styles.delete}
            disabled={selectedRowKeys.length === 0}
            onClick={deleteRows}
          >
            {t('Delete')}
          </Button>
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
