import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, Table } from 'antd';
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

const initialRow = {
  name: '',
  location: '',
  office: '',
  phoneOffice: '',
  phoneCell: '',
  editable: true,
};

const AddressBook = () => {
  const [existing, setExisting] = useState(() => initialDataSource);
  const [added, setAdded] = useState([]);

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
        existing
          .concat(added)
          .map((row) => row.id || row.key)
          .filter((key) => keys.includes(key)),
    );
  }, [existing, added, setSelectedRowKeys]);

  const deleteRows = useCallback(
    async () => {
      await client.deleteRecords(selectedRowKeys);
      setExisting((prev) => prev.filter((record) => !selectedRowKeys.includes(record.id)));
    },
    [selectedRowKeys, setExisting],
  );

  const deletableSelected = useMemo(
    () => selectedRowKeys
      .map((key) => existing.find((row) => row.id === key))
      .filter(Boolean),
    [selectedRowKeys, existing],
  );

  const addRow = useCallback(
    () => {
      setAdded((prev) => prev.concat({
        ...initialRow,
        key: Date.now(),
      }));
    },
    [setAdded],
  );

  const dataSourceWithKeys = useMemo(
    () => existing.map((row) => ({ ...row, key: row.id })).concat(added),
    [existing, added],
  );

  const editCell = useCallback((record, key) => (e) => {
    const value = e.target.value;
    const cb = (prev) => {
      const pos = prev.findIndex(
        (row) => record.id
          ? (record.id === row.id)
          : (record.key === row.key),
      );

      if (pos === -1) {
        return prev;
      }

      return prev.slice(0, pos)
        .concat({
          ...prev[pos],
          [key]: value,
        })
        .concat(prev.slice(pos+1))
    };
    setExisting(cb);
    setAdded(cb)
  }, [setExisting, setAdded]);

  const editableCell = useCallback(
    (key) => (value, record) => !record.id ? (
      <Input value={value} onChange={editCell(record, key)} />
    ) : (
      <div>{value}</div>
    ),
    [editCell]
  );

  return (
    <div className={'addressBook'}>
      <div className={styles.title}>{t('Address Book')}</div>
      <Table
        dataSource={dataSourceWithKeys}
        pagination={false}
        rowSelection={rowSelection}
      >
        <Table.Column
          key={'id'}
          title={t('ID')}
          dataIndex={'id'}
        />
        <Table.Column
          key={'name'}
          title={t('Name')}
          dataIndex={'name'}
          render={editableCell('name')}
        />
        <Table.Column
          key={'location'}
          title={t('Location')}
          dataIndex={'location'}
          render={editableCell('location')}
        />
        <Table.Column
          key={'office'}
          title={t('Office')}
          dataIndex={'office'}
          render={editableCell('office')}
        />
        <Table.ColumnGroup
          key={'phone'}
          title={t('Phone')}
        >
          <Table.Column
            key={'phoneOffice'}
            title={t('Office')}
            dataIndex={'phoneOffice'}
            render={editableCell('phoneOffice')}
          />
          <Table.Column
            key={'phoneCell'}
            title={t('Cell')}
            dataIndex={'phoneCell'}
            render={editableCell('phoneCell')}
          />
        </Table.ColumnGroup>
      </Table>
      <div className={styles.buttons}>
        <div className={styles.left}>
          <Button
            className={styles.delete}
            disabled={deletableSelected.length === 0}
            onClick={deleteRows}
          >
            {t('Delete')}
          </Button>
        </div>
        <div className={styles.right}>
          <Button
            className={styles.update}
            disabled={selectedRowKeys.length === 0}
          >
            {t('Update')}
          </Button>
          <Button
            className={styles.add}
            onClick={addRow}
          >
            {t('Add')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddressBook;
