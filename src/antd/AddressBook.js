import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Input, Table } from 'antd';
import { t } from '../utils/i18n';
import client from '../utils/client';
import styles from './AddressBook.module.css';

const initialRow = {
  name: '',
  location: '',
  office: '',
  phoneOffice: '',
  phoneCell: '',
};

const AddressBook = () => {
  const [existing, setExisting] = useState([]);
  const [added, setAdded] = useState([]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  useEffect(() => {
    (async () => {
      setExisting(await client.fetchRecords());
    })();
  }, [setExisting]);

  const rowSelection = useMemo(() => ({
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  }), [selectedRowKeys, setSelectedRowKeys]);

  useEffect(() => {
    setSelectedRowKeys(
      (keys) =>
        existing
          .concat(added)
          .map((row) => row.id || row.key)
          .filter((key) => keys.includes(key)),
    );
  }, [existing, added, setSelectedRowKeys]);

  const deleteRows = useCallback(async () => {
    await client.deleteRecords(selectedRowKeys);
    setExisting(
      (prev) => prev.filter((record) => !selectedRowKeys.includes(record.id)),
    );
    setAdded(
      (prev) => prev.filter((record) => !selectedRowKeys.includes(record.key)),
    );
  }, [selectedRowKeys, setExisting, setAdded]);

  const deletableSelected = useMemo(
    () => selectedRowKeys
      .map((key) => existing.find((row) => row.id === key))
      .filter(Boolean),
    [selectedRowKeys, existing],
  );

  const addRow = useCallback(() => {
    setAdded((prev) => prev.concat({
      ...initialRow,
      key: Date.now(),
    }));
  }, [setAdded]);

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
        .concat(prev.slice(pos + 1))
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

  const onCellClick = useCallback((record) => () => {
    if (record.id && !record.editable) {
      const cb = (prev) => {
        const pos = prev.findIndex((row) => record.id === row.id);

        if (pos === -1) {
          return prev;
        }

        return prev.slice(0, pos)
          .concat({
            ...prev[pos],
            editable: true,
          })
          .concat(prev.slice(pos + 1))
      };
      setExisting(cb);
    }
  }, [setExisting]);

  const phoneCell = useCallback(
    (value, record) => {
      if (!record.id || record.editable) {
        return <Input value={value} onChange={editCell(record, 'phoneCell')} />
      } else {
        return <div onClick={onCellClick(record)}>{value}</div>
      }
    },
    [editCell, onCellClick],
  );

  const updateRows = useCallback(
    async () => {
      const records = selectedRowKeys.map((key) => {
        const exisitingRow = existing.find((row) => row.id === key);
        if (exisitingRow) {
          return exisitingRow;
        }
        const addedRow = added.find((row) => row.key === key);
        if (addedRow) {
          return addedRow;
        }

        return null;
      }).filter(Boolean);

      const updated = await client.updateRecords(records);

      setExisting((prev) => {
        for (let i = 0, l = updated.length; i < l; i += 1) {
          const pos = prev.findIndex((row) => row.id === updated[i].id);
          if (pos === -1) {
            prev = prev.concat(updated[i]);
          } else {
            prev = prev.slice(0, pos).concat(updated[i]).concat(prev.slice(pos + 1));
          }
        };

        return prev;
      });
      setAdded((prev) => prev.filter((row) => !selectedRowKeys.includes(row.key)));
      setSelectedRowKeys((prev) => prev.filter((key) => !selectedRowKeys.includes(key)));
    },
    [selectedRowKeys, existing, added, setExisting, setAdded, setSelectedRowKeys],
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
            render={phoneCell}
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
            onClick={updateRows}
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
