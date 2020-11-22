import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { config } from '../config'
import { PhotoItem } from '../models/PhotoItem'
import { PhotoUpdate } from '../models/PhotoUpdate'


const XAWS = AWSXRay.captureAWS(AWS)

export default class PhotosAccess {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly photosTable = config.photosTable,
        private readonly createdAtIndex = config.createdAtIndex
    ) { }

    async getPhotos(userId: string): Promise<PhotoItem[]> {
        const result = await this.docClient.query({
            TableName: this.photosTable,
            IndexName: this.createdAtIndex,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise()

        return result.Items as PhotoItem[]
    }

    async getPhotoById(userId: string, photoId: string): Promise<AWS.DynamoDB.QueryOutput> {
        return await this.docClient.query({
            TableName: this.photosTable,
            KeyConditionExpression: 'userId = :user and photoId = :photo',
            ExpressionAttributeValues: {
                ":user": userId,
                ":photo": photoId
            }
        }).promise()
    }

    async createPhoto(photoItem: PhotoItem): Promise<void> {
        await this.docClient.put({
            TableName: this.photosTable,
            Item: photoItem
        }).promise()
    }

    async updatePhoto(userId: string, photoId: string, photoUpdate: PhotoUpdate): Promise<void> {
        await this.docClient.update({
            TableName: this.photosTable,
            Key: {
                userId,
                photoId
            },
            UpdateExpression: 'SET #name = :n, dueDate = :due, done = :d',
            ExpressionAttributeValues: {
                ":n": photoUpdate.name,
                ":due": photoUpdate.dueDate,
                ":d": photoUpdate.done
            },
            ExpressionAttributeNames: {
                "#name": "name"
            }
        }).promise()
    }

    async deletePhoto(userId: string, photoId: string): Promise<void> {
        await this.docClient.delete({
            TableName: this.photosTable,
            Key: {
                userId,
                photoId
            }
        }).promise()
    }
}