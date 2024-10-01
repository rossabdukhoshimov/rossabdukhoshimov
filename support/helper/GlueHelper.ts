import { GlueClient, GetDatabaseCommand, GetTableCommand, GetTablesCommand, DeleteTableCommand } from '@aws-sdk/client-glue';

// Initialize Glue client
const glueClient = new GlueClient({ region: 'us-east-1' }); // Set your region here

export default class GlueHelper {
    /**
     * To check if a database exists in AWS Glue
     * @param databaseName - Name of the database
     * @returns - Promise resolving to boolean indicating if the database exists
     */
    public static async checkDatabaseExists(databaseName: string): Promise<boolean> {
        try {
            await glueClient.send(new GetDatabaseCommand({ Name: databaseName }));
            return true;
        } catch (err) {
            if (err.name === 'EntityNotFoundException') {
                return false;
            }
            console.error('Error checking database existence:', err);
            throw err; // Rethrow the error to be handled by the caller
        }
    }

    /**
     * To check if a table exists in a database
     * @param databaseName - Name of the database
     * @param tableName - Name of the table
     * @returns - Promise resolving to boolean indicating if the table exists
     */
    public static async checkTableExists(databaseName: string, tableName: string): Promise<boolean> {
        try {
            await glueClient.send(new GetTableCommand({ DatabaseName: databaseName, Name: tableName }));
            return true;
        } catch (err) {
            if (err.name === 'EntityNotFoundException') {
                return false;
            }
            console.error('Error checking table existence:', err);
            throw err; // Rethrow the error to be handled by the caller
        }
    }

    /**
     * To list tables in a database
     * @param databaseName - Name of the database
     * @param nextToken - Token for paginated results (optional)
     * @returns - Promise resolving to an object containing tables, next token, and isTruncated status
     */
    public static async listTables(databaseName: string, nextToken?: string) {
        try {
            const response = await glueClient.send(new GetTablesCommand({
                DatabaseName: databaseName,
                NextToken: nextToken
            }));

            return {
                tables: response.TableList || [],
                nextToken: response.NextToken,
                isTruncated: Boolean(response.NextToken)
            };
        } catch (err) {
            console.error('Error listing tables:', err);
            throw err; // Rethrow the error to be handled by the caller
        }
    }

    /**
     * To delete a table from a database
     * @param databaseName - Name of the database
     * @param tableName - Name of the table
     */
    public static async deleteTable(databaseName: string, tableName: string) {
        try {
            await glueClient.send(new DeleteTableCommand({ DatabaseName: databaseName, Name: tableName }));
            console.log(`Table ${tableName} deleted successfully from database ${databaseName}`);
        } catch (err) {
            console.error('Error deleting table:', err);
            throw err; // Rethrow the error to be handled by the caller
        }
    }
}
