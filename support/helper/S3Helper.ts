import { S3 } from '@aws-sdk/client-s3'


// Initialize S3 client
const s3 = new S3();

export default class S3Helper{
    /** 
     * To read S3 bucket contents
     * @param bucketName - S3 bucket name
     * @param folderPath - name of the folder
     */

    // Function to check if a folder exists in an S3 bucket
    public static async checkFolderExists(bucketName: string, folderPath: string): Promise<boolean> {
        try {
            // List objects in the folder
            const response = await s3.listObjectsV2({
                Bucket: bucketName,
                Prefix: folderPath,
                Delimiter: '/'
            });

            // Check if any objects were found in the folder
            return response.KeyCount! > 0;
        } catch (err) {
            console.error('Error checking folder existence:', err);
            return false;
        }
    }

    public static async listFolderContents(bucketName: string, folderPath: string, continuationToken?: string) {
        try {
            const params = {
                Bucket: bucketName,
                Prefix: folderPath,
                ...(continuationToken && { ContinuationToken: continuationToken }) // Handle pagination
            };
            
            const response = await s3.listObjectsV2(params);
            return {
                contents: response.Contents || [],
                isTruncated: response.IsTruncated,
                nextContinuationToken: response.NextContinuationToken
            };
        } catch (err) {
            console.error('Error listing folder contents:', err);
            throw err; // Rethrow the error to be handled by the caller
        }
    }

    public static async deleteS3Folders(bucketName: string, folderNamePrefix: string) {
        try {
            let isTruncated = true;
            let continuationToken: string | undefined;
            let objectsToDelete: string[] = [];
            
            while (isTruncated) {
                const result = await S3Helper.listFolderContents(bucketName, folderNamePrefix, continuationToken);
                const objects = result.contents;

                if (objects.length > 0) {
                    // Prepare delete parameters
                    const deleteParams = {
                        Bucket: bucketName,
                        Delete: {
                            Objects: objects.map((object) => ({ Key: object.Key! }))
                        }
                    };

                    // Delete objects
                    const deleteResponse = await s3.deleteObjects(deleteParams);
                    console.log('Deleted objects:', deleteResponse.Deleted);

                    // If needed, log the errors
                    if (deleteResponse.Errors && deleteResponse.Errors.length > 0) {
                        console.error('Errors during deletion:', deleteResponse.Errors);
                    }
                }

                isTruncated = result.isTruncated;
                continuationToken = result.nextContinuationToken;
            }
        } catch (err) {
            console.error('Error deleting S3 folders:', err);
            throw err; // Rethrow the error to be handled by the caller
        }
    }

}