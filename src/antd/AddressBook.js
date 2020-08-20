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

const ID_ADD = -1;
const initialAddRow = {
  id: ID_ADD,
  name: '',
  location: '',
  office: '',
  phoneOffice: '',
  phoneCell: '',
  rowClassName: styles.addRow,
  editable: true,
};

const AddressBook = () => {
  const [dataSource, setDataSource] = useState(() => initialDataSource);
  const [addRow, setAddRow] = useState(() => initialAddRow);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const getCheckboxProps = useCallback((record) => ({
    disabled: record.rowClassName === styles.addRow,
  }), []);

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys,
      onChange: setSelectedRowKeys,
      getCheckboxProps,
    }),
    [selectedRowKeys, getCheckboxProps, setSelectedRowKeys],
  );

  useEffect(() => {
    setSelectedRowKeys(
      (keys) =>
        dataSource
          .map((row) => row.id)
          .filter((key) => keys.includes(key)),
    );
  }, [dataSource, setSelectedRowKeys]);

  const rowClassName = useCallback((record) => record.rowClassName || '', []);

  const deleteRows = useCallback(
    async () => {
      await client.deleteRecords(selectedRowKeys);
      setDataSource((records) => records.filter((record) => !selectedRowKeys.includes(record.id)));
    },
    [selectedRowKeys, setDataSource],
  );

  const cellChange = useCallback((id, key) => (e) => {
    const value = e.target.value;

    if (id === ID_ADD) {
      setAddRow((prev) => ({
        ...prev,
        [key]: value,
      }))
    }
  }, [setAddRow]);

  const editableCell = useCallback(
    (key) => (cell, record) => (record.editable) ? (
      <input
        className={styles.edit}
        value={cell}
        onChange={cellChange(record.id, key)}
      />
    ) : (
      <div>{cell}</div>
    ),
    [cellChange],
  );

  const invalidAddRow = useMemo(
    () => !Object.keys(addRow).reduce((acc, key) => acc && addRow[key] !== '', true),
    [addRow],
  );

  const addNewRow = useCallback(
    async () => {
      const newRow = await client.createRecord({
        ...addRow,
        rowClassName: '',
        editable: '',
      });
      setDataSource((prev) => prev.concat(newRow));
      setAddRow(initialAddRow);
    },
    [addRow, setDataSource, setAddRow],
  );

  const dataWithAdd = useMemo(() => dataSource.concat(addRow), [dataSource, addRow]);

  return (
    <div className={'addressBook'}>
      <div className={styles.title}>{t('Address Book')}</div>
      <Table
        dataSource={dataWithAdd}
        rowKey={'id'}
        pagination={false}
        rowSelection={rowSelection}
        rowClassName={rowClassName}
      >
        <Table.Column
          key={'id'}
          title={t('ID')}
          dataIndex={'id'}
          render={(value) => <div>{value}</div>}
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
            disabled={selectedRowKeys.length === 0}
            onClick={deleteRows}
          >
            {t('Delete')}
          </Button>
        </div>
        <div className={styles.right}>
          <Button className={styles.update}>{t('Update')}</Button>
          <Button
            className={styles.add}
            disabled={invalidAddRow}
            onClick={addNewRow}
          >
            {t('Add')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddressBook;
