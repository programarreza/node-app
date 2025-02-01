import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import fs from 'fs';
import s3Client from '../config/awsConfig';
import { UploadedFile } from '../app/interfaces/file';
import config from '../config/config';

const uploadImageToS3 = async (file: UploadedFile): Promise<string | null> => {
   try {
      // Read file from local path
      const fileBuffer = fs.readFileSync(file.path);

      // S3 upload parameters
      const params = {
         Bucket: config.aws_bucket_name,
         Key: file.filename,
         Body: fileBuffer,
      };

      // Upload file to S3
      await s3Client.send(new PutObjectCommand(params));

      // Generate the URL of the uploaded file
      const uploadUrl = `https://${config.aws_bucket_name}.s3.${config.aws_region}.amazonaws.com/${file.filename}`;
      return uploadUrl;
   } catch (error) {
      console.error('Error uploading file to S3:', error);
      return null;
   } finally {
      // Clean up the file if it’s no longer needed locally
      try {
         fs.unlinkSync(file.path);
      } catch (unlinkError) {
         console.warn('Warning: Failed to delete local file:', unlinkError);
      }
   }
};

export default uploadImageToS3;
