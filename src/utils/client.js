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

const dummyRequest = (data) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(data);
  }, 2000);
})

const createClient = () => {
  const fetchRecords = async () => {
    return dummyRequest(initialDataSource);
  };

  const updateRecords = async (rows) => {
    console.info('updateRecords:', rows);

    return dummyRequest(rows.map((row) => {
      if (row.id) {
        return { ...row, editable: false };
      } else {
        return {
          ...row,
          key: null,
          id: Math.floor(Date.now() / 1000) % 100000,
        }
      }
    }));
  };

  const deleteRecords = async (ids) => {
    console.info('deleteRecords:', ids);
    return dummyRequest(null);
  };

  return {
    fetchRecords,
    updateRecords,
    deleteRecords,
  };
};

const client = createClient();

export default client;
