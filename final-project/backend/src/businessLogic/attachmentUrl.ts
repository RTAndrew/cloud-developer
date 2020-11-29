
import AttachmentsStorage from '../dataLayer/attachmentsStorage'


const attachmentStorage = new AttachmentsStorage()

export async function getAttachmentUrl(photoId: string): Promise<string> {
    return await attachmentStorage.getAttachmentUrl(photoId)
}

export function getPresignedUrl(photoId: string): string | null {
    return attachmentStorage.getPresignedUrl(photoId)
}