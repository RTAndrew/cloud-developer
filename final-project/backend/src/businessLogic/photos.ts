import * as uuid from 'uuid'
import PhotosAccess from "../dataLayer/photosAccess"
import { PhotoItem } from "../models/PhotoItem"
import { CreatePhotoRequest } from "../requests/CreatePhotoRequest"
import { PhotoUpdate } from '../models/PhotoUpdate'
import { getAttachmentUrl } from './attachmentUrl'


const photosAcess = new PhotosAccess()

export async function getPhotos(userId: string): Promise<PhotoItem[]> {
    const result = await photosAcess.getPhotos(userId)

    for (const photo of result) {
        const url = await getAttachmentUrl(photo.photoId)

        if (url)
            photo.attachmentUrl = url
    }

    return result
}

export async function createPhoto(userId: string, createPhotoRequest: CreatePhotoRequest): Promise<PhotoItem> {
    const photoId = uuid.v4()
    const createdAt = new Date().toISOString()
    const photoItem: PhotoItem = {
        userId,
        photoId,
        createdAt,
        done: false,
        ...createPhotoRequest
    }
    await photosAcess.createPhoto(photoItem)

    return photoItem
}

export async function updatePhoto(userId: string, photoId: string, photoUpdate: PhotoUpdate): Promise<void> {
    return await photosAcess.updatePhoto(userId, photoId, photoUpdate)
}

export async function deletePhoto(userId: string, photoId: string): Promise<void> {
    return await photosAcess.deletePhoto(userId, photoId)
}

export async function getPhotoById(userId: string, photoId: string): Promise<AWS.DynamoDB.QueryOutput> {
    return await photosAcess.getPhotoById(userId, photoId)
}
