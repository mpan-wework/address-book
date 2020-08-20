const dummyRequest = (data) => new Promise((resolve) => {
  setTimeout(() => {
    resolve(data);
  }, 2000);
})

const createClient = () => {
  const createRecord = async (row) => {
    console.info('createRecord:', row)
    return dummyRequest({
      ...row,
      id: Math.floor(Date.now() / 1000) % 100000,
    });
  };

  const updateRecord = async (id, row) => {
    console.info('updateRecord:', id, row);
    return dummyRequest(row);
  };

  const deleteRecords = async (ids) => {
    console.info('deleteRecords:', ids);
    return dummyRequest(null);
  };

  return {
    createRecord,
    updateRecord,
    deleteRecords,
  };
};

const client = createClient();

export default client;
