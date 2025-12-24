import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const s3Client = new S3Client({
    region: process.env.AWS_REGION || "us-east-1",
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
    },
    // If using Cloudflare R2, you might need endpoint: process.env.S3_ENDPOINT
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET || "hazyloops-assets";

export async function getDownloadUrl(fileKey: string) {
    const command = new GetObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileKey,
    });

    // URL valid for 1 hour
    return await getSignedUrl(s3Client, command, { expiresIn: 3600 });
}

export async function getUploadUrl(fileKey: string, contentType: string) {
    const command = new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileKey,
        ContentType: contentType,
    });

    return await getSignedUrl(s3Client, command, { expiresIn: 300 });
}
