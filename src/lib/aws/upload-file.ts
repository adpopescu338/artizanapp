import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { v4 as uuidv4 } from 'uuid'

const BUCKET_NAME = 'image-bucket'

export enum FilePurpose {
  PROFILE_IMAGE = 'profile_image',
  PRODUCT_IMAGE = 'product_image',
  COMMENT_IMAGE = 'comment_image',
  REVIEW_IMAGE = 'review_image',
  SELLER_PROFILE_IMAGE = 'seller_profile_image',
}

const getFileUploadClient = () => {
  if (process.env.LOCAL === 'true') {
    // adjust to work with localstack
    return new S3Client({
      region: 'us-east-1',
      endpoint: 'http://localhost:4566',
      credentials: {
        accessKeyId: 'test',
        secretAccessKey: 'test',
      },
    })
  }

  return new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  })
}

export const uploadFile = async (base64: string, purpose: FilePurpose) => {
  const fileType = base64.split(';')[0].split('/')[1]
  // Generate a unique filename
  const fileName = `${uuidv4()}.${fileType}`

  // Upload the image to S3
  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: `${purpose}/${fileName}`,
    Body: Buffer.from(base64.replace(/^data:image\/\w+;base64,/, ''), 'base64'),
    ContentType: `image/${fileType}`,
    ACL: 'public-read',
  } as const

  const result = await getFileUploadClient().send(
    new PutObjectCommand(uploadParams)
  )

  // return the public URL
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${purpose}/${fileName}`
}
