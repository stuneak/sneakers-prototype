import { Client } from 'minio';

// Initialize the MinIO client
const minioClient = new Client({
	endPoint: process.env.MINIO_PUBLIC_ENDPOINT, // Your MinIO server address
	port: process.env.MINIO_S3_PORT, // MinIO API port
	useSSL: process.env.MINIO_S3_SSL === 'true', // Set to true if you're using HTTPS
	accessKey: process.env.MINIO_ROOT_USER, // From your docker-compose.yml
	secretKey: process.env.MINIO_ROOT_PASSWORD, // From your docker-compose.yml
});

// const protocol = process.env.MINIO_S3_SSL === 'true' ? 'https://' : 'http://';
// const endPoint = process.env.MINIO_PUBLIC_ENDPOINT;
// const port =
// 	process.env.MINIO_S3_SSL === 'true' ? '' : `:${process.env.MINIO_S3_PORT}`;

export const UPLOAD_TEMPORARY_BUCKET = 'marker-uploads-t';
export const UPLOAD_PERMANENT_BUCKET = 'marker-uploads';

// Example: Create a bucket if it doesn't exist
async function createBucket(bucketName) {
	try {
		// Check if the bucket already exists
		const exists = await minioClient.bucketExists(bucketName);
		if (exists) {
			console.log(`Bucket '${bucketName}' already exists`);
			return;
		}

		await minioClient.makeBucket(bucketName);
		console.log(`Bucket '${bucketName}' created successfully`);
	} catch (err) {
		console.error(`Error creating bucket '${bucketName}':`, err);
	}
}

// Example: Upload a file
export async function uploadFile(bucketName, objectName, filePath, metaData) {
	try {
		await minioClient.fPutObject(bucketName, objectName, filePath, metaData);
		console.log(`File uploaded successfully to '${bucketName}/${objectName}'`);
	} catch (err) {
		console.error('Error uploading file:', err);
	}
}

// Example: Download a file
export async function downloadFile(bucketName, objectName, filePath) {
	try {
		await minioClient.fGetObject(bucketName, objectName, filePath);
		console.log(`File downloaded successfully to '${filePath}'`);
	} catch (err) {
		console.error('Error downloading file:', err);
	}
}

// Upload a file from a stream
export async function uploadFileFromStream(
	bucketName,
	objectName,
	stream,
	size,
	metaData
) {
	const encodedObjectName = encodeURIComponent(objectName);

	return new Promise((resolve, reject) => {
		minioClient.putObject(
			bucketName,
			encodedObjectName,
			stream,
			size,
			metaData,
			(err, etag) => {
				if (err) {
					console.error('Error uploading file from stream:', err);
					reject(err);
					return;
				}
				console.log(
					`File uploaded successfully from stream to '${bucketName}/${encodedObjectName}'`
				);

				resolve(`$b:${bucketName}$o:${encodedObjectName}`);
			}
		);
	});
}

function parseFileUrl(input) {
	const regex = /\$b:(.*?)\$o:(.*)/;
	const match = input.match(regex);

	if (match) {
		return {
			bucketName: match[1],
			objectName: match[2],
		};
	}
	return null;
}

export async function getTemporarySignedUrl(fileUrl) {
	try {
		const { bucketName, objectName } = parseFileUrl(fileUrl);
		// MinIO client uses a different method for presigned URLs
		const presignedUrl = await minioClient.presignedGetObject(
			bucketName,
			objectName,
			86400 // 24 hours in seconds
		);
		console.log('Parsed bucket:', bucketName);
		console.log('Parsed object:', objectName);
		console.log('presignedUrl', presignedUrl);
		return presignedUrl;
	} catch (err) {
		console.error('Error generating presigned URL:', err);
		throw err; // Re-throw to allow handling by caller
	}
}

// Execute the examples
(async () => {
	await createBucket(UPLOAD_TEMPORARY_BUCKET);
	await createBucket(UPLOAD_PERMANENT_BUCKET);
})();
