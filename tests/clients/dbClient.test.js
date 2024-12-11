const dbClient = require('../path/to/dbClient'); // Adjust path as needed

describe('dbClient', () => {
  it('should connect to the database', async () => {
    const connectSpy = jest.spyOn(dbClient, 'connect');
    await dbClient.connect();
    expect(connectSpy).toHaveBeenCalled();
  });

  it('should insert a user into the database', async () => {
    const mockInsert = jest.spyOn(dbClient, 'insert').mockResolvedValue({ id: 1, name: 'John' });
    const result = await dbClient.insert('users', { name: 'John' });
    expect(result).toEqual({ id: 1, name: 'John' });
  });

  it('should throw an error if inserting fails', async () => {
    jest.spyOn(dbClient, 'insert').mockRejectedValue(new Error('DB error'));
    await expect(dbClient.insert('users', { name: 'John' })).rejects.toThrow('DB error');
  });
});
